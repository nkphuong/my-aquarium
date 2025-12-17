'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface InputRoundedProps extends React.ComponentProps<'input'> {
    icon?: React.ReactNode
}

function InputRounded({ className, icon, type, ...props }: InputRoundedProps) {
    return (
        <div className="relative group">
            {icon && (
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="text-muted-foreground">{icon}</span>
                </div>
            )}
            <input
                type={type}
                data-slot="input-rounded"
                className={cn(
                    'w-full h-12 rounded-full bg-background border border-border',
                    'px-4 text-sm font-body',
                    'placeholder:text-muted-foreground',
                    'focus:border-primary focus:ring-1 focus:ring-primary outline-none',
                    'transition-all',
                    'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
                    icon && 'pl-11',
                    className,
                )}
                {...props}
            />
        </div>
    )
}

export { InputRounded }
