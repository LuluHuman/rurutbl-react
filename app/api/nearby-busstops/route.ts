import haversine from "haversine-distance"
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

export const dynamic = 'force-dynamic' 
export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams
    const lat: string | null = searchParams.get('lat')
    const lon: string | null = searchParams.get('lon')

    if (!lat || !lon) return Response.json({ err: "lat/long prams not present" }, { status: 400 })
    const poi = { "lat": Number(lat), "lon": Number(lon) };
    const nearestBusStop = findNearestBusStop(poi, totalBusStops);
    return Response.json(nearestBusStop)
}
const findNearestBusStop = (poi: { "lat": number, "lon": number }, busStops: totalBusStops) => {
    const maxDistance = Infinity
    const maxResults = 45
    const nearbyBusStops: { busStop: busStop, distance: number }[] = [];

    busStops.forEach(busStop => {
        const busStopCoords = { lat: busStop.Latitude, lon: busStop.Longitude };
        const distance = haversine(poi, busStopCoords);
        if (distance <= maxDistance) nearbyBusStops.push({ busStop, distance });
    });

    nearbyBusStops.sort((a, b) => a.distance - b.distance);
    return nearbyBusStops.slice(0, maxResults).map(item => item.busStop);
};