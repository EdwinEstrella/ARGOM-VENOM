import express from 'express';
import sqlite3 from 'sqlite3';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const router = express.Router();

// Base de datos SQLite para persistencia
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, '..', 'data', 'auth.db');

// Asegurar que el directorio de datos existe
const dataDir = path.dirname(DB_PATH);
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

// Inicializar base de datos
const db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
        console.error('Error abriendo base de datos:', err);
    } else {
        console.log('Base de datos de autenticación inicializada');
        // Crear tabla si no existe
        db.run(`
            CREATE TABLE IF NOT EXISTS user_sessions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT NOT NULL,
                login_time TEXT NOT NULL,
                last_active TEXT NOT NULL,
                user_agent TEXT,
                ip_address TEXT,
                session_token TEXT UNIQUE,
                is_active INTEGER DEFAULT 1,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `, (err) => {
            if (err) {
                console.error('Error creando tabla:', err);
            }
        });

        // Crear tabla de logs de autenticación
        db.run(`
            CREATE TABLE IF NOT EXISTS auth_logs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT NOT NULL,
                action TEXT NOT NULL,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                ip_address TEXT,
                user_agent TEXT,
                details TEXT
            )
        `);
    }
});

// Generar token de sesión seguro
function generateSessionToken() {
    return crypto.randomBytes(32).toString('hex');
}

// Middleware para registrar logs de autenticación
function logAuthEvent(username, action, req, details = null) {
    const ip = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('User-Agent') || 'Unknown';

    db.run(
        `INSERT INTO auth_logs (username, action, ip_address, user_agent, details)
         VALUES (?, ?, ?, ?, ?)`,
        [username, action, ip, userAgent, details]
    );
}

// POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { username, timestamp, userAgent } = req.body;
        const ip = req.ip || req.connection.remoteAddress;

        // Validar credenciales
        if (username !== 'Marcos') {
            logAuthEvent(username, 'FAILED_LOGIN', req, 'Usuario incorrecto');
            return res.status(401).json({ success: false, error: 'Credenciales inválidas' });
        }

        // Generar token de sesión
        const sessionToken = generateSessionToken();
        const loginTime = new Date().toISOString();

        // Limpiar sesiones anteriores del mismo usuario
        db.run(
            `UPDATE user_sessions SET is_active = 0, last_active = ? WHERE username = ? AND is_active = 1`,
            [loginTime, username]
        );

        // Insertar nueva sesión
        db.run(
            `INSERT INTO user_sessions (username, login_time, last_active, user_agent, ip_address, session_token)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [username, loginTime, loginTime, userAgent || req.get('User-Agent'), ip, sessionToken],
            function(err) {
                if (err) {
                    console.error('Error guardando sesión:', err);
                    logAuthEvent(username, 'LOGIN_ERROR', req, err.message);
                    return res.status(500).json({ success: false, error: 'Error del servidor' });
                }

                logAuthEvent(username, 'LOGIN_SUCCESS', req, `Token: ${sessionToken.substring(0, 8)}...`);

                res.json({
                    success: true,
                    sessionToken,
                    username,
                    loginTime,
                    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
                });
            }
        );

    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ success: false, error: 'Error del servidor' });
    }
});

// POST /api/auth/verify-session
router.post('/verify-session', async (req, res) => {
    try {
        const { username } = req.body;

        if (!username) {
            return res.status(400).json({ valid: false, error: 'Usuario requerido' });
        }

        // Verificar si existe una sesión activa para este usuario
        db.get(
            `SELECT * FROM user_sessions
             WHERE username = ? AND is_active = 1
             ORDER BY login_time DESC LIMIT 1`,
            [username],
            (err, row) => {
                if (err) {
                    console.error('Error verificando sesión:', err);
                    return res.status(500).json({ valid: false, error: 'Error del servidor' });
                }

                if (row) {
                    // Actualizar last_active
                    db.run(
                        `UPDATE user_sessions SET last_active = ? WHERE id = ?`,
                        [new Date().toISOString(), row.id]
                    );

                    logAuthEvent(username, 'SESSION_VERIFIED', req);
                    res.json({ valid: true, session: row });
                } else {
                    logAuthEvent(username, 'SESSION_NOT_FOUND', req);
                    res.json({ valid: false, error: 'Sesión no encontrada' });
                }
            }
        );

    } catch (error) {
        console.error('Error verificando sesión:', error);
        res.status(500).json({ valid: false, error: 'Error del servidor' });
    }
});

// GET /api/auth/current-session
router.get('/current-session', async (req, res) => {
    try {
        // Obtener la sesión más reciente activa
        db.get(
            `SELECT username, login_time, last_active
             FROM user_sessions
             WHERE is_active = 1
             ORDER BY login_time DESC LIMIT 1`,
            [],
            (err, row) => {
                if (err) {
                    console.error('Error obteniendo sesión actual:', err);
                    return res.status(500).json({ error: 'Error del servidor' });
                }

                if (row) {
                    res.json(row);
                } else {
                    res.status(404).json({ error: 'No hay sesión activa' });
                }
            }
        );

    } catch (error) {
        console.error('Error obteniendo sesión actual:', error);
        res.status(500).json({ error: 'Error del servidor' });
    }
});

// POST /api/auth/logout
router.post('/logout', async (req, res) => {
    try {
        const { username } = req.body;

        if (!username) {
            return res.status(400).json({ success: false, error: 'Usuario requerido' });
        }

        // Marcar sesión como inactiva
        db.run(
            `UPDATE user_sessions SET is_active = 0, last_active = ?
             WHERE username = ? AND is_active = 1`,
            [new Date().toISOString(), username],
            function(err) {
                if (err) {
                    console.error('Error en logout:', err);
                    logAuthEvent(username, 'LOGOUT_ERROR', req, err.message);
                    return res.status(500).json({ success: false, error: 'Error del servidor' });
                }

                logAuthEvent(username, 'LOGOUT_SUCCESS', req);
                res.json({ success: true, message: 'Sesión cerrada correctamente' });
            }
        );

    } catch (error) {
        console.error('Error en logout:', error);
        res.status(500).json({ success: false, error: 'Error del servidor' });
    }
});

// GET /api/auth/logs - Obtener logs de autenticación (solo para admin)
router.get('/logs', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 50;

        db.all(
            `SELECT * FROM auth_logs
             ORDER BY timestamp DESC
             LIMIT ?`,
            [limit],
            (err, rows) => {
                if (err) {
                    console.error('Error obteniendo logs:', err);
                    return res.status(500).json({ error: 'Error del servidor' });
                }

                res.json(rows);
            }
        );

    } catch (error) {
        console.error('Error obteniendo logs:', error);
        res.status(500).json({ error: 'Error del servidor' });
    }
});

// GET /api/auth/stats - Estadísticas de autenticación
router.get('/stats', async (req, res) => {
    try {
        db.all(
            `SELECT
                COUNT(*) as total_sessions,
                COUNT(CASE WHEN is_active = 1 THEN 1 END) as active_sessions,
                COUNT(CASE WHEN action = 'LOGIN_SUCCESS' THEN 1 END) as successful_logins,
                COUNT(CASE WHEN action = 'FAILED_LOGIN' THEN 1 END) as failed_logins
             FROM user_sessions
             LEFT JOIN auth_logs ON user_sessions.username = auth_logs`,
            [],
            (err, rows) => {
                if (err) {
                    console.error('Error obteniendo estadísticas:', err);
                    return res.status(500).json({ error: 'Error del servidor' });
                }

                res.json(rows[0]);
            }
        );

    } catch (error) {
        console.error('Error obteniendo estadísticas:', error);
        res.status(500).json({ error: 'Error del servidor' });
    }
});

export default router;