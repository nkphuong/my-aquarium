import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const inputVariants = cva(
  'w-full min-w-0 text-base transition-all duration-200 outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground',
  {
    variants: {
      variant: {
        default:
          'bg-background border border-input rounded-xl shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/20',
        filled:
          'bg-muted border-2 border-transparent rounded-xl focus:border-primary focus:bg-background',
        ocean:
          'bg-ocean-mist/50 border-2 border-transparent rounded-xl focus:border-ocean-mid focus:bg-white focus:ring-2 focus:ring-ocean-mid/20',
        ghost:
          'bg-transparent border-b-2 border-border rounded-none focus:border-primary',
      },
      inputSize: {
        sm: 'h-9 px-3 py-2 text-sm',
        default: 'h-11 px-4 py-3',
        lg: 'h-14 px-5 py-4 text-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      inputSize: 'default',
    },
  },
)

interface InputProps
  extends Omit<React.ComponentProps<'input'>, 'size'>,
    VariantProps<typeof inputVariants> {}

function Input({ className, type, variant, inputSize, ...props }: InputProps) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        inputVariants({ variant, inputSize }),
        'aria-invalid:ring-destructive/20 aria-invalid:border-destructive',
        className,
      )}
      {...props}
    />
  )
}

export { Input, inputVariants }
