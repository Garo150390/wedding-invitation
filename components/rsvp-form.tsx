"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
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
    const [focusedField, setFocusedField] = useState<string | null>(null)
    const [keyboardOpen, setKeyboardOpen] = useState(false)
    const formRef = useRef<HTMLFormElement>(null)
    const { toast } = useToast()

    // Handle mobile keyboard detection and scrolling
    useEffect(() => {
        if (!open) return

        const initialViewportHeight = window.visualViewport?.height || window.innerHeight

        const handleViewportChange = () => {
            if (window.visualViewport) {
                const currentHeight = window.visualViewport.height
                const heightDifference = initialViewportHeight - currentHeight

                // If viewport height decreased by more than 150px, keyboard is likely open
                if (heightDifference > 150) {
                    setKeyboardOpen(true)
                    // Scroll the focused element into view
                    setTimeout(() => {
                        const activeElement = document.activeElement as HTMLElement
                        if (activeElement && activeElement.scrollIntoView) {
                            activeElement.scrollIntoView({
                                behavior: "smooth",
                                block: "center",
                                inline: "nearest",
                            })
                        }
                    }, 100)
                } else {
                    setKeyboardOpen(false)
                }
            }
        }

        const handleResize = () => {
            const currentHeight = window.innerHeight
            const heightDifference = initialViewportHeight - currentHeight

            if (heightDifference > 150) {
                setKeyboardOpen(true)
            } else {
                setKeyboardOpen(false)
            }
        }

        // Use Visual Viewport API if available, fallback to resize event
        if (window.visualViewport) {
            window.visualViewport.addEventListener("resize", handleViewportChange)
        } else {
            window.addEventListener("resize", handleResize)
        }

        // Prevent body scroll when modal is open
        document.body.style.overflow = "hidden"
        document.body.style.position = "fixed"
        document.body.style.width = "100%"

        return () => {
            if (window.visualViewport) {
                window.visualViewport.removeEventListener("resize", handleViewportChange)
            } else {
                window.removeEventListener("resize", handleResize)
            }

            document.body.style.overflow = "unset"
            document.body.style.position = "unset"
            document.body.style.width = "unset"
            setKeyboardOpen(false)
        }
    }, [open])

    const handleInputFocus = (fieldName: string) => {
        setFocusedField(fieldName)

        // Small delay to ensure keyboard is opening
        setTimeout(() => {
            const activeElement = document.activeElement as HTMLElement
            if (activeElement) {
                activeElement.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                    inline: "nearest",
                })
            }
        }, 300)
    }

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

            const result = await response.json()

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
            <DialogContent
                className={`
          w-[95vw] max-w-md mx-auto
          ${
                    keyboardOpen ? "h-[50vh] max-h-[50vh] top-[10%] translate-y-0" : "max-h-[85vh] top-[50%] translate-y-[-50%]"
                }
          overflow-y-auto
          transition-all duration-300 ease-in-out
        `}
            >
                <DialogHeader className="pb-2 flex-shrink-0">
                    <DialogTitle className="text-gray-500 text-xs text-center font-medium text-dark leading-relaxed">
                        Խնդրում ենք հաստատել Ձեր ներկայությունը մինչև
                        <br />
                        <strong className="text-black ">10.10.2025։</strong>
                    </DialogTitle>
                </DialogHeader>

                <form ref={formRef} onSubmit={handleSubmit} className="space-y-6 mt-4 flex-1">
                    {/* First Radio Group - Groom/Bride Side */}
                    <div className="space-y-4 hidden">
                        <RadioGroup
                            value={formData.attendance}
                            onValueChange={(value) => setFormData({ ...formData, attendance: value })}
                            className="space-y-2"
                        >
                            <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                                <RadioGroupItem
                                    value="groom"
                                    id="groom"
                                    className="w-5 h-5 border-2 border-gold data-[state=checked]:bg-gold data-[state=checked]:border-gold"
                                />
                                <Label htmlFor="groom" className="text-gray text-base font-medium cursor-pointer flex-1">
                                    Փեսայի կողմ
                                </Label>
                            </div>
                            <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                                <RadioGroupItem
                                    value="bride"
                                    id="bride"
                                    className="w-5 h-5 border-2 border-gold data-[state=checked]:bg-gold data-[state=checked]:border-gold"
                                />
                                <Label htmlFor="bride" className="text-gray text-base font-medium cursor-pointer flex-1">
                                    Հարսի կողմ
                                </Label>
                            </div>
                        </RadioGroup>
                    </div>

                    {/* Name Input */}
                    <div className="space-y-2">
                        <div className="relative">
                            <input
                                id="name"
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                onFocus={() => handleInputFocus("name")}
                                onBlur={() => setFocusedField(null)}
                                className="peer w-full px-4 py-4 text-base bg-transparent border-2 border-gray/20 rounded-lg focus:border-gold focus:outline-none transition-all duration-200 placeholder-transparent"
                                placeholder="Անուն Ազգանուն"
                                autoComplete="name"
                            />
                            <Label
                                htmlFor="name"
                                className={`absolute left-4 transition-all duration-200 pointer-events-none ${
                                    focusedField === "name" || formData.name
                                        ? "-top-2 text-xs bg-white px-1 text-gold"
                                        : "top-4 text-base text-gray-400"
                                }`}
                            >
                                Անուն Ազգանուն
                            </Label>
                        </div>
                    </div>

                    {/* Second Radio Group - Will Come */}
                    <div className="space-y-3">
                        <RadioGroup
                            value={formData.willCome}
                            onValueChange={(value) => setFormData({ ...formData, willCome: value })}
                            className="space-y-2"
                        >
                            <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                                <RadioGroupItem
                                    value="yes"
                                    id="will-yes"
                                    className="w-5 h-5 border-2 border-gold data-[state=checked]:bg-gold data-[state=checked]:border-gold"
                                />
                                <Label htmlFor="will-yes" className="text-gray text-base font-medium cursor-pointer flex-1">
                                    Մենք կգանք
                                </Label>
                            </div>
                            <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                                <RadioGroupItem
                                    value="no"
                                    id="will-no"
                                    className="w-5 h-5 border-2 border-gold data-[state=checked]:bg-gold data-[state=checked]:border-gold"
                                />
                                <Label htmlFor="will-no" className="text-gray text-base font-medium cursor-pointer flex-1">
                                    Չենք կարող գալ :(
                                </Label>
                            </div>
                        </RadioGroup>
                    </div>

                    {/* Guest Count Input */}
                    <div className="space-y-2">
                        <div className="relative">
                            <input
                                id="guestCount"
                                type="number"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                min="1"
                                max="20"
                                value={formData.guestCount}
                                onChange={(e) => setFormData({ ...formData, guestCount: e.target.value })}
                                onFocus={() => handleInputFocus("guestCount")}
                                onBlur={() => setFocusedField(null)}
                                className="peer w-full px-4 py-4 text-base bg-transparent border-2 border-gray/20 rounded-lg focus:border-gold focus:outline-none transition-all duration-200 placeholder-transparent"
                                placeholder="Հյուրերի թիվ"
                                autoComplete="off"
                            />
                            <Label
                                htmlFor="guestCount"
                                className={`absolute left-4 transition-all duration-200 pointer-events-none ${
                                    focusedField === "guestCount" || formData.guestCount
                                        ? "-top-2 text-xs bg-white px-1 text-gold"
                                        : "top-4 text-base text-gray-400"
                                }`}
                            >
                                Հյուրերի թիվ
                            </Label>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className={`flex justify-center pt-4 pb-2 ${keyboardOpen ? "pb-6 !mb-40" : ""}`}>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full sm:w-auto bg-gold hover:bg-gold/90 text-white px-8 py-4 rounded-full text-base font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105"
                        >
                            {isSubmitting ? (
                                <div className="flex items-center space-x-2">
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    <span>Ուղարկվում է...</span>
                                </div>
                            ) : (
                                "Ուղարկել"
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
