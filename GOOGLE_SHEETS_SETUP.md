# Google Sheets Setup Guide for Wedding RSVP

## Step 1: Create a Google Sheet
1. Go to [Google Sheets](https://sheets.google.com/)
2. Click "Blank" to create a new spreadsheet
3. Rename it to "Wedding RSVP Responses" or similar
4. In the first row, add these headers:
   - A1: **Name**
   - B1: **Side**
   - C1: **Will Attend**
   - D1: **Guest Count**
   - E1: **Submitted At**

## Step 2: Get the Spreadsheet ID
1. Look at your Google Sheet URL, it will look like:
   `https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit#gid=0`
2. Copy the long string between `/d/` and `/edit` - this is your **SPREADSHEET_ID**
3. In this example: `1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms`

## Step 3: Make the Sheet Accessible
1. Click the **"Share"** button in the top right
2. Change the access to **"Anyone with the link can edit"** (required for API access)
3. Click "Done"

## Step 4: Create Google Cloud Project & API Key
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the **Google Sheets API**:
   - Go to "APIs & Services" > "Library"
   - Search for "Google Sheets API"
   - Click on it and press "Enable"

## Step 5: Create API Key
1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "API Key"
3. Copy the API key (it will look like: `AIzaSyBo...`)
4. **Optional but recommended**: Click "Restrict Key" and limit it to Google Sheets API only

## Step 6: Add Environment Variables
Create a `.env.local` file in your project root and add:

\`\`\`env
NEXT_PUBLIC_GOOGLE_SHEETS_API_KEY=AIzaSyBo_your_actual_api_key_here
NEXT_PUBLIC_GOOGLE_SPREADSHEET_ID=1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms
\`\`\`

## Step 7: Test the Integration
1. Start your development server: `npm run dev`
2. Fill out the RSVP form and submit
3. Check your Google Sheet - new responses should appear automatically!

## Troubleshooting
- **403 Error**: Make sure the sheet is shared publicly with edit access
- **400 Error**: Check that your spreadsheet ID is correct
- **API Key Error**: Verify your API key is correct and Google Sheets API is enabled
- **CORS Error**: This shouldn't happen with Google Sheets API, but if it does, the API key might be restricted

## Security Note
Since the API key is client-side visible (NEXT_PUBLIC_), make sure to:
1. Restrict the API key to only Google Sheets API
2. Consider adding HTTP referrer restrictions in Google Cloud Console
3. Monitor usage in Google Cloud Console
