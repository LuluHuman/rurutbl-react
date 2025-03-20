// https://muis.gov.sg/api/pagecontentapi/getprayertime depeicated 
// replaced with https://isomer-user-content.by.gov.sg/muis_prayers_timetable_2025.json

import axios from "axios"
import { type NextRequest } from 'next/server'

export const dynamic = 'force-dynamic'
export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams
    const time = searchParams.get('v')

    const currentDate = new Date()
    const date = time ? new Date(parseInt(time)) : currentDate


    if (date.getFullYear() != currentDate.getFullYear()) return Response.json({ error: "param \"v\" should be UNIX time of the same year" }, { status: 400 })

    const url = `https://isomer-user-content.by.gov.sg/muis_prayers_timetable_${date.getFullYear()}.json`
    const headersList = { "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:135.0) Gecko/20100101 Firefox/135.0" }
    const reqOptions = { url: url, method: "GET", headers: headersList }

    try {
        const response = await axios.request(reqOptions)
        const dates = response.data

        const day = date.toLocaleString("en-CA", { dateStyle: "short" })
        const fallbackDay = currentDate.toLocaleString("en-CA", { dateStyle: "short" })

        const daySpecified = dates[day] || dates[fallbackDay]
        return Response.json(daySpecified);
    } catch (err: any) {
        return Response.json({ error: err.message }, { status: 500 })
    }
}
