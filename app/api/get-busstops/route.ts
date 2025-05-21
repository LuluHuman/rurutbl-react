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
    const BusStopCodesString: string | null = searchParams.get('BusStopCodes')
    if (!BusStopCodesString) return Response.json({ error: "param BusStopCodes was not set" }, { status: 400 })

    const BusStopCodes = BusStopCodesString.split(",").map(busStopCodes => totalBusStops.filter(bs => bs.BusStopCode == busStopCodes)[0])
    return Response.json(BusStopCodes)
}