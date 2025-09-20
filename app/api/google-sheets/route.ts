import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
    try {
        const data = await request.json()

        console.log(data);

        // Google Sheets API configuration
        const GOOGLE_SHEETS_API_KEY = process.env.GOOGLE_SHEETS_API_KEY
        const SPREADSHEET_ID = process.env.GOOGLE_SPREADSHEET_ID
        const RANGE = "Sheet1!A:E" // Adjust range as needed

        if (!GOOGLE_SHEETS_API_KEY || !SPREADSHEET_ID) {
            throw new Error("Missing Google Sheets configuration")
        }

        // Prepare the data to be inserted
        const rowData = [
            data.name,
            data.attendance === "groom" ? "Հարսի կողմ" : "Փեսայի կողմ",
            data.willCome === "yes" ? "Նենք կգամ" : "Չենք կարող գալ",
            data.guestCount || "0",
            new Date(data.submittedAt).toLocaleString("hy-AM"),
        ]

        // Google Sheets API URL for appending data
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${RANGE}:append?valueInputOption=RAW&key=${GOOGLE_SHEETS_API_KEY}`

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                values: [rowData],
            }),
        })

        if (!response.ok) {
            const errorData = await response.json()
            console.error("Google Sheets API Error:", errorData)
            throw new Error(`Google Sheets API error: ${response.status}`)
        }

        const result = await response.json()
        console.log("Successfully added to Google Sheets:", result)

        return NextResponse.json({
            success: true,
            message: "RSVP submitted successfully to Google Sheets",
        })
    } catch (error) {
        console.error("Error submitting to Google Sheets:", error)
        return NextResponse.json(
            {
                success: false,
                message: "Failed to submit RSVP to Google Sheets",
                error: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 },
        )
    }
}
