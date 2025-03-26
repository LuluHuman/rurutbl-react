// https://muis.gov.sg/api/pagecontentapi/getprayertime depeicated 
// replaced with https://isomer-user-content.by.gov.sg/muis_prayers_timetable_2025.json

import axios from "axios"
import { type NextRequest } from 'next/server'

interface muis_prayers_timetable {
    [key: string]: {
        "hijri_date": string,
        "syuruk": string,
        "zohor": string,
        "asar": string,
        "maghrib": string,
        "isyak": string
    }
}

var cache: undefined | muis_prayers_timetable

export const dynamic = 'force-dynamic'
export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams
    const time = searchParams.get('v')

    const currentDate = new Date()
    const date = time ? new Date(parseInt(time)) : currentDate


    if (date.getFullYear() != currentDate.getFullYear()) return Response.json({ error: "param \"v\" should be UNIX time of the same year" }, { status: 400 })

    const dateParams = { timeZone: 'Asia/Singapore', year: 'numeric', month: '2-digit', day: '2-digit' }

    try {
        var dates = cache ? cache : await GetPrayerTimes(date)
        if (dates?.message == "error") return Response.json({ error: dates.error }, { status: 500 })
        dates = dates as muis_prayers_timetable

        const day = new Intl.DateTimeFormat('en-CA', dateParams as any).format(date);
        const fallbackDay = new Intl.DateTimeFormat('en-CA', dateParams as any).format(currentDate);

        const daySpecified = dates[day] || dates[fallbackDay]
        return Response.json(daySpecified);
    } catch (err: any) {
        return Response.json({ error: err.message }, { status: 500 })
    }
}

async function GetPrayerTimes(date: Date) {
    console.log("fetching");

    try {
        const url = `https://isomer-user-content.by.gov.sg/muis_prayers_timetable_${date.getFullYear()}.json`
        const headersList = { "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:135.0) Gecko/20100101 Firefox/135.0" }
        const reqOptions = { url: url, method: "GET", headers: headersList }
        const response = await axios.request(reqOptions)
        cache = response.data
        return response.data as muis_prayers_timetable
    } catch (err: any) {
        return { message: "error", error: err }
    }
}
