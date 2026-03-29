

import dynamic from "next/dynamic"

// ✅ Dynamic imports for lucide icons - tree-shakeable and TypeScript-safe
const ArrowLeft = dynamic(() => import("lucide-react").then(mod => ({ default: mod.ArrowLeft })))
import { Button } from "@/components/ui/button"
import Link from 'next/link'
import { TankForm } from "@/components/features/tank-form";


export default async function CreateTankPage() {


    return (
        <div className="flex flex-col h-full overflow-y-auto bg-background">
            <div className="mx-auto w-full max-w-7xl px-6 py-8 md:px-12 md:py-12">
                {/* Header */}
                <div className="mb-10 flex flex-col gap-2">
                    <div className="flex items-center gap-2 mb-2">
                        <Button
                            variant="ghost"
                            size="icon-sm"
                            asChild
                            className="rounded-full bg-card hover:bg-border"
                        >
                            <Link href="/dashboard">
                                <ArrowLeft className="w-4 h-4" />
                            </Link>

                        </Button>
                        <span className="text-muted-foreground text-sm font-medium uppercase tracking-wider">
                            Back to Dashboard
                        </span>
                    </div>
                    <h1 className="font-display text-4xl font-black text-foreground md:text-5xl">
                        Setup New Tank
                    </h1>
                    <p className="text-lg text-muted-foreground">
                        Add a new ecosystem profile to track parameters, livestock, and maintenance.
                    </p>
                </div>

                <TankForm />


                {/* Bottom spacer */}
                <div className="h-20" />
            </div>
        </div>
    )
}

