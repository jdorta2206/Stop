"use client";

import { useEffect, useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { Language } from '@/contexts/language-context';

interface RouletteWheelProps {
  isSpinning: boolean;
  onSpinComplete: (letter: string) => void;
  alphabet: string[];
  language: Language;
}

const ROULETTE_TEXTS = {
  title: {
    es: "¡Girando por una Letra!",
    en: "Spinning for a Letter!",
    fr: "Tournoiement pour une Lettre !",
    pt: "Rodando por uma Letra!"
  },
  description: {
    es: "Prepárate...",
    en: "Get ready...",
    fr: "Préparez-vous...",
    pt: "Prepare-se..."
  },
  spinningStatus: {
    es: "Girando...",
    en: "Spinning...",
    fr: "Tournoiement...",
    pt: "Rodando..."
  },
  ariaLabel: {
    es: "Ruleta de letras girando",
    en: "Spinning letter wheel",
    fr: "Roulette à lettres tournante",
    pt: "Roda de letras girando"
  }
};

export function RouletteWheel({ isSpinning, onSpinComplete, alphabet, language }: RouletteWheelProps) {
  const [displayLetter, setDisplayLetter] = useState<string>(alphabet[0] || 'A');
  const [isAnimating, setIsAnimating] = useState(false);
  const spinCountRef = useRef(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const stopAudioRef = useRef<HTMLAudioElement | null>(null);

  const translate = (textKey: keyof typeof ROULETTE_TEXTS) => {
    return ROULETTE_TEXTS[textKey][language] || ROULETTE_TEXTS[textKey]['en'];
  };

  useEffect(() => {
    // Cargar sonidos
    audioRef.current = new Audio('/music/the-ticking-of-the-mantel-clock.mp3');
    stopAudioRef.current = new Audio('/music/dry-cuckoo-sound.mp3');

    return () => {
      audioRef.current?.pause();
      stopAudioRef.current?.pause();
    };
  }, []);

  useEffect(() => {
    if (!isSpinning) {
      return; // Retorno explícito cuando no está girando
    }

    setIsAnimating(true);
    audioRef.current?.play().catch(e => console.error("Error playing sound:", e));

    const maxSpins = 25 + Math.floor(Math.random() * 15);
    spinCountRef.current = 0;

    const intervalId = setInterval(() => {
      setDisplayLetter(alphabet[Math.floor(Math.random() * alphabet.length)]);
      spinCountRef.current++;

      if (spinCountRef.current >= maxSpins) {
        clearInterval(intervalId);
        audioRef.current?.pause();
        stopAudioRef.current?.play().catch(e => console.error("Error playing stop sound:", e));
        const finalLetter = alphabet[Math.floor(Math.random() * alphabet.length)];
        setDisplayLetter(finalLetter);
        setTimeout(() => {
          setIsAnimating(false);
          onSpinComplete(finalLetter);
        }, 500);
      }
    }, 80);

    return () => {
      clearInterval(intervalId);
      audioRef.current?.pause();
    };
  }, [isSpinning, onSpinComplete, alphabet]);

  return (
    <Card className="w-full max-w-md mx-auto text-center shadow-xl bg-card rounded-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-3xl font-bold text-primary">
          {translate('title')}
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          {translate('description')}
        </CardDescription>
      </CardHeader>
      <CardContent className="py-8">
        <div
          className="relative my-4 p-8 bg-gradient-to-br from-secondary to-secondary/90 rounded-full w-48 h-48 md:w-56 md:h-56 flex items-center justify-center mx-auto shadow-inner"
          aria-label={translate('ariaLabel')}
          aria-busy={isSpinning}
        >
          <div
            className="absolute inset-0 flex items-center justify-center transition-all duration-300"
            style={{
              transform: isAnimating ? 'scale(0.95)' : 'scale(1)',
              opacity: isAnimating ? 0.9 : 1
            }}
          >
            <span className="text-6xl md:text-8xl font-extrabold text-primary-foreground tabular-nums">
              {displayLetter}
            </span>
          </div>
        </div>
        {isSpinning && (
          <p className="text-primary animate-pulse">
            {translate('spinningStatus')}
          </p>
        )}
      </CardContent>
    </Card>
  );
}