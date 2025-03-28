"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { toast } from "@/components/ui/use-toast"
import { api } from "@/lib/api"
import { useState } from "react"
import { useSession } from "next-auth/react"

const profileFormSchema = z.object({
  businessName: z.string().min(2, {
    message: "Business name must be at least 2 characters.",
  }),
  businessAddress: z.string().min(10, {
    message: "Please enter a valid business address.",
  }),
  businessPhone: z.string().min(10, {
    message: "Please enter a valid phone number.",
  }),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

interface ProfileSettingsFormProps {
  initialData?: {
    businessName?: string
    businessAddress?: string
    businessPhone?: string
  }
}

export function ProfileSettingsForm({ initialData }: ProfileSettingsFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { data: session } = useSession()
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      businessName: initialData?.businessName || "",
      businessAddress: initialData?.businessAddress || "",
      businessPhone: initialData?.businessPhone || "",
    },
  })

  async function onSubmit(data: ProfileFormValues) {
    try {
      if (!session?.user?.id) {
        throw new Error("User not authenticated")
      }
      
      setIsLoading(true)
      await api.patch(`/business/profile`, data)
      toast({
        title: "Success",
        description: "Profile updated successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="businessName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Business Name</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter your business name" 
                    {...field} 
                    className="bg-white text-primary-dark border-primary"
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="businessAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Business Address</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter your business address"
                    className="min-h-[100px] bg-white text-primary-dark border-primary"
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="businessPhone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Business Phone</FormLabel>
                <FormControl>
                  <Input
                    type="tel"
                    placeholder="Enter your business phone number"
                    className="bg-white text-primary-dark border-primary"
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </Form>
  )
} 