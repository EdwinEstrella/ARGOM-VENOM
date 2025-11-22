import React, { useState, useEffect } from 'react';
import { Card } from './Card';

interface LoginProps {
    onLogin: (isAuthenticated: boolean, user: string) => void;
    isAuthenticated: boolean;
    currentUser?: string;
}

export const Login: React.FC<LoginProps> = ({ onLogin, isAuthenticated, currentUser }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [rememberMe, setRememberMe] = useState(true);
    const [showPassword, setShowPassword] = useState(false);

    // Credenciales válidas
    const VALID_CREDENTIALS = {
        username: 'Marcos',
        password: 'memecoins2025'
    };

    // Usuario de prueba
    const DEMO_CREDENTIALS = {
        username: 'demo',
        password: 'demo123'
    };

    // Al montar, verificar si hay una sesión guardada
    useEffect(() => {
        checkExistingSession();
    }, []);

    const checkExistingSession = async () => {
        try {
            // Verificar en localStorage
            const cachedSession = localStorage.getItem('argomVenomSession');
            if (cachedSession) {
                const sessionData = JSON.parse(cachedSession);

                // Verificar si la sesión aún es válida (no ha expirado)
                if (sessionData.expiresAt > Date.now()) {
                    console.log('✅ Sesión caché encontrada para:', sessionData.username);
                    onLogin(true, sessionData.username);
                    return;
                }
                // Si expiró, limpiar
                localStorage.removeItem('argomVenomSession');
            }
        } catch (error) {
            console.error('Error checking existing session:', error);
        }
    };

    const cacheSession = (username: string) => {
        if (rememberMe) {
            const sessionData = {
                username,
                loginTime: Date.now(),
                expiresAt: Date.now() + (7 * 24 * 60 * 60 * 1000) // 7 días
            };
            localStorage.setItem('argomVenomSession', JSON.stringify(sessionData));
            console.log('💾 Sesión guardada en caché para:', username);
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        // Validar credenciales (incluyendo usuario demo)
        const isValidMainUser = username === VALID_CREDENTIALS.username && password === VALID_CREDENTIALS.password;
        const isValidDemoUser = username === DEMO_CREDENTIALS.username && password === DEMO_CREDENTIALS.password;

        if (isValidMainUser || isValidDemoUser) {
            try {
                // Cache local si rememberMe está activado
                cacheSession(username);

                onLogin(true, username);
                setError('');
                console.log('✅ Login exitoso para:', username);

                // TODO: Integrar con servidor cuando esté disponible
                // await saveSessionToServer(username);

            } catch (error) {
                console.error('Error en login:', error);
                setError('Error de conexión');
            }
        } else {
            setError('Credenciales incorrectas');
            console.log('❌ Credenciales inválidas');
        }

        setIsLoading(false);
    };

    const handleLogout = async () => {
        try {
            // Limpiar caché local
            localStorage.removeItem('argomVenomSession');
            console.log('🗑️ Sesión eliminada de caché');

            onLogin(false, '');
            setUsername('');
            setPassword('');

            // TODO: Integrar con servidor cuando esté disponible
            // await clearSessionFromServer(currentUser);

        } catch (error) {
            console.error('Error en logout:', error);
        }
    };

    // Si ya está autenticado, mostrar panel de control
    if (isAuthenticated && currentUser) {
        return (
            <Card title="Panel de Control de Usuario">
                <div className="flex flex-col gap-4">
                    <div className="bg-[#2A2A2E] p-4 rounded-lg border border-[#292938]">
                        <h3 className="text-white text-lg font-semibold mb-2">Bienvenido, {currentUser}!</h3>
                        <p className="text-[#A0A0A0] text-sm">Sesión activa y permanente</p>
                        <div className="mt-3 flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-green-400 text-sm">Conectado</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-[#1A1A1D] p-3 rounded-lg border border-[#292938]">
                            <p className="text-[#A0A0A0] text-xs uppercase tracking-wider">Usuario</p>
                            <p className="text-white text-sm font-medium">{currentUser}</p>
                        </div>
                        <div className="bg-[#1A1A1D] p-3 rounded-lg border border-[#292938]">
                            <p className="text-[#A0A0A0] text-xs uppercase tracking-wider">Nivel</p>
                            <p className="text-primary text-sm font-medium">Premium</p>
                        </div>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                    >
                        Cerrar Sesión
                    </button>
                </div>
            </Card>
        );
    }

    // Formulario de login
    return (
        <Card title="Panel de Autenticación">
            <form onSubmit={handleLogin} className="flex flex-col gap-4">
                <div className="mb-4">
                    <h2 className="text-white text-xl font-bold mb-2">Argom Venom</h2>
                    <p className="text-[#A0A0A0] text-sm">
                        Inicia sesión para acceder al sistema de trading y Telegram scraper
                    </p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                        <p className="text-red-400 text-sm">{error}</p>
                    </div>
                )}

                <div className="flex flex-col gap-4">
                    <label className="flex flex-col">
                        <p className="text-[#EAEAEA] text-base font-medium leading-normal pb-2">
                            Usuario
                        </p>
                        <input
                            className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-0 border border-[#3c3c53] bg-[#121212] focus:border-primary h-12 placeholder:text-[#9d9db8] px-4 text-base font-normal leading-normal"
                            type="text"
                            placeholder="Ingresa tu usuario"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            disabled={isLoading}
                            autoComplete="username"
                        />
                    </label>

                    <label className="flex flex-col">
                        <p className="text-[#EAEAEA] text-base font-medium leading-normal pb-2">
                            Contraseña
                        </p>
                        <div className="relative">
                            <input
                                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-0 border border-[#3c3c53] bg-[#121212] focus:border-primary h-12 placeholder:text-[#9d9db8] px-4 pr-12 text-base font-normal leading-normal"
                                type={showPassword ? "text" : "password"}
                                placeholder="Ingresa tu contraseña"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={isLoading}
                                autoComplete="current-password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                disabled={isLoading}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#9d9db8] hover:text-[#EAEAEA] transition-colors disabled:cursor-not-allowed"
                                title={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                            >
                                {showPassword ? (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                    </svg>
                                ) : (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            className="w-4 h-4 rounded border-[#3c3c53] bg-[#121212] text-primary focus:ring-primary focus:ring-2"
                        />
                        <span className="text-[#EAEAEA] text-sm">
                            Mantener sesión activa (recomendado)
                        </span>
                    </label>
                </div>

                <button
                    type="submit"
                    disabled={isLoading || !username || !password}
                    className="w-full bg-primary hover:bg-primary/90 disabled:bg-[#3c3c53] text-background-dark font-medium py-3 px-4 rounded-lg transition-colors disabled:cursor-not-allowed"
                >
                    {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                </button>

                <div className="text-center mt-4">
                    <p className="text-[#A0A0A0] text-xs mb-2">
                        Sistema de autenticación segura y permanente
                    </p>
                    <p className="text-[#666] text-xs">
                        <span className="font-semibold">Usuario de prueba:</span> demo / demo123
                    </p>
                </div>
            </form>
        </Card>
    );
};