'use client';

import Link from "next/link";
import { MoreVertical } from "lucide-react";
import { Tank } from "@/app/types";
import { clsx } from "clsx";


export default function TankCard({ tank }: { tank: Tank }) {
    return (
        <article className={clsx(
            "group relative flex flex-col bg-surface-dark rounded-card",
            "overflow-hidden shadow-lg border border-surface hover:border-primary/50 dark:hover:border-primary/50",
            "transition-all duration-300 hover:-translate-y-1")}>
            {/* Image */}
            <div className="h-56 w-full overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-overlay opacity-60 z-10" />
                <div className="absolute top-4 right-4 z-20">
                    <span
                        className={clsx(
                            "inline-flex items-center gap-1.5 px-3 py-1 rounded-full",
                            "bg-overlay-dark backdrop-blur-sm border border-surface",
                            "text-xs font-bold",
                            tank.status === "healthy" && "bg-emerald-500",
                            tank.status === "warning" && "bg-yellow-500",
                            tank.status === "critical" && "bg-red-500"
                        )}
                    >
                        {tank.status === "healthy" ? (
                            <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
                        ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                />
                            </svg>
                        )}
                        {/* {tank.statusLabel} */}
                    </span>
                </div>
                <div
                    className="w-full h-full bg-center bg-no-repeat bg-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    style={{ backgroundImage: `url("${tank.avatar}")` }}
                />
            </div>

            {/* Content */}
            <div className="flex flex-col p-6 gap-4">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-dark-primary text-xl font-bold leading-tight">{tank.name}</h3>
                        <p className="text-dark-secondary text-sm mt-1">{tank.description}</p>
                    </div>
                    <button className="text-muted-foreground hover:text-foreground transition-colors">
                        <MoreVertical className="w-5 h-5" />
                    </button>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 py-3 border-t border-b border-surface/50">
                    {/* {tank.stats.map((stat, index) => (
                    <div key={stat.label} className="flex items-center gap-2">
                        {index > 0 && <div className="w-px h-8 bg-border -ml-2 mr-2" />}
                        <StatIcon type={stat.icon} className={`w-5 h-5 ${stat.color}`} />
                        <span className="text-dark-primary font-semibold text-sm">{stat.value}</span>
                        <span className="text-dark-secondary text-xs">{stat.label}</span>
                    </div>
                ))} */}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between mt-auto">
                    <span className="text-xs font-medium text-dark-tertiary">Est. {tank.setup_at}</span>
                    <Link
                        href={`/tanks/${tank.id}`}
                        className="flex items-center justify-center rounded-full btn-card-action h-10 px-5 text-sm font-bold"
                    >
                        Details
                    </Link>
                </div>
            </div>
        </article>
    );
}