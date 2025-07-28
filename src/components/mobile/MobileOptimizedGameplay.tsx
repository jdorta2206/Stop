import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useTouchOptimization } from '@/hooks/useTouchOptimization';
import { useOfflineStorage } from '@/hooks/useOfflineStorage';
import { 
  Timer, 
  Zap, 
  Target, 
  Trophy, 
  Volume2, 
  VolumeX,
  Wifi,
  WifiOff,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';

interface MobileOptimizedGameplayProps {
  selectedLetter: string;
  timeLeft: number;
  onStop: () => void;
  onAnswerChange: (category: string, value: string) => void;
  answers: Record<string, string>;
  isOfflineMode?: boolean;
}

const CATEGORIES = [
  { key: 'lugar', label: 'Lugar', icon: '🏙️' },
  { key: 'animal', label: 'Animal', icon: '🐾' },
  { key: 'nombre', label: 'Nombre', icon: '👤' },
  { key: 'comida', label: 'Comida', icon: '🍽️' },
  { key: 'color', label: 'Color', icon: '🎨' },
  { key: 'objeto', label: 'Objeto', icon: '📦' }
];

export default function MobileOptimizedGameplay({
  selectedLetter,
  timeLeft,
  onStop,
  onAnswerChange,
  answers,
  isOfflineMode = false
}: MobileOptimizedGameplayProps) {
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [completedCategories, setCompletedCategories] = useState<Set<string>>(new Set());
  const [progress, setProgress] = useState(0);

  const { vibrate, useSwipeGesture, useDoubleTap, useLongPress } = useTouchOptimization();
  const { offlineData, updateSettings } = useOfflineStorage();

  // Actualizar progreso basado en respuestas completadas
  useEffect(() => {
    const completed = Object.values(answers).filter(answer => answer.trim().length > 0).length;
    const progressPercent = (completed / CATEGORIES.length) * 100;
    setProgress(progressPercent);
    
    // Actualizar categorías completadas
    const newCompleted = new Set<string>();
    Object.entries(answers).forEach(([category, answer]) => {
      if (answer.trim().length > 0) {
        newCompleted.add(category);
      }
    });
    setCompletedCategories(newCompleted);
  }, [answers]);

  // Navegación por swipe
  const swipeHandlers = useSwipeGesture(
    () => navigateCategory(1), // Swipe left -> siguiente
    () => navigateCategory(-1), // Swipe right -> anterior
    undefined,
    undefined
  );

  // Doble tap para autocompletar (modo fácil)
  const doubleTapHandlers = useDoubleTap(() => {
    if (offlineData.settings.difficulty === 'easy') {
      autoCompleteCategory();
    }
  });

  // Long press en botón STOP
  const longPressHandlers = useLongPress(
    () => {
      vibrate([100, 50, 100]);
      onStop();
    },
    undefined,
    1000
  );

  const navigateCategory = (direction: number) => {
    const newIndex = (currentCategoryIndex + direction + CATEGORIES.length) % CATEGORIES.length;
    setCurrentCategoryIndex(newIndex);
    vibrate(25);
  };

  const autoCompleteCategory = () => {
    const currentCategory = CATEGORIES[currentCategoryIndex];
    if (answers[currentCategory.key].trim().length === 0) {
      // Sugerir una palabra que empiece con la letra seleccionada
      const suggestions = getSuggestionsForCategory(currentCategory.key, selectedLetter);
      if (suggestions.length > 0) {
        const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
        onAnswerChange(currentCategory.key, randomSuggestion);
        vibrate([50, 25, 50]);
      }
    }
  };

  const getSuggestionsForCategory = (category: string, letter: string): string[] => {
    // Aquí iría la lógica para obtener sugerencias del diccionario offline
    const suggestions: Record<string, string[]> = {
      lugar: ['Argentina', 'Australia', 'Austria'],
      animal: ['Araña', 'Águila', 'Ardilla'],
      nombre: ['Ana', 'Alberto', 'Antonio'],
      comida: ['Arroz', 'Aguacate', 'Avena'],
      color: ['Azul', 'Amarillo', 'Ámbar'],
      objeto: ['Armario', 'Avión', 'Anillo']
    };
    
    return suggestions[category]?.filter(word => 
      word.toLowerCase().startsWith(letter.toLowerCase())
    ) || [];
  };

  const toggleSound = () => {
    const newSoundEnabled = !soundEnabled;
    setSoundEnabled(newSoundEnabled);
    updateSettings({ soundEnabled: newSoundEnabled });
    vibrate(25);
  };

  const currentCategory = CATEGORIES[currentCategoryIndex];
  const timeProgress = ((60 - timeLeft) / 60) * 100;
  const isCurrentCompleted = completedCategories.has(currentCategory.key);

  return (
    <div className="min-h-screen bg-red-600 p-4 flex flex-col" {...swipeHandlers}>
      {/* Header móvil optimizado */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="text-white font-bold text-2xl">
            {selectedLetter}
          </div>
          <Badge variant={isOfflineMode ? "secondary" : "default"} className="text-xs">
            {isOfflineMode ? (
              <>
                <WifiOff className="h-3 w-3 mr-1" />
                Offline
              </>
            ) : (
              <>
                <Wifi className="h-3 w-3 mr-1" />
                Online
              </>
            )}
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSound}
            className="text-white p-2"
          >
            {soundEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
          </Button>
          
          <div className="text-white text-lg font-bold flex items-center gap-1">
            <Timer className="h-5 w-5" />
            {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
          </div>
        </div>
      </div>

      {/* Barra de progreso */}
      <div className="mb-4">
        <div className="flex justify-between text-white text-sm mb-2">
          <span>Progreso: {completedCategories.size}/{CATEGORIES.length}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2 bg-white/20" />
      </div>

      {/* Navegación de categorías */}
      <div className="flex items-center justify-center mb-4 gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigateCategory(-1)}
          className="text-white p-2"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        
        <div className="flex gap-1">
          {CATEGORIES.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentCategoryIndex
                  ? 'bg-white'
                  : completedCategories.has(CATEGORIES[index].key)
                  ? 'bg-green-400'
                  : 'bg-white/30'
              }`}
            />
          ))}
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigateCategory(1)}
          className="text-white p-2"
        >
          <ArrowRight className="h-5 w-5" />
        </Button>
      </div>

      {/* Categoría actual - Optimizado para móvil */}
      <Card 
        className="flex-1 bg-white/10 backdrop-blur-sm border-white/20 text-white mb-4"
        {...doubleTapHandlers}
      >
        <CardHeader className="pb-4">
          <CardTitle className="text-center text-2xl flex items-center justify-center gap-2">
            <span className="text-3xl">{currentCategory.icon}</span>
            <div className="flex flex-col">
              <span>{currentCategory.label}</span>
              {isCurrentCompleted && (
                <Badge variant="secondary" className="text-xs mt-1">
                  <Target className="h-3 w-3 mr-1" />
                  Completado
                </Badge>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="px-6">
          <div className="space-y-4">
            <Input
              placeholder={`Escribe un ${currentCategory.label.toLowerCase()} que empiece con "${selectedLetter}"...`}
              value={answers[currentCategory.key] || ''}
              onChange={(e) => onAnswerChange(currentCategory.key, e.target.value)}
              className="bg-white/20 border-white/30 text-white placeholder-white/50 text-lg h-14 text-center"
              autoFocus
              maxLength={50}
            />
            
            {/* Contador de caracteres */}
            <div className="text-center text-white/60 text-sm">
              {answers[currentCategory.key]?.length || 0}/50 caracteres
            </div>

            {/* Sugerencias para modo fácil */}
            {offlineData.settings.difficulty === 'easy' && (
              <div className="text-center text-white/70 text-sm">
                💡 Toca dos veces para obtener una sugerencia
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Botón STOP optimizado para móvil */}
      <div className="space-y-4">
        <Button
          {...longPressHandlers}
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-6 text-2xl rounded-xl shadow-lg transform transition-transform active:scale-95"
        >
          <div className="flex flex-col items-center">
            <Zap className="h-8 w-8 mb-1" />
            <span>¡STOP!</span>
            <span className="text-sm opacity-75">Mantén presionado</span>
          </div>
        </Button>

        {/* Indicadores visuales */}
        <div className="flex justify-center gap-4 text-white/70 text-xs">
          <div className="flex items-center gap-1">
            <ArrowLeft className="h-3 w-3" />
            <ArrowRight className="h-3 w-3" />
            <span>Desliza para navegar</span>
          </div>
          <div className="flex items-center gap-1">
            <Trophy className="h-3 w-3" />
            <span>{completedCategories.size} completados</span>
          </div>
        </div>
      </div>

      {/* Barra de tiempo visual */}
      <div className="mt-4">
        <div 
          className="h-1 bg-gradient-to-r from-green-400 via-yellow-400 to-red-400 rounded-full transition-all duration-1000"
          style={{ width: `${timeProgress}%` }}
        />
      </div>
    </div>
  );
}