import React, { useState, useEffect } from 'react';
import { TelegramConfig, TelegramMessage } from '../types';
import { Card } from './Card';
import { Switch } from './Switch';

interface TelegramScraperProps {
    config: TelegramConfig;
    onConfigChange: (config: TelegramConfig) => void;
}

export const TelegramScraper: React.FC<TelegramScraperProps> = ({ config, onConfigChange }) => {
    const [messages, setMessages] = useState<TelegramMessage[]>([]);
    const [isConnected, setIsConnected] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected' | 'error'>('disconnected');
    const [newGroup, setNewGroup] = useState('');
    const [newKeyword, setNewKeyword] = useState('');

    // Set up event listeners for real Telegram messages
    useEffect(() => {
        if (window.electronAPI) {
            // Listen for real messages
            const handleMessage = (message: TelegramMessage) => {
                setMessages(prev => [message, ...prev].slice(0, 50));
            };

            const handleLog = (log: string) => {
                console.log('Telegram scraper:', log);
            };

            const handleError = (error: string) => {
                console.error('Telegram scraper error:', error);
            };

            const handleDisconnected = () => {
                setConnectionStatus('disconnected');
                setIsConnected(false);
            };

            window.electronAPI.onTelegramMessage(handleMessage);
            window.electronAPI.onTelegramLog(handleLog);
            window.electronAPI.onTelegramError(handleError);
            window.electronAPI.onTelegramDisconnected(handleDisconnected);

            return () => {
                // Clean up listeners
                // Note: In a real implementation, you'd want to remove listeners
                // but the current API doesn't provide a remove method
            };
        }
    }, []);

    useEffect(() => {
        // Simulate receiving messages for demonstration
        if (config.isActive && isConnected) {
            const interval = setInterval(() => {
                const mockMessage: TelegramMessage = {
                    id: Date.now(),
                    group: config.groups[0] || 'Demo Group',
                    message: `🚀 New token launch: ${Math.random().toString(36).substring(7)} with great potential!`,
                    timestamp: new Date().toLocaleTimeString(),
                    processed: false
                };
                setMessages(prev => [mockMessage, ...prev].slice(0, 50)); // Keep last 50 messages
            }, 10000); // New message every 10 seconds for demo

            return () => clearInterval(interval);
        }
    }, [config.isActive, isConnected, config.groups]);

    const handleConnect = async () => {
        if (!config.apiId || !config.apiHash || !config.phone) {
            alert('Please fill in all Telegram API credentials first');
            return;
        }

        setConnectionStatus('connecting');

        try {
            // Use the Electron API to start the Telegram scraper
            if (window.electronAPI) {
                const result = await window.electronAPI.startTelegramScraper(config);
                if (result.success) {
                    setConnectionStatus('connected');
                    setIsConnected(true);
                } else {
                    setConnectionStatus('error');
                    console.error('Failed to connect to Telegram:', result.error);
                }
            } else {
                // Fallback for development without Electron
                await new Promise(resolve => setTimeout(resolve, 2000));
                setConnectionStatus('connected');
                setIsConnected(true);
            }
        } catch (error: any) {
            setConnectionStatus('error');
            console.error('Failed to connect to Telegram:', error);
        }
    };

    const handleDisconnect = async () => {
        setConnectionStatus('disconnected');
        setIsConnected(false);

        try {
            if (window.electronAPI) {
                await window.electronAPI.stopTelegramScraper();
            }
        } catch (error: any) {
            console.error('Failed to stop Telegram scraper:', error);
        }
    };

    const addGroup = () => {
        if (newGroup.trim()) {
            onConfigChange({
                ...config,
                groups: [...config.groups, newGroup.trim()]
            });
            setNewGroup('');
        }
    };

    const removeGroup = (index: number) => {
        onConfigChange({
            ...config,
            groups: config.groups.filter((_, i) => i !== index)
        });
    };

    const addKeyword = () => {
        if (newKeyword.trim()) {
            onConfigChange({
                ...config,
                keywords: [...config.keywords, newKeyword.trim()]
            });
            setNewKeyword('');
        }
    };

    const removeKeyword = (index: number) => {
        onConfigChange({
            ...config,
            keywords: config.keywords.filter((_, i) => i !== index)
        });
    };

    const clearMessages = () => {
        setMessages([]);
    };

    const getConnectionColor = () => {
        switch (connectionStatus) {
            case 'connected': return 'text-green-500';
            case 'connecting': return 'text-yellow-500';
            case 'error': return 'text-red-500';
            default: return 'text-gray-500';
        }
    };

    const getConnectionText = () => {
        switch (connectionStatus) {
            case 'connected': return 'Connected';
            case 'connecting': return 'Connecting...';
            case 'error': return 'Connection Error';
            default: return 'Disconnected';
        }
    };

    return (
        <div className="space-y-6">
            {/* Connection Status */}
            <Card title="Telegram Connection">
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-[#EAEAEA] text-base font-medium">Status</p>
                            <p className={`text-sm ${getConnectionColor()}`}>{getConnectionText()}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Switch
                                checked={config.isActive}
                                onChange={(checked) => onConfigChange({ ...config, isActive: checked })}
                            />
                            <span className="text-[#EAEAEA] text-sm font-medium">Active</span>
                        </div>
                    </div>

                    {!isConnected ? (
                        <button
                            onClick={handleConnect}
                            disabled={connectionStatus === 'connecting'}
                            className="w-full bg-primary hover:bg-primary/90 disabled:bg-[#3c3c53] text-background-dark font-medium py-2 px-4 rounded-lg transition-colors disabled:cursor-not-allowed"
                        >
                            {connectionStatus === 'connecting' ? 'Connecting...' : 'Connect to Telegram'}
                        </button>
                    ) : (
                        <button
                            onClick={handleDisconnect}
                            className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                        >
                            Disconnect
                        </button>
                    )}
                </div>
            </Card>

            {/* API Configuration */}
            <Card title="API Configuration">
                <div className="flex flex-col gap-4">
                    <label className="flex flex-col flex-1">
                        <p className="text-[#EAEAEA] text-base font-medium leading-normal pb-2">API ID</p>
                        <input
                            className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-0 border border-[#3c3c53] bg-[#121212] focus:border-primary h-12 placeholder:text-[#9d9db8] px-4 text-base font-normal leading-normal"
                            placeholder="Enter your Telegram API ID"
                            type="text"
                            value={config.apiId}
                            onChange={(e) => onConfigChange({ ...config, apiId: e.target.value })}
                        />
                    </label>
                    <label className="flex flex-col flex-1">
                        <p className="text-[#EAEAEA] text-base font-medium leading-normal pb-2">API Hash</p>
                        <input
                            className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-0 border border-[#3c3c53] bg-[#121212] focus:border-primary h-12 placeholder:text-[#9d9db8] px-4 text-base font-normal leading-normal"
                            placeholder="Enter your Telegram API Hash"
                            type="password"
                            value={config.apiHash}
                            onChange={(e) => onConfigChange({ ...config, apiHash: e.target.value })}
                        />
                    </label>
                    <label className="flex flex-col flex-1">
                        <p className="text-[#EAEAEA] text-base font-medium leading-normal pb-2">Phone Number</p>
                        <input
                            className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-0 border border-[#3c3c53] bg-[#121212] focus:border-primary h-12 placeholder:text-[#9d9db8] px-4 text-base font-normal leading-normal"
                            placeholder="+1234567890"
                            type="tel"
                            value={config.phone}
                            onChange={(e) => onConfigChange({ ...config, phone: e.target.value })}
                        />
                    </label>
                </div>
            </Card>

            {/* Groups to Monitor */}
            <Card title="Groups to Monitor">
                <div className="flex flex-col gap-4">
                    <div className="flex gap-2">
                        <input
                            className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-0 border border-[#3c3c53] bg-[#121212] focus:border-primary h-12 placeholder:text-[#9d9db8] px-4 text-base font-normal leading-normal"
                            placeholder="Enter group name or username"
                            type="text"
                            value={newGroup}
                            onChange={(e) => setNewGroup(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && addGroup()}
                        />
                        <button
                            onClick={addGroup}
                            className="flex min-w-[84px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg h-12 px-4 bg-primary text-background-dark text-base font-bold leading-normal tracking-[0.015em] hover:bg-opacity-90 transition-all"
                        >
                            Add
                        </button>
                    </div>
                    <div className="flex flex-col gap-2 max-h-32 overflow-y-auto">
                        {config.groups.map((group, index) => (
                            <div key={index} className="flex items-center justify-between bg-[#2A2A2E] p-3 rounded-lg border border-[#292938]">
                                <span className="text-[#EAEAEA] text-sm">{group}</span>
                                <button
                                    onClick={() => removeGroup(index)}
                                    className="text-red-400 hover:text-red-300 text-sm font-medium"
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </Card>

            {/* Keywords to Track */}
            <Card title="Keywords to Track">
                <div className="flex flex-col gap-4">
                    <div className="flex gap-2">
                        <input
                            className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-0 border border-[#3c3c53] bg-[#121212] focus:border-primary h-12 placeholder:text-[#9d9db8] px-4 text-base font-normal leading-normal"
                            placeholder="Enter keyword to track"
                            type="text"
                            value={newKeyword}
                            onChange={(e) => setNewKeyword(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && addKeyword()}
                        />
                        <button
                            onClick={addKeyword}
                            className="flex min-w-[84px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg h-12 px-4 bg-primary text-background-dark text-base font-bold leading-normal tracking-[0.015em] hover:bg-opacity-90 transition-all"
                        >
                            Add
                        </button>
                    </div>
                    <div className="flex flex-col gap-2 max-h-32 overflow-y-auto">
                        {config.keywords.map((keyword, index) => (
                            <div key={index} className="flex items-center justify-between bg-[#2A2A2E] p-3 rounded-lg border border-[#292938]">
                                <span className="text-[#EAEAEA] text-sm">{keyword}</span>
                                <button
                                    onClick={() => removeKeyword(index)}
                                    className="text-red-400 hover:text-red-300 text-sm font-medium"
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </Card>

            {/* Messages Feed */}
            <Card title="Messages Feed" className="max-h-96">
                <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                        <p className="text-[#EAEAEA] text-sm">Real-time messages from monitored groups</p>
                        <button
                            onClick={clearMessages}
                            className="text-primary hover:text-primary/80 text-sm font-medium"
                        >
                            Clear
                        </button>
                    </div>
                    <div className="flex flex-col gap-2 max-h-64 overflow-y-auto">
                        {messages.length === 0 ? (
                            <p className="text-[#A0A0A0] text-center py-8">
                                {isConnected ? 'Waiting for messages...' : 'Connect to Telegram to start receiving messages'}
                            </p>
                        ) : (
                            messages.map((message) => (
                                <div key={message.id} className="bg-[#2A2A2E] p-3 rounded-lg border border-[#292938] space-y-2">
                                    <div className="flex justify-between items-start">
                                        <span className="text-primary text-sm font-medium">{message.group}</span>
                                        <span className="text-[#A0A0A0] text-xs">{message.timestamp}</span>
                                    </div>
                                    <p className="text-[#EAEAEA] text-sm leading-relaxed">{message.message}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </Card>
        </div>
    );
};