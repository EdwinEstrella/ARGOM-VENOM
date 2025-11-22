import express from 'express';
import cors from 'cors';
import authRoutes from './auth.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
    origin: ['http://localhost:5173', 'https://argom.ibpau.rest', 'http://localhost:3000'],
    credentials: true
}));
app.use(express.json());

// Rutas
app.use('/api/auth', authRoutes);

// Ruta de health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Ruta por defecto
app.get('/', (req, res) => {
    res.json({ message: 'Argom Venom Auth Server' });
});

// Manejo de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Error interno del servidor' });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor de autenticación corriendo en puerto ${PORT}`);
    console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
});

export default app;