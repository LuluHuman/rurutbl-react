import axios from 'axios'
import { type NextRequest } from 'next/server'

export const dynamic = 'force-dynamic' // defaults to auto
export async function GET(req: NextRequest) {
    const _host = "https://api.openweathermap.org/"
    const _url = _host + "data/2.5/onecall"
    const weather = await axios.get(_url, {
        params: {
            "lat": "1.3533278",
            "lon": "103.9309483",
            "units": "metric",
            "appid": "5796abbde9106b7da4febfae8c44c232",
        }
    })
    return Response.json(weather.data)
}