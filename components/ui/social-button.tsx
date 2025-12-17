'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface SocialButtonProps extends React.ComponentProps<'button'> {
    children: React.ReactNode
}

function SocialButton({ className, children, ...props }: SocialButtonProps) {
    return (
        <button
            type="button"
            data-slot="social-button"
            className={cn(
                'size-12 rounded-full',
                'bg-surface border border-border',
                'flex items-center justify-center',
                'hover:bg-secondary transition-colors',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                'disabled:pointer-events-none disabled:opacity-50',
                className,
            )}
            {...props}
        >
            {children}
        </button>
    )
}

export { SocialButton }
