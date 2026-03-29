'use client'

import { useRouter } from 'next/navigation'
import { useMemo, memo, useState, useCallback, DragEvent } from 'react'
import { useToast } from '@/components/ui/use-toast'
import { useForm, useWatch, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import { clsx } from "clsx"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { createTank } from '@/app/actions/tank.actions'
import type { CreateTankInput } from '@/lib/types'
import { z } from 'zod';
import { validateImage, createPreviewUrl } from '@/app/utils/file'
import { uploadTankImage } from '@/app/actions/file.actions'

const MAX_FILE_SIZE = 1024 * 1024 * 5; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const createTankSchema = z.object({
  name: z.string().min(1, "Name is required").max(200, "Name must be less than 200 characters"),
  style: z.string().optional(),
  setupAt: z.string().min(1, "Setup date is required"),
  description: z.string().optional(),
  length: z.string().min(1, "Length is required"),
  width: z.string().min(1, "Width is required"),
  height: z.string().min(1, "Height is required"),
  substrate: z.string().optional(),
  filtration: z.string().optional(),
  lighting: z.string().optional(),
  fish: z.number().optional(),
  plants: z.number().optional(),
  inverts: z.number().optional(),
  avatar: z
    .any()
    .refine((files) => typeof FileList !== 'undefined' && files instanceof FileList ? files?.length > 0 : true, "Image is required.")
    .refine((files) => typeof FileList !== 'undefined' && files instanceof FileList ? files?.[0]?.size <= MAX_FILE_SIZE : true, `Max file size is 5MB.`)
    .refine(
      (files) => typeof FileList !== 'undefined' && files instanceof FileList ? ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type) : true,
      ".jpg, .jpeg, .png and .webp files are accepted."
    ),
});

export type CreateTankSchema = z.infer<typeof createTankSchema>;

export function TankForm() {
  const router = useRouter()
  const { toast } = useToast()
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>('')
  const [uploadProgress, setUploadProgress] = useState<'idle' | 'uploading' | 'done'>('idle')
  const form = useForm<CreateTankSchema>({
    resolver: zodResolver(createTankSchema),
    defaultValues: {
      name: '',
      style: '',
      setupAt: '',
      description: '',
      length: '',
      width: '',
      height: '',
      substrate: '',
      filtration: '',
      lighting: '',
    },
  })
  const { formState: { isSubmitting } } = form

  // Watch dimensions and calculate volume
  const [length, width, height] = useWatch({
    control: form.control,
    name: ["length", "width", "height"],
  });

  // ✅ Memoize volume calculations to prevent unnecessary re-computation
  const { liters, gallons } = useMemo(() => {
    const lengthNum = parseFloat(length) || 0;
    const widthNum = parseFloat(width) || 0;
    const heightNum = parseFloat(height) || 0;
    const liters = Math.round((lengthNum * widthNum * heightNum) / 1000);
    const gallons = Math.round(liters / 3.78541);
    return { liters, gallons };
  }, [length, width, height]);

  const handleImageSelect = useCallback((file: File) => {
    try {
      validateImage(file)
      setImageFile(file)

      // Revoke previous URL to prevent memory leak
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
      setPreviewUrl(createPreviewUrl(file))
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Invalid image',
        description: error instanceof Error ? error.message : 'Failed to load image',
      })
    }
  }, [previewUrl, toast])

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDrop = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()

    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith('image/')) {
      handleImageSelect(file)
    }
  }, [handleImageSelect])



  const onSubmit: SubmitHandler<CreateTankSchema> = async (data) => {
    let avatarUrl = ''

    // Upload image first if exists
    if (imageFile) {
      setUploadProgress('uploading')
      const formData = new FormData()
      formData.append('file', imageFile)
      const uploadResult = await uploadTankImage(formData)

      if (!uploadResult.success) {
        setUploadProgress('idle')
        toast({
          variant: 'destructive',
          title: 'Upload failed',
          description: uploadResult.error,
        })
        return
      }

      avatarUrl = uploadResult.url!
      setUploadProgress('done')
    }

    const input: CreateTankInput = {
      name: data.name,
      width: Number(data.width),
      height: Number(data.height),
      length: Number(data.length),
      setupAt: data.setupAt,
      type: data.style,
      style: data.style,
      description: data.description,
      status: 'active',
      waterVolume: liters,
      avatar: avatarUrl
    }
    const result = await createTank(input)
    if (!result.success) {
      form.setError('root', {
        type: 'server',
        message: result.error || 'Failed to create tank',
      })
      toast({
        variant: 'destructive',
        title: 'Failed to create tank',
        description: result.error,
      })
      return
    }

    // Success - redirect to tanks list
    toast({
      title: 'Tank created!',
      description: 'Your new tank has been set up successfully.',
    })
    router.push('/tanks')
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-8" >
        < div className="grid grid-cols-1 lg:grid-cols-12 gap-8" >
          < div className="lg:col-span-4 flex flex-col" >
            <Label className="form-label mb-3">Tank Photo</Label>
            <div
              className="upload-zone group aspect-square"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              {previewUrl ? (
                <div className="relative w-full h-full">
                  <img
                    src={previewUrl}
                    alt="Tank preview"
                    className="w-full h-full object-cover rounded-xl"
                  />
                  <div className={clsx(
                    "absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100",
                    "flex flex-col items-center justify-center gap-2 transition-opacity rounded-xl"
                  )}>
                    <span className="material-symbols-outlined text-3xl text-white">edit</span>
                    <p className="text-sm font-medium text-white">Change Image</p>
                  </div>
                </div>
              ) : (
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
              )}
              <FormField
                control={form.control}
                name="avatar"
                render={({ field }) => (
                  <FormItem className="absolute inset-0">
                    <FormControl>
                      <Input
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            handleImageSelect(file)
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage className="absolute -bottom-6 left-0" />
                  </FormItem>
                )}
              />
            </div>
          </div >

          {/* Basic Info */}
          < div className="lg:col-span-8 flex flex-col gap-6" >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Tank Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-2">
                    <FormLabel className="form-label">Tank Name*</FormLabel>
                    <FormControl>
                      <Input
                        className="form-input"
                        placeholder="e.g. The Amazon Corner"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Tank Style */}
              <FormField
                control={form.control}
                name="style"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-2">
                    <FormLabel className="form-label">Tank Style</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger size="lg" className="form-select">
                          <SelectValue placeholder="Select style" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="freshwater">Freshwater (Community)</SelectItem>
                        <SelectItem value="planted">High-Tech Planted</SelectItem>
                        <SelectItem value="reef">Saltwater Reef</SelectItem>
                        <SelectItem value="fowlr">FOWLR (Fish Only)</SelectItem>
                        <SelectItem value="brackish">Brackish</SelectItem>
                        <SelectItem value="paludarium">Paludarium</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Setup Date */}
            <FormField
              control={form.control}
              name="setupAt"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2">
                  <FormLabel className="form-label">Setup Date</FormLabel>
                  <FormControl>
                    <Input
                      className="form-input [color-scheme:dark]"
                      type="date"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2 flex-1">
                  <FormLabel className="form-label">Description</FormLabel>
                  <FormControl>
                    <Textarea
                      className="form-textarea"
                      placeholder="Briefly describe your setup, inspiration, or goals..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div >
        </div >

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
              <FormField
                control={form.control}
                name="length"
                render={({ field }) => (
                  <FormItem className="relative">
                    <FormControl>
                      <Input
                        className="form-input text-center pr-8"
                        placeholder="L"
                        type="number"
                        {...field}
                      />
                    </FormControl>
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-medium">L</span>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="width"
                render={({ field }) => (
                  <FormItem className="relative">
                    <FormControl>
                      <Input
                        className="form-input text-center pr-8"
                        placeholder="W"
                        type="number"
                        {...field}
                      />
                    </FormControl>
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-medium">W</span>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="height"
                render={({ field }) => (
                  <FormItem className="relative">
                    <FormControl>
                      <Input
                        className="form-input text-center pr-8"
                        placeholder="H"
                        type="number"
                        {...field}
                      />
                    </FormControl>
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-medium">H</span>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Substrate */}
          <FormField
            control={form.control}
            name="substrate"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-4">
                <FormLabel className="form-label">Substrate Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger size="lg" className="form-select">
                      <SelectValue placeholder="Select substrate" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="sand">Sand</SelectItem>
                    <SelectItem value="gravel">Gravel</SelectItem>
                    <SelectItem value="soil">Aquasoil</SelectItem>
                    <SelectItem value="bare">Bare Bottom</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Filtration */}
          <FormField
            control={form.control}
            name="filtration"
            render={({ field }) => (
              <FormItem className="lg:col-span-2 flex flex-col gap-4">
                <FormLabel className="form-label">Filtration System</FormLabel>
                <FormControl>
                  <Input
                    className="form-input"
                    placeholder="e.g. Fluval 407 Canister Filter"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Lighting */}
          <FormField
            control={form.control}
            name="lighting"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-4">
                <FormLabel className="form-label">Lighting</FormLabel>
                <FormControl>
                  <Input
                    className="form-input"
                    placeholder="e.g. AI Prime 16HD"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Separator className="bg-border/50" />

        {/* Initial Inhabitants */}
        <div className="flex flex-col gap-6">
          <h3 className="text-xl font-bold text-foreground">Initial Inhabitants</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* InhabitantCounter components commented out for now */}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col-reverse sm:flex-row items-center justify-end gap-4">
          <Button
            type="button"
            onClick={() => router.back()}
            className="btn-cancel"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="btn-submit"
            disabled={isSubmitting}
          >
            <span className="material-symbols-outlined text-lg">rocket_launch</span>
            Launch Tank
          </Button>
        </div>
      </form>
    </Form>
  )
}

// ✅ Memoize InhabitantCounter to prevent unnecessary re-renders
const InhabitantCounter = memo(function InhabitantCounter({
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
})
