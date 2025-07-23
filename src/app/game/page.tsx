"use client";
import { useState, useEffect } from 'react';
import { RotateCw, CheckCircle, Clock } from 'lucide-react';

export default function GamePage() {
    const [gameState, setGameState] = useState<'spinning' | 'playing' | 'results'>('spinning');
    const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
    const [timeLeft, setTimeLeft] = useState<number>(30);
    const [categories, setCategories] = useState<string[]>([]);
    const [responses, setResponses] = useState<Record<string, string>>({});

    // Simular giro de ruleta
    useEffect(() => {
        if (gameState === 'spinning') {
            const timer = setTimeout(() => {
                const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
                const randomLetter = letters[Math.floor(Math.random() * letters.length)];
                setSelectedLetter(randomLetter);
                setGameState('playing');
                setTimeLeft(30);
                setCategories(['Nombre', 'Lugar', 'Animal', 'Objeto', 'Color', 'Fruta']);
            }, 2000);

            return () => clearTimeout(timer);
        }
        return undefined; // Explicit return for non-spinning state
    }, [gameState]);

    // Temporizador del juego
    useEffect(() => {
        if (gameState === 'playing' && timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else if (gameState === 'playing' && timeLeft === 0) {
            setGameState('results');
        }
        return undefined; // Explicit return for all paths
    }, [gameState, timeLeft]);

    const handleInputChange = (category: string, value: string) => {
        setResponses(prev => ({ ...prev, [category]: value }));
    };

    const handleStopGame = () => {
        setGameState('results');
    };

    const handlePlayAgain = () => {
        setGameState('spinning');
        setSelectedLetter(null);
        setResponses({});
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 p-6">
            <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="bg-blue-600 p-4 text-white">
                    <h1 className="text-2xl font-bold text-center">STOP</h1>
                </div>

                <div className="p-6">
                    {gameState === 'spinning' && (
                        <div className="text-center py-8">
                            <RotateCw className="w-12 h-12 mx-auto animate-spin text-blue-500" />
                            <h2 className="text-xl font-semibold mt-4">Girando la ruleta...</h2>
                        </div>
                    )}

                    {gameState === 'playing' && selectedLetter && (
                        <>
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-semibold">Letra seleccionada: {selectedLetter}</h2>
                                <div className="flex items-center text-blue-600">
                                    <Clock className="mr-2" />
                                    <span>Tiempo: {timeLeft}s</span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {categories.map((category) => (
                                    <div key={category} className="flex items-center">
                                        <input
                                            type="checkbox"
                                            className="mr-3 h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                            checked={!!responses[category]}
                                            readOnly
                                        />
                                        <input
                                            type="text"
                                            className="flex-1 border-b-2 border-blue-200 focus:border-blue-500 outline-none px-2 py-1"
                                            value={responses[category] || ''}
                                            onChange={(e) => handleInputChange(category, e.target.value)}
                                            placeholder={category}
                                        />
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={handleStopGame}
                                className="mt-8 w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-4 rounded-lg"
                            >
                                ¡STOP!
                            </button>
                        </>
                    )}

                    {gameState === 'results' && (
                        <div className="text-center py-8">
                            <CheckCircle className="w-12 h-12 mx-auto text-green-500" />
                            <h2 className="text-xl font-semibold mt-4">¡Tiempo terminado!</h2>

                            <div className="mt-6 space-y-4 text-left">
                                {categories.map((category) => (
                                    <div key={category} className="flex items-center">
                                        <input
                                            type="checkbox"
                                            className="mr-3 h-5 w-5 rounded border-gray-300 text-blue-600"
                                            checked={!!responses[category]}
                                            readOnly
                                        />
                                        <span className="font-medium w-24">{category}:</span>
                                        <span className="flex-1">{responses[category] || '---'}</span>
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={handlePlayAgain}
                                className="mt-8 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg"
                            >
                                Jugar de nuevo
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}