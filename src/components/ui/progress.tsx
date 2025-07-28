<<<<<<< HEAD
"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"
=======
import * as React from 'react';
import * as ProgressPrimitive from '@radix-ui/react-progress';

import { cn } from '@/lib/utils';
>>>>>>> 8405a82 (Actualización completa del juego STOP con nuevas funcionalidades)

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => (
<<<<<<< HEAD
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      "relative h-4 w-full overflow-hidden rounded-full bg-secondary",
      className
    )}
    {...props}
  >
=======
  <ProgressPrimitive.Root ref={ref} className={cn('relative h-4 w-full overflow-hidden rounded-full bg-secondary', className)} {...props}>
>>>>>>> 8405a82 (Actualización completa del juego STOP con nuevas funcionalidades)
    <ProgressPrimitive.Indicator
      className="h-full w-full flex-1 bg-primary transition-all"
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </ProgressPrimitive.Root>
<<<<<<< HEAD
))
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
=======
));
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
>>>>>>> 8405a82 (Actualización completa del juego STOP con nuevas funcionalidades)
