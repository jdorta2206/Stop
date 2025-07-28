import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LetterRevealProps {
  text: string;
  delay?: number;
  duration?: number;
  className?: string;
  onComplete?: () => void;
}

export function LetterReveal({
  text,
  delay = 0.05,
  duration = 0.5,
  className = '',
  onComplete
}: LetterRevealProps) {
  const [isComplete, setIsComplete] = useState(false);
  const letters = Array.from(text);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsComplete(true);
      onComplete?.();
    }, (letters.length * delay * 1000) + duration * 1000);
    
    return () => clearTimeout(timer);
  }, [text, delay, duration, letters.length, onComplete]);

  return (
    <div className={`inline-flex ${className}`} aria-label={text}>
      <AnimatePresence>
        {letters.map((letter, index) => (
          <motion.span
            key={`${index}-${letter}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: 1, 
              y: 0,
              transition: {
                duration: duration,
                delay: index * delay,
                ease: [0.22, 1, 0.36, 1]
              }
            }}
            exit={{ opacity: 0, y: -20 }}
            className="inline-block"
            style={{ 
              display: letter === ' ' ? 'inline-block' : undefined,
              width: letter === ' ' ? '0.5em' : undefined
            }}
          >
            {letter}
          </motion.span>
        ))}
      </AnimatePresence>
    </div>
  );
}

export function AnimatedTitle({
  title,
  subtitle,
  className = '',
}) {
  return (
    <div className={className}>
      <h1 className="text-4xl font-bold">
        <LetterReveal text={title} />
      </h1>
      {subtitle && (
        <p className="text-muted-foreground mt-2 opacity-80">
          <LetterReveal 
            text={subtitle} 
            delay={0.03}
            duration={0.4}
          />
        </p>
      )}
    </div>
  );
}