<<<<<<< HEAD
"use client"

import React from "react"
import { Check } from "lucide-react"

// Función cn inline para evitar dependencia de @/lib/utils
const cn = (...classes: (string | undefined)[]) => {
 return classes.filter(Boolean).join(' ')
}

interface CheckboxProps {
 className?: string
 checked?: boolean
 onCheckedChange?: (checked: boolean) => void
 disabled?: boolean
 id?: string
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
 ({ className, checked, onCheckedChange, disabled, id, ...props }, ref) => {
   return (
     <div className="relative inline-flex items-center">
       <input
         ref={ref}
         type="checkbox"
         id={id}
         checked={checked}
         onChange={(e) => onCheckedChange?.(e.target.checked)}
         disabled={disabled}
         className="sr-only"
         {...props}
       />
       <div
         className={cn(
           "peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer flex items-center justify-center",
           checked ? "bg-primary text-primary-foreground" : "bg-background",
           disabled ? "opacity-50 cursor-not-allowed" : "",
           className
         )}
         onClick={() => !disabled && onCheckedChange?.(!checked)}
       >
         {checked && <Check className="h-3 w-3" />}
       </div>
     </div>
   )
 }
)

Checkbox.displayName = "Checkbox"

export { Checkbox }
=======
import * as React from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { Check } from 'lucide-react';

import { cn } from '@/lib/utils';

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      'peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground',
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator className={cn('flex items-center justify-center text-current')}>
      <Check className="h-4 w-4" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
>>>>>>> 8405a82 (Actualización completa del juego STOP con nuevas funcionalidades)
