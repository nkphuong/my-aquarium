'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface DividerWithTextProps extends React.ComponentProps<'div'> {
    children: React.ReactNode
}

function DividerWithText({ className, children, ...props }: DividerWithTextProps) {
    return (
        <div className={cn('relative py-2', className)} {...props}>
            <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center">
                <span className="bg-card px-4 text-xs uppercase tracking-wider text-muted-foreground">
                    {children}
                </span>
            </div>
        </div>
    )
}

export { DividerWithText }
