import { useState, useEffect, useCallback } from 'react';

interface TouchOptimizationOptions {
  enableHapticFeedback?: boolean;
  enableSwipeGestures?: boolean;
  enableDoubleTap?: boolean;
  enableLongPress?: boolean;
}

export function useTouchOptimization(options: TouchOptimizationOptions = {}) {
  const {
    enableHapticFeedback = true,
    enableSwipeGestures = true,
    enableDoubleTap = true,
    enableLongPress = true
  } = options;

  const [isTouch, setIsTouch] = useState(false);
  const [touchCapable, setTouchCapable] = useState(false);

  useEffect(() => {
    // Detectar si el dispositivo soporta touch
    const checkTouchCapable = () => {
      const touch = 'ontouchstart' in window || 
                   navigator.maxTouchPoints > 0 || 
                   (navigator as any).msMaxTouchPoints > 0;
      setTouchCapable(touch);
    };

    checkTouchCapable();

    // Detectar cuando se usa touch vs mouse
    const handleTouchStart = () => setIsTouch(true);
    const handleMouseDown = () => setIsTouch(false);

    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('mousedown', handleMouseDown);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  // Vibración háptica
  const vibrate = useCallback((pattern: number | number[] = 50) => {
    if (!enableHapticFeedback || !navigator.vibrate) return;
    
    try {
      navigator.vibrate(pattern);
    } catch (error) {
      console.log('Vibration not supported');
    }
  }, [enableHapticFeedback]);

  // Hook para gestos de swipe
  const useSwipeGesture = useCallback((
    onSwipeLeft?: () => void,
    onSwipeRight?: () => void,
    onSwipeUp?: () => void,
    onSwipeDown?: () => void
  ) => {
    const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
    const [touchEnd, setTouchEnd] = useState<{ x: number; y: number } | null>(null);

    const minSwipeDistance = 50;

    const onTouchStart = (e: React.TouchEvent) => {
      setTouchEnd(null);
      setTouchStart({
        x: e.targetTouches[0].clientX,
        y: e.targetTouches[0].clientY,
      });
    };

    const onTouchMove = (e: React.TouchEvent) => {
      setTouchEnd({
        x: e.targetTouches[0].clientX,
        y: e.targetTouches[0].clientY,
      });
    };

    const onTouchEnd = () => {
      if (!touchStart || !touchEnd) return;

      const distanceX = touchStart.x - touchEnd.x;
      const distanceY = touchStart.y - touchEnd.y;
      const isLeftSwipe = distanceX > minSwipeDistance;
      const isRightSwipe = distanceX < -minSwipeDistance;
      const isUpSwipe = distanceY > minSwipeDistance;
      const isDownSwipe = distanceY < -minSwipeDistance;

      // Determinar si es swipe horizontal o vertical
      if (Math.abs(distanceX) > Math.abs(distanceY)) {
        // Swipe horizontal
        if (isLeftSwipe && onSwipeLeft) {
          onSwipeLeft();
          vibrate(25);
        }
        if (isRightSwipe && onSwipeRight) {
          onSwipeRight();
          vibrate(25);
        }
      } else {
        // Swipe vertical
        if (isUpSwipe && onSwipeUp) {
          onSwipeUp();
          vibrate(25);
        }
        if (isDownSwipe && onSwipeDown) {
          onSwipeDown();
          vibrate(25);
        }
      }
    };

    return {
      onTouchStart: enableSwipeGestures ? onTouchStart : undefined,
      onTouchMove: enableSwipeGestures ? onTouchMove : undefined,
      onTouchEnd: enableSwipeGestures ? onTouchEnd : undefined,
    };
  }, [enableSwipeGestures, vibrate]);

  // Hook para doble tap
  const useDoubleTap = useCallback((onDoubleTap: () => void, delay: number = 300) => {
    const [lastTap, setLastTap] = useState(0);

    const handleTap = () => {
      const now = Date.now();
      if (now - lastTap < delay) {
        onDoubleTap();
        vibrate([25, 25, 25]);
        setLastTap(0);
      } else {
        setLastTap(now);
      }
    };

    return {
      onClick: enableDoubleTap ? handleTap : undefined,
      onTouchEnd: enableDoubleTap ? handleTap : undefined,
    };
  }, [enableDoubleTap, vibrate]);

  // Hook para long press
  const useLongPress = useCallback((
    onLongPress: () => void,
    onClick?: () => void,
    delay: number = 500
  ) => {
    const [longPressTriggered, setLongPressTriggered] = useState(false);
    const timeout = useState<NodeJS.Timeout | null>(null);

    const start = useCallback(() => {
      setLongPressTriggered(false);
      timeout[1](setTimeout(() => {
        onLongPress();
        setLongPressTriggered(true);
        vibrate([50, 50, 100]);
      }, delay));
    }, [onLongPress, delay, timeout, vibrate]);

    const clear = useCallback(() => {
      if (timeout[0]) {
        clearTimeout(timeout[0]);
        timeout[1](null);
      }
    }, [timeout]);

    const clickHandler = useCallback(() => {
      if (longPressTriggered) {
        setLongPressTriggered(false);
        return;
      }
      onClick?.();
    }, [longPressTriggered, onClick]);

    return {
      onMouseDown: enableLongPress ? start : undefined,
      onTouchStart: enableLongPress ? start : undefined,
      onMouseUp: enableLongPress ? clear : undefined,
      onMouseLeave: enableLongPress ? clear : undefined,
      onTouchEnd: enableLongPress ? clear : undefined,
      onClick: enableLongPress ? clickHandler : onClick,
    };
  }, [enableLongPress, vibrate]);

  // Funciones de utilidad para mejor UX táctil
  const preventZoom = useCallback(() => {
    // Prevenir zoom en doble tap
    const preventDefault = (e: Event) => {
      if (e.touches && e.touches.length > 1) {
        e.preventDefault();
      }
    };

    document.addEventListener('touchstart', preventDefault, { passive: false });
    document.addEventListener('touchmove', preventDefault, { passive: false });

    return () => {
      document.removeEventListener('touchstart', preventDefault);
      document.removeEventListener('touchmove', preventDefault);
    };
  }, []);

  // Optimizar scrolling en dispositivos táctiles
  const optimizeScrolling = useCallback(() => {
    // Aplicar CSS para scroll suave en dispositivos táctiles
    if (touchCapable) {
      document.body.style.webkitOverflowScrolling = 'touch';
      document.body.style.overflowScrolling = 'touch';
    }
  }, [touchCapable]);

  useEffect(() => {
    optimizeScrolling();
  }, [optimizeScrolling]);

  return {
    isTouch,
    touchCapable,
    vibrate,
    useSwipeGesture,
    useDoubleTap,
    useLongPress,
    preventZoom,
    optimizeScrolling
  };
}