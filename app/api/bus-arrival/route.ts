import axios from "axios"
import { type NextRequest } from 'next/server'

const cache: { [key: string]: any; } = {}
export const dynamic = 'force-dynamic' // defaults to auto
export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams
    const busStopCode = searchParams.get('BusStopCode')
    if (!busStopCode) return Response.json({ error: "param busStopCode was not set" }, { status: 400 })

    let _busStopIsCached = Object.prototype.hasOwnProperty.call(cache, busStopCode)
    let _isBeforeExpiry = cache[busStopCode] ? cache[busStopCode].clears_in > new Date().getTime() : false
    if (_busStopIsCached && _isBeforeExpiry) {
        const cachedData = cache[busStopCode].data
        return Response.json(cachedData.Services)
    }

    const headersList = { "AccountKey": process.env.datamallkey }
    const url = `https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival?BusStopCode=${busStopCode}`
    const reqOptions = { url: url, method: "GET", headers: headersList }
    try {
        console.log(reqOptions);

        const response = await axios.request(reqOptions)
        
        cache[busStopCode] = {
            data: response.data,
            clears_in: new Date().getTime() + 30000
        }
        return Response.json(response.data.Services);
    } catch (err: any) {
        return Response.json({ error: err.message }, { status: 500 })
    }
}

