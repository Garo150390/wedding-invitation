"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/hooks/use-toast"

interface RSVPFormProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function RSVPForm({ open, onOpenChange }: RSVPFormProps) {
    const [formData, setFormData] = useState({
        attendance: "",
        name: "",
        willCome: "yes",
        guestCount: "",
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const { toast } = useToast()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        // for weeding
        // if (!formData.name || !formData.attendance || !formData.willCome || !formData.guestCount) {
        //     console.log()
        //     toast({
        //         title: "Խնդրում ենք լրացնել բոլոր դաշտերը",
        //         description: "Անունը և կողմի ընտրությունը պարտադիր են:",
        //         variant: "destructive",
        //     })
        //     return
        // }

        if (!formData.name || !formData.willCome || !formData.guestCount) {
            console.log()
            toast({
                title: "Խնդրում ենք լրացնել բոլոր դաշտերը",
                description: "Անունը և կողմի ընտրությունը պարտադիր են:",
                variant: "destructive",
            })
            return
        }

        setIsSubmitting(true)

        try {
            // Call the Google Sheets function directly
            const response = await fetch("/api/google-sheets-oauth", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...formData,
                    submittedAt: new Date().toISOString(),
                }),
            })

            const result = await response.json();

            console.log({ result });

            if (response.ok) {
                toast({
                    title: "Շնորհակալություն!",
                    description: "Ձեր պատասխանը հաջողությամբ ուղարկվեց:",
                })
                setFormData({
                    attendance: "",
                    name: "",
                    willCome: "yes",
                    guestCount: "",
                })
                onOpenChange(false)
            } else {
                throw new Error(result.message || "Failed to submit")
            }
        } catch (error) {
            console.error("Error submitting RSVP:", error)
            toast({
                title: "Սխալ",
                description: "Խնդրում ենք կրկին փորձել:",
                variant: "destructive",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md mx-4">
                <DialogHeader>
                    <DialogTitle className="text-center text-lg font-medium text-dark leading-relaxed">
                        Խնդրում ենք հաստատել Ձեր ներկայությունը մեր շքամուտ
                        <br />
                        մինչև 13.08.2025
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 mt-6">
                    {/* First Radio Group - Groom/Bride Side */}
                    <div className="space-y-3 hidden">
                        <RadioGroup
                            value={formData.attendance}
                            onValueChange={(value) => setFormData({ ...formData, attendance: value })}
                        >
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="groom" id="groom" />
                                <Label htmlFor="groom" className="text-gray">
                                    Փեսայի կողմ
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="bride" id="bride" />
                                <Label htmlFor="bride" className="text-gray">
                                    Հարսի կողմ
                                </Label>
                            </div>
                        </RadioGroup>
                    </div>

                    {/* Name Input */}
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-gray">
                            Անուն Ազգանուն
                        </Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="border-b border-gray/30 border-t-0 border-l-0 border-r-0 rounded-none px-0 focus:border-gold"
                            placeholder=""
                        />
                    </div>

                    {/* Second Radio Group - Will Come */}
                    <div className="space-y-3">
                        <RadioGroup
                            value={formData.willCome}
                            onValueChange={(value) => setFormData({ ...formData, willCome: value })}
                        >
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="yes" id="will-yes" />
                                <Label htmlFor="will-yes" className="text-gray">
                                    Մենք կգանք
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="no" id="will-no" />
                                <Label htmlFor="will-no" className="text-gray">
                                    Չենք կարող գալ :(
                                </Label>
                            </div>
                        </RadioGroup>
                    </div>

                    {/* Guest Count Input */}
                    <div className="space-y-2">
                        <Label htmlFor="guestCount" className="text-gray">
                            Հյուրերի թիվ
                        </Label>
                        <Input
                            id="guestCount"
                            type="number"
                            min="1"
                            value={formData.guestCount}
                            onChange={(e) => setFormData({ ...formData, guestCount: e.target.value })}
                            className="border-b border-gray/30 border-t-0 border-l-0 border-r-0 rounded-none px-0 focus:border-gold"
                            placeholder=""
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-center pt-4">
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-white border-2 border-dark text-dark hover:bg-gray/10 px-8 py-2 rounded-full disabled:opacity-50"
                        >
                            {isSubmitting ? "Ուղարկվում է..." : "Ուղարկել"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
