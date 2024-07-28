import { type NextRequest } from 'next/server'

type busStop = {
    "BusStopCode": string,
    "RoadName": string,
    "Description": string,
    "Latitude": number,
    "Longitude": number
}
type totalBusStops = busStop[]
const totalBusStops: totalBusStops = require("@/app/lib/bus_stop.json")

export const dynamic = 'force-dynamic' // defaults to auto
export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams
    const q: string | null = searchParams.get('q')
    if (!q) return Response.json({ error: "param q was not set" }, { status: 400 })

    const result = totalBusStops.filter(bs =>
        bs.BusStopCode.startsWith(q) ||
        bs.Description.toLowerCase().includes(q.toLowerCase())
    ).toSpliced(45)
    return Response.json(result)
}