import { useState, useEffect } from 'react';
import { Check, X, Loader2 } from 'lucide-react';
import { validateWord } from '@/lib/wordValidator';
import { motion, AnimatePresence } from 'framer-motion';

interface LiveWordValidatorProps {
  word: string;
  category: string;
  letter: string;
  onChange?: (isValid: boolean) => void;
}

export function LiveWordValidator({ word, category, letter, onChange }: LiveWordValidatorProps) {
  const [isValidating, setIsValidating] = useState(false);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string>('');
  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (word.trim().length === 0) {
      setIsValid(null);
      setFeedbackMessage('');
      return;
    }

    // Limpiar timeout anterior
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    // Configurar delay para validación
    setIsValidating(true);
    
    // Validaciones simples inmediatas
    if (!word.toLowerCase().startsWith(letter.toLowerCase())) {
      setIsValidating(false);
      setIsValid(false);
      setFeedbackMessage(`La palabra debe empezar con la letra "${letter}"`);
      onChange?.(false);
      return;
    }
    
    // Validaciones más complejas con debounce
    const timeout = setTimeout(() => {
      const validationResult = validateWord(word, category, letter);
      setIsValid(validationResult);
      
      // Mensajes personalizados por categoría
      if (!validationResult) {
        switch (category) {
          case 'nombre':
            setFeedbackMessage('Nombre no válido o demasiado corto');
            break;
          case 'animal':
            setFeedbackMessage('Animal no reconocido');
            break;
          case 'lugar':
            setFeedbackMessage('Lugar no reconocido');
            break;
          case 'color':
            setFeedbackMessage('Color no reconocido');
            break;
          case 'comida':
            setFeedbackMessage('Alimento no reconocido');
            break;
          case 'objeto':
            setFeedbackMessage('Objeto no reconocido');
            break;
          default:
            setFeedbackMessage('Palabra no válida');
        }
      } else {
        setFeedbackMessage('¡Palabra válida!');
      }
      
      setIsValidating(false);
      onChange?.(validationResult);
    }, 600);
    
    setDebounceTimeout(timeout);
    
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [word, category, letter, onChange]);

  if (word.trim().length === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 h-6 mt-1">
      <AnimatePresence mode="wait">
        {isValidating && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="text-amber-500 flex items-center"
          >
            <Loader2 className="h-4 w-4 animate-spin mr-1" />
            <span className="text-xs">Validando...</span>
          </motion.div>
        )}
        
        {!isValidating && isValid !== null && (
          <motion.div 
            key={isValid ? 'valid' : 'invalid'}
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 5 }}
            className={`flex items-center ${isValid ? 'text-green-500' : 'text-red-500'}`}
          >
            {isValid ? (
              <Check className="h-4 w-4 mr-1" />
            ) : (
              <X className="h-4 w-4 mr-1" />
            )}
            <span className="text-xs">{feedbackMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}