import axios from 'axios'
import { type NextRequest } from 'next/server'

export const dynamic = 'force-dynamic' // defaults to auto
export async function GET(req: NextRequest) {
    // const _host = "http://api.weatherapi.com/v1/"
    // const _url = _host + "forecast.json"
    // const weather = await axios.get(_url, {
    //     params: {
    //         "key": "1a99e1ec8fa0411fad3140243220902",
    //         "q": "Singapore",
    //         "days": "1",
    //         "aqi": "no",
    //         "alerts": "no"
    //     }
    // })
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