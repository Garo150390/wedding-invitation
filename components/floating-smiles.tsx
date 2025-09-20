"use client"

import { useEffect, useState } from "react"

export function FloatingSmiles() {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    // if (!mounted) return null

    const smiles = [
        { id: 1, emoji: "☀️", top: "441px", right: "110px", delay: "0s" }, // Near header
        { id: 2, emoji: "☀️", top: "644px", left: "15px", delay: "1s" }, // Near Armenian text
        { id: 3, emoji: "☀️", top: "770px", right: "30px", delay: "2s" }, // Near calendar
        { id: 6, emoji: "☀️", top: "1150px", left: "180px", delay: "1.5s" },
        { id: 5, emoji: "☀️", top: "1450px", right: "270px", delay: "1.5s" }, // Near bottom
    ]

    return (
        <>
            {smiles.map((smile) => (
                <div
                    key={smile.id}
                    // className="relative text-2xl opacity-20 pointer-events-none animate-float"
                    className="absolute text-5xl opacity-15 pointer-events-none z-10 animate-float"
                    style={{
                        top: smile.top,
                        left: smile.left,
                        right: smile.right,
                        animationDelay: smile.delay,
                    }}
                >
                    {smile.emoji}
                </div>
            ))}
        </>
    )
}
