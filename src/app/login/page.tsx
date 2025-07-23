"use client";
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export default function LoginPage() {
    const [language, setLanguage] = useState<'es' | 'en'>('es');

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
            {/* Logo */}
            <div className="mb-8">
                <Image
                    src="/logo.png" // Asegúrate de tener el logo en public/logo.png
                    alt="Logo STOP"
                    width={150}
                    height={150}
                    className="mx-auto"
                />
            </div>

            {/* Selector de idioma */}
            <div className="mb-8 flex items-center gap-2">
                <Button
                    variant={language === 'es' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setLanguage('es')}
                >
                    Español
                </Button>
                <Button
                    variant={language === 'en' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setLanguage('en')}
                >
                    English
                </Button>
            </div>

            {/* Botón de Acceder */}
            <Button className="w-full max-w-xs py-6 text-lg">
                {language === 'es' ? 'Acceder' : 'Login'}
            </Button>

            {/* Versión del juego */}
            <p className="mt-8 text-gray-500">Verso 4</p>
        </div>
    );
}