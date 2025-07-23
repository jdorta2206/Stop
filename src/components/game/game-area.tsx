"use client";

import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle } from 'lucide-react';
import type { Language } from '@/contexts/language-context';

interface RoundResults {
  [category: string]: {
    playerScore: number;
    aiScore: number;
    playerResponse: string;
    aiResponse: string;
    playerResponseIsValid?: boolean;
    playerResponseErrorReason?: 'format' | 'invalid_word' | 'api_error' | null;
  };
}

interface GameAreaProps {
  letter: string | null;
  categories: string[];
  playerResponses: Record<string, string>;
  onInputChange: (category: string, value: string) => void;
  isEvaluating: boolean;
  showResults: boolean;
  roundResults: RoundResults | null;
  language: Language;
  gameMode: "solo" | "room";
  localPlayerSubmitted?: boolean;
}

const GAME_AREA_TEXTS = {
  errorFormat: {
    en: "Invalid format",
    es: "Formato inválido"
  },
  errorInvalidWord: {
    en: "Invalid word",
    es: "Palabra inválida"
  },
  errorApi: {
    en: "Verification error",
    es: "Error de verificación"
  },
  evaluatingRoomDescription: {
    en: "Evaluating responses...",
    es: "Evaluando respuestas..."
  },
  resultsRoomDescription: {
    en: "Round results",
    es: "Resultados de la ronda"
  },
  waitingForHost: {
    en: "Waiting for host to start next round",
    es: "Esperando a que el host inicie la siguiente ronda"
  },
  instructionsRoom: {
    en: "Fill in the fields and wait for all players",
    es: "Rellena los campos y espera a todos los jugadores"
  },
  evaluatingDescription: {
    en: "Evaluating your responses...",
    es: "Evaluando tus respuestas..."
  },
  resultsDescription: {
    en: "Here are the results of this round",
    es: "Aquí están los resultados de esta ronda"
  },
  instructions: {
    en: "Fill in all the fields with words that start with the letter",
    es: "Rellena todos los campos con palabras que empiecen por la letra"
  },
  letterLabel: {
    en: "Letter:",
    es: "Letra:"
  },
  inputPlaceholder: {
    en: "Enter",
    es: "Escribe"
  },
  youLabel: {
    en: "You:",
    es: "Tú:"
  },
  noResponsePlayer: {
    en: "No response",
    es: "Sin respuesta"
  },
  pointsSuffix: {
    en: "pts",
    es: "pts"
  },
  aiLabel: {
    en: "AI:",
    es: "IA:"
  },
  noResponseAI: {
    en: "No response",
    es: "Sin respuesta"
  }
};

export function GameArea({
  letter,
  categories,
  playerResponses,
  onInputChange,
  isEvaluating,
  showResults,
  roundResults,
  language,
  gameMode,
  localPlayerSubmitted,
}: GameAreaProps) {
  if (!letter) return null;

  const translate = (textKey: keyof typeof GAME_AREA_TEXTS, dynamicPart?: string) => {
    const translationObj = GAME_AREA_TEXTS[textKey];
    const baseText = (translationObj as any)[language] || translationObj['en'];
    return dynamicPart ? `${baseText} ${dynamicPart}` : baseText;
  };

  const getInvalidReasonText = (reason: 'format' | 'invalid_word' | 'api_error' | null | undefined) => {
    if (reason === 'format') return translate('errorFormat');
    if (reason === 'invalid_word') return translate('errorInvalidWord');
    if (reason === 'api_error') return translate('errorApi');
    return "";
  };

  const getCardDescription = () => {
    if (gameMode === "room") {
      if (isEvaluating) return translate('evaluatingRoomDescription');
      if (showResults) return translate('resultsRoomDescription');
      if (localPlayerSubmitted) return translate('waitingForHost');
      return translate('instructionsRoom');
    }
    if (isEvaluating) return translate('evaluatingDescription');
    if (showResults) return translate('resultsDescription');
    return translate('instructions');
  };

  const allowInput = gameMode === "solo" || (gameMode === "room" && !localPlayerSubmitted && !showResults && !isEvaluating);

  return (
    <Card className="w-full shadow-lg bg-white/95 backdrop-blur-sm border-white/50 rounded-xl">
      <CardHeader className="text-center bg-white/80 rounded-t-xl">
        <CardTitle className="text-3xl font-bold text-red-600">
          <span className="text-red-400">{translate('letterLabel')} </span>
          <span className="text-red-600 tracking-wider text-4xl">{letter}</span>
        </CardTitle>
        <CardDescription className="mt-1 text-md text-red-700">{getCardDescription()}</CardDescription>
      </CardHeader>

      {allowInput && (
        <CardContent className="space-y-4 p-6">
          {categories.map((category, index) => (
            <div key={category}>
              <div className="space-y-2">
                <label htmlFor={`${category}-${gameMode}`} className="text-lg font-semibold text-gray-800 block">
                  {category}
                </label>
                <Input
                  id={`${category}-${gameMode}`}
                  value={playerResponses[category] || ''}
                  onChange={(e) => onInputChange(category, e.target.value)}
                  placeholder={`${translate('inputPlaceholder')} ${category} ${language === 'es' ? 'con' : 'with'} ${letter}...`}
                  disabled={isEvaluating || showResults || (gameMode === "room" && localPlayerSubmitted)}
                  className="text-lg py-3 px-4 border-2 border-gray-300 focus:border-red-500 focus:ring-red-500 bg-white rounded-lg"
                  aria-label={`${language === 'es' ? 'Entrada para la categoría' : 'Input for category'} ${category}`}
                />
                {gameMode === "solo" && showResults && roundResults?.[category] && (
                  <div className="mt-3 p-4 bg-gray-50 rounded-md shadow-sm space-y-2">
                    <div className="flex justify-between items-center">
                      <p className="text-md flex-grow">
                        <span className="font-semibold text-red-600">{translate('youLabel')} </span>
                        {roundResults[category].playerResponse || (
                          <span className="italic text-gray-500">{translate('noResponsePlayer')}</span>
                        )}
                        {roundResults[category].playerResponse && roundResults[category].playerResponseIsValid === false && (
                          <span className="ml-2 text-xs text-red-600 inline-flex items-center">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            {getInvalidReasonText(roundResults[category].playerResponseErrorReason)}
                          </span>
                        )}
                      </p>
                      <Badge
                        variant={roundResults[category].playerScore > 0 ?
                          (roundResults[category].playerScore === 50 ? "secondary" : "default") : "outline"}
                        className="text-sm ml-2 shrink-0 bg-red-100 text-red-700 border-red-300"
                      >
                        {roundResults[category].playerScore} {translate('pointsSuffix')}
                      </Badge>
                    </div>
                    <Separator className="bg-gray-300" />
                    <div className="flex justify-between items-center">
                      <p className="text-md flex-grow">
                        <span className="font-semibold text-blue-600">{translate('aiLabel')} </span>
                        {roundResults[category].aiResponse || (
                          <span className="italic text-gray-500">{translate('noResponseAI')}</span>
                        )}
                      </p>
                      <Badge
                        variant={roundResults[category].aiScore > 0 ?
                          (roundResults[category].aiScore === 50 ? "secondary" : "default") : "outline"}
                        className="text-sm ml-2 shrink-0 bg-blue-100 text-blue-700 border-blue-300"
                      >
                        {roundResults[category].aiScore} {translate('pointsSuffix')}
                      </Badge>
                    </div>
                  </div>
                )}
              </div>
              {index < categories.length - 1 && <div className="border-t border-gray-200 my-4" />}
            </div>
          ))}
        </CardContent>
      )}
    </Card>
  );
}