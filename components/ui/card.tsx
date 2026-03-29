import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const cardVariants = cva(
  'flex flex-col gap-4 rounded-2xl transition-all duration-200',
  {
    variants: {
      variant: {
        default: 'bg-card text-card-foreground border border-border shadow-sm',
        elevated: 'bg-card text-card-foreground shadow-md hover:shadow-lg',
        outline: 'bg-transparent border-2 border-border',
        ghost: 'bg-transparent',
        // Warm Aquatic variants
        teal: 'bg-primary/5 text-foreground border border-primary/20',
        coral: 'bg-accent/5 text-foreground border border-accent/20',
        warm: 'bg-warm-cream text-foreground',
        gold: 'bg-warm-gold/10 text-foreground',
        seafoam: 'bg-warm-seafoam/10 text-foreground',
      },
      hover: {
        none: '',
        lift: 'hover:-translate-y-0.5 hover:shadow-lg cursor-pointer',
        glow: 'hover:shadow-[0_0_20px_rgba(13,148,136,0.2)] cursor-pointer',
        border: 'hover:border-primary/50 cursor-pointer',
      },
      padding: {
        none: '',
        sm: 'p-4',
        default: 'p-6',
        lg: 'p-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      hover: 'none',
      padding: 'default',
    },
  },
)

interface CardProps
  extends React.ComponentProps<'div'>,
    VariantProps<typeof cardVariants> {}

function Card({ className, variant, hover, padding, ...props }: CardProps) {
  return (
    <div
      data-slot="card"
      className={cn(cardVariants({ variant, hover, padding, className }))}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        'flex flex-col gap-1.5',
        className,
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-title"
      className={cn('text-lg font-bold leading-none', className)}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-description"
      className={cn('text-sm text-muted-foreground', className)}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-action"
      className={cn('self-end', className)}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-content"
      className={cn('flex-1', className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-footer"
      className={cn('flex items-center gap-2 pt-2', className)}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
  cardVariants,
}
