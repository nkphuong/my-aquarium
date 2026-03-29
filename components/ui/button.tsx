import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-semibold transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 aria-invalid:ring-destructive/20 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground shadow-[0_4px_14px_rgba(13,148,136,0.25)] hover:shadow-[0_6px_20px_rgba(13,148,136,0.35)] hover:-translate-y-0.5 active:translate-y-0 active:shadow-[0_2px_8px_rgba(13,148,136,0.2)]',
        destructive:
          'bg-destructive text-white shadow-sm hover:bg-destructive/90 focus-visible:ring-destructive/20',
        outline:
          'border-2 border-border bg-background hover:bg-muted hover:border-primary/30',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost:
          'hover:bg-muted hover:text-foreground',
        link:
          'text-primary underline-offset-4 hover:underline',
        coral:
          'bg-accent text-accent-foreground shadow-[0_4px_12px_rgba(249,112,102,0.3)] hover:shadow-[0_6px_20px_rgba(249,112,102,0.4)] hover:-translate-y-0.5 active:translate-y-0',
        seafoam:
          'bg-warm-seafoam/20 text-warm-teal hover:bg-warm-seafoam/30',
        warm:
          'bg-warm-gold/20 text-warm-navy hover:bg-warm-gold/30',
        cta:
          'bg-accent text-accent-foreground shadow-[0_4px_16px_rgba(249,112,102,0.4)] hover:shadow-[0_6px_24px_rgba(249,112,102,0.5)] hover:-translate-y-0.5 active:translate-y-0',
      },
      size: {
        default: 'h-11 px-6 py-2 rounded-xl',
        sm: 'h-9 px-4 rounded-lg text-xs',
        lg: 'h-12 px-8 rounded-xl text-base',
        xl: 'h-14 px-10 rounded-2xl text-base',
        pill: 'h-11 px-6 rounded-full',
        'pill-sm': 'h-9 px-5 rounded-full text-xs',
        'pill-lg': 'h-12 px-8 rounded-full',
        icon: 'size-11 rounded-xl',
        'icon-sm': 'size-9 rounded-lg',
        'icon-lg': 'size-12 rounded-xl',
        'icon-circle': 'size-11 rounded-full',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
