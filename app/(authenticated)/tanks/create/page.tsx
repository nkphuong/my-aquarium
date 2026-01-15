"use client"

import { useForm, useWatch, SubmitHandler } from "react-hook-form";
import { ArrowLeft, Plus, Minus } from "lucide-react"
import { useRouter } from "next/navigation"
import { clsx } from "clsx"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useTankStore } from "@/app/stores/app/tank.store";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useSession } from "next-auth/react";


interface CreateTankForm {
    name: string;
    style: string;
    setupAt: string;
    description: string;
    length: string;
    width: string;
    height: string;
    substrate: string;
    filtration: string;
    lighting: string;
    fish: number;
    plants: number;
    inverts: number;
}

export default function CreateTankPage() {
    const router = useRouter()
    const { data: session } = useSession()
    const createTank = useTankStore((state) => state.createTank)
    // Form state
    const { register, handleSubmit, control } = useForm<CreateTankForm>({
        defaultValues: {
            length: "",
            width: "",
            height: "",
        }
    });
    const onSubmit: SubmitHandler<CreateTankForm> = async (data) => {
        const request = {
            name: data.name,
            style: data.style,
            setup_at: data.setupAt,
            description: data.description,
            length: parseFloat(data.length) || 0,
            width: parseFloat(data.width) || 0,
            height: parseFloat(data.height) || 0,
            water_volume: liters,
        }
        await createTank(request, session?.accessToken ?? '')
    }

    // Watch dimensions and calculate volume
    const [length, width, height] = useWatch({
        control,
        name: ["length", "width", "height"],
    });

    // Calculate volume in liters (cm³ / 1000) and gallons (liters / 3.78541)
    const lengthNum = parseFloat(length) || 0;
    const widthNum = parseFloat(width) || 0;
    const heightNum = parseFloat(height) || 0;
    const liters = Math.round((lengthNum * widthNum * heightNum) / 1000);
    const gallons = Math.round(liters / 3.78541);



    return (
        <div className="flex flex-col h-full overflow-y-auto bg-background">
            <div className="mx-auto w-full max-w-7xl px-6 py-8 md:px-12 md:py-12">
                {/* Header */}
                <div className="mb-10 flex flex-col gap-2">
                    <div className="flex items-center gap-2 mb-2">
                        <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => router.back()}
                            className="rounded-full bg-card hover:bg-border"
                        >
                            <ArrowLeft className="w-4 h-4" />
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

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
                    {/* Tank Photo & Basic Info */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Tank Photo */}
                        <div className="lg:col-span-4 flex flex-col">
                            <Label className="form-label mb-3">Tank Photo</Label>
                            <div className="upload-zone group aspect-square">
                                <div className="flex flex-col items-center gap-3 p-6 text-center">
                                    <div className={clsx(
                                        "flex size-14 items-center justify-center rounded-full",
                                        "bg-border/30 text-primary",
                                        "group-hover:scale-110 transition-transform"
                                    )}>
                                        <span className="material-symbols-outlined text-3xl">add_a_photo</span>
                                    </div>
                                    <p className="text-sm font-medium text-foreground">Upload Tank Image</p>
                                    <p className="text-xs text-muted-foreground">Drag & drop or click to browse</p>
                                </div>
                                <input className="absolute inset-0 opacity-0 cursor-pointer" type="file" accept="image/*" />
                            </div>
                        </div>

                        {/* Basic Info */}
                        <div className="lg:col-span-8 flex flex-col gap-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Tank Name */}
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="tankName" className="form-label">Tank Name</Label>
                                    <Input
                                        id="tankName"
                                        className="form-input"
                                        placeholder="e.g. The Amazon Corner"
                                        {...register("name", { required: true, maxLength: 200 })}
                                    />
                                </div>

                                {/* Tank Style */}
                                <div className="flex flex-col gap-2">
                                    <Label className="form-label">Tank Style</Label>
                                    <Select {...register("style")}>
                                        <SelectTrigger size="lg" className="form-select">
                                            <SelectValue placeholder="Select style" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="freshwater">Freshwater (Community)</SelectItem>
                                            <SelectItem value="planted">High-Tech Planted</SelectItem>
                                            <SelectItem value="reef">Saltwater Reef</SelectItem>
                                            <SelectItem value="fowlr">FOWLR (Fish Only)</SelectItem>
                                            <SelectItem value="brackish">Brackish</SelectItem>
                                            <SelectItem value="paludarium">Paludarium</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Setup Date */}
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="setupDate" className="form-label">Setup Date</Label>
                                <Input
                                    id="setupDate"
                                    className="form-input [color-scheme:dark]"
                                    type="date"
                                    {...register("setupAt")}
                                />
                            </div>

                            {/* Description */}
                            <div className="flex flex-col gap-2 flex-1">
                                <Label htmlFor="description" className="form-label">Description</Label>
                                <Textarea
                                    id="description"
                                    className="form-textarea"
                                    placeholder="Briefly describe your setup, inspiration, or goals..."
                                    {...register("description")}
                                />
                            </div>
                        </div>
                    </div>

                    <Separator className="bg-border/50" />

                    {/* Dimensions & Equipment */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Dimensions */}
                        <div className="lg:col-span-2 flex flex-col gap-4">
                            <div className="flex items-center justify-between">
                                <Label className="form-label">Dimensions (cm)</Label>
                                <span className="volume-badge">
                                    ≈ {gallons} Gallons / {liters} Liters
                                </span>
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                                <div className="relative">
                                    <Input
                                        className="form-input text-center pr-8"
                                        placeholder="L"
                                        type="number"
                                        {...register("length")}
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-medium">L</span>
                                </div>
                                <div className="relative">
                                    <Input
                                        className="form-input text-center pr-8"
                                        placeholder="W"
                                        type="number"
                                        {...register("width")}
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-medium">W</span>
                                </div>
                                <div className="relative">
                                    <Input
                                        className="form-input text-center pr-8"
                                        placeholder="H"
                                        type="number"
                                        {...register("height")}
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-medium">H</span>
                                </div>
                            </div>
                        </div>

                        {/* Substrate */}
                        <div className="flex flex-col gap-4">
                            <Label className="form-label">Substrate Type</Label>
                            <Select {...register("substrate")}>
                                <SelectTrigger size="lg" className="form-select">
                                    <SelectValue placeholder="Select substrate" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="sand">Sand</SelectItem>
                                    <SelectItem value="gravel">Gravel</SelectItem>
                                    <SelectItem value="soil">Aquasoil</SelectItem>
                                    <SelectItem value="bare">Bare Bottom</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Filtration */}
                        <div className="lg:col-span-2 flex flex-col gap-4">
                            <Label htmlFor="filtration" className="form-label">Filtration System</Label>
                            <Input
                                id="filtration"
                                className="form-input"
                                placeholder="e.g. Fluval 407 Canister Filter"
                                {...register("filtration")}
                            />
                        </div>

                        {/* Lighting */}
                        <div className="flex flex-col gap-4">
                            <Label htmlFor="lighting" className="form-label">Lighting</Label>
                            <Input
                                id="lighting"
                                className="form-input"
                                placeholder="e.g. AI Prime 16HD"
                                {...register("lighting")}
                            />
                        </div>
                    </div>

                    <Separator className="bg-border/50" />

                    {/* Initial Inhabitants */}
                    <div className="flex flex-col gap-6">
                        <h3 className="text-xl font-bold text-foreground">Initial Inhabitants</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* <InhabitantCounter
                                icon="set_meal"
                                label="Fish"
                                description="Initial stock"
                                {...register("fish")}
                                colorClass="icon-bg-fish"
                            />
                            <InhabitantCounter
                                icon="grass"
                                label="Plants"
                                description="Total species"
                                {...register("plants")}
                                colorClass="icon-bg-plants"
                            />
                            <InhabitantCounter
                                icon="pest_control"
                                label="Inverts"
                                description="Shrimp/Snails"
                                {...register("inverts")}
                                colorClass="icon-bg-inverts"
                            /> */}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-8 flex flex-col-reverse sm:flex-row items-center justify-end gap-4">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="btn-cancel"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn-submit"
                        >
                            <span className="material-symbols-outlined text-lg">rocket_launch</span>
                            Launch Tank
                        </button>
                    </div>
                </form>

                {/* Bottom spacer */}
                <div className="h-20" />
            </div>
        </div>
    )
}

// Helper component for inhabitant counters
function InhabitantCounter({
    icon,
    label,
    description,
    value,
    onIncrement,
    onDecrement,
    colorClass
}: {
    icon: string
    label: string
    description: string
    value: number
    onIncrement: () => void
    onDecrement: () => void
    colorClass: string
}) {
    return (
        <div className="inhabitant-card">
            <div className="flex items-center gap-4">
                <div className={clsx(
                    "flex size-12 items-center justify-center rounded-full",
                    colorClass
                )}>
                    <span className="material-symbols-outlined">{icon}</span>
                </div>
                <div className="flex flex-col">
                    <span className="font-bold text-foreground">{label}</span>
                    <span className="text-xs text-muted-foreground">{description}</span>
                </div>
            </div>
            <div className="flex items-center gap-3">
                <button
                    type="button"
                    onClick={onDecrement}
                    className="btn-counter-decrement"
                >
                    <span className="material-symbols-outlined text-sm">remove</span>
                </button>
                <span className="w-6 text-center font-display font-bold text-foreground">{value}</span>
                <button
                    type="button"
                    onClick={onIncrement}
                    className="btn-counter-increment"
                >
                    <span className="material-symbols-outlined text-sm">add</span>
                </button>
            </div>
        </div>
    )
}