import { google } from 'googleapis'
import { type NextRequest, NextResponse } from "next/server"

const SPREADSHEET_ID = process.env.GOOGLE_SPREADSHEET_ID

const auth = new google.auth.GoogleAuth({
    credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY || "{}"),
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
})

const sheets = google.sheets({ version: "v4", auth })

export async function POST(request: NextRequest) {
    try {
        const data = await request.json()

        // Google Sheets API configuration
        const rowData = [
            data.name,
            data.attendance === "bride" ? "Հարսի կողմ" : "Փեսայի կողմ",
            data.willCome === "yes" ? "Մենք կգանք" : "Չենք կարող գալ",
            Number(data.guestCount) || 0,
            new Date(data.submittedAt).toLocaleString("hy-AM"),
        ]

        const response = await sheets.spreadsheets.values.append({
            spreadsheetId: SPREADSHEET_ID,
            range: "Sheet1!A:E",
            valueInputOption: "RAW",
            requestBody: {
                values: [rowData],
            },
        })

        if (!response.data) {
            console.error("Google Sheets API Error:", response)
            throw new Error(`Google Sheets API error: ${response.status}`)
        }

        // console.log("Successfully added to Google Sheets:", response.data)
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
