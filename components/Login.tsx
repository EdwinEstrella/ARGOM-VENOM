import React, { useState } from 'react';
import { Card } from './Card';
import { DottedBackground } from './ui/dotted-background';
import { api } from '../src/api';
import type { AuthStatus } from '../shared/api';

interface LoginProps {
    status: AuthStatus;
    onAuthenticated: (status: AuthStatus) => void;
}

const inputClass =
    'form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-0 border border-[#3c3c53] bg-[#121212] focus:border-primary h-12 placeholder:text-[#9d9db8] px-4 pr-12 text-base font-normal leading-normal';

const EyeIcon: React.FC<{ open: boolean }> = ({ open }) =>
    open ? (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
        </svg>
    ) : (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
    );

/**
 * Primer arranque: crea usuario y contraseña locales.
 * Siguientes arranques: pide la contraseña. Todo se valida en el proceso main.
 */
export const Login: React.FC<LoginProps> = ({ status, onAuthenticated }) => {
    const isSetup = !status.configured;
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [remember, setRemember] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (isSetup && password !== confirm) {
            setError('Las contraseñas no coinciden');
            return;
        }
        setIsLoading(true);
        try {
            const result = isSetup ? await api.auth.setup(username, password) : await api.auth.login(password, remember);
            if (result.ok) {
                onAuthenticated(result.data);
            } else {
                setError(result.error);
            }
        } catch {
            setError('No se pudo contactar con el proceso principal');
        } finally {
            setIsLoading(false);
        }
    };

    const canSubmit = !isLoading && password && (!isSetup || (username.trim() && confirm));

    return (
        <div className="relative min-h-screen">
            <DottedBackground />
            <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
                <Card>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-80 max-w-full">
                        <div className="mb-6 text-center">
                            <div className="flex justify-center mb-4">
                                <img src="./venom.ico" alt="ARGOM VENOM" className="w-20 h-20" />
                            </div>
                            <h2 className="text-3xl font-black tracking-tighter text-white mb-2">
                                ARGOM<span className="text-primary">VENOM</span>
                            </h2>
                            <p className="text-[#A0A0A0] text-sm">
                                {isSetup
                                    ? 'Crea tu cuenta local para proteger la app'
                                    : `Hola de nuevo, ${status.username}`}
                            </p>
                        </div>

                        {error && (
                            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3" role="alert">
                                <p className="text-red-400 text-sm">{error}</p>
                            </div>
                        )}

                        {isSetup && (
                            <label className="flex flex-col">
                                <p className="text-[#EAEAEA] text-base font-medium leading-normal pb-2">Usuario</p>
                                <input
                                    className={inputClass}
                                    type="text"
                                    placeholder="Tu nombre"
                                    value={username}
                                    onChange={e => setUsername(e.target.value)}
                                    disabled={isLoading}
                                    autoComplete="username"
                                    autoFocus
                                />
                            </label>
                        )}

                        <label className="flex flex-col">
                            <p className="text-[#EAEAEA] text-base font-medium leading-normal pb-2">Contraseña</p>
                            <div className="relative">
                                <input
                                    className={inputClass}
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder={isSetup ? 'Mínimo 8 caracteres' : 'Ingresa tu contraseña'}
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    disabled={isLoading}
                                    autoComplete={isSetup ? 'new-password' : 'current-password'}
                                    autoFocus={!isSetup}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9d9db8] hover:text-[#EAEAEA] transition-colors"
                                    title={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                                >
                                    <EyeIcon open={showPassword} />
                                </button>
                            </div>
                        </label>

                        {isSetup ? (
                            <label className="flex flex-col">
                                <p className="text-[#EAEAEA] text-base font-medium leading-normal pb-2">Repite la contraseña</p>
                                <input
                                    className={inputClass}
                                    type={showPassword ? 'text' : 'password'}
                                    value={confirm}
                                    onChange={e => setConfirm(e.target.value)}
                                    disabled={isLoading}
                                    autoComplete="new-password"
                                />
                            </label>
                        ) : (
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={remember}
                                    onChange={e => setRemember(e.target.checked)}
                                    className="w-4 h-4 rounded border-[#3c3c53] bg-[#121212] text-primary focus:ring-primary focus:ring-2"
                                />
                                <span className="text-[#EAEAEA] text-sm">Mantener sesión iniciada 7 días</span>
                            </label>
                        )}

                        <button
                            type="submit"
                            disabled={!canSubmit}
                            className="w-full bg-primary hover:bg-primary/90 disabled:bg-[#3c3c53] text-background-dark font-medium py-3 px-4 rounded-lg transition-colors disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Un momento...' : isSetup ? 'Crear cuenta' : 'Iniciar sesión'}
                        </button>

                        <p className="text-[#666] text-xs text-center">
                            Tus datos se guardan solo en este equipo.
                        </p>
                    </form>
                </Card>
            </div>
        </div>
    );
};
