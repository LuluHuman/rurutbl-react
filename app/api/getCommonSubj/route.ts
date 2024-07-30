import { type NextRequest } from 'next/server'
import path from "path"
import fs from "fs"
import { dayList, weekList } from '@/app/lib/types'
interface mem {
    [key: string]: {
        [key: string]: object | undefined
    }
}
const memory: mem = {}
const alp = "xABCDEFGHI".split("");

export const dynamic = 'force-dynamic'
export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams
    const subjectName: string | null = searchParams.get('subjectName')

    const _w = searchParams.get('week')
    const week: string = _w ? _w.toLowerCase() : "odd"

    if (!subjectName) return Response.json({ err: "subjectName is required" }, { status: 400 })
    if (memory[week] && memory[week][subjectName]) return Response.json(memory[week][subjectName])

    var output: any = {};

    const classesPath = path.join(process.cwd(), "/public/classes")
    const levelDir = await fs.readdirSync(classesPath)
    const prom = levelDir.map(async lvl => {
        const classNames = await fs.readdirSync(path.join(classesPath, lvl))
        classNames.map(classesLoop)
        async function classesLoop(className: string) {
            const weekListr = fs.readFileSync(path.join(classesPath, lvl, className, `${week}.json`))
            const weekList = JSON.parse(weekListr.toString())


            for (const day in weekList) {
                const dayList = weekList[day];
                loopDays(dayList, day as keyof weekList)
            }
            function loopDays(dayList: dayList, day: keyof weekList) {
                const dayListTimes = Object.keys(dayList)

                for (let i = 0; i < dayListTimes.length; i++) {
                    const subjStartTime = dayListTimes[i];
                    const subjEndTime = dayListTimes[i + 1];


                    const subjDuration = parseInt(subjEndTime) - parseInt(subjStartTime)
                    const periods = subjDuration / 1200000

                    const subjName = dayList[subjStartTime];

                    if (!subjName) continue
                    if (!subjectName) return
                    if (!subjName.includes(subjectName)) continue

                    loopSubjs(day, periods, parseInt(subjStartTime))
                }
            }

            function loopSubjs(day: keyof weekList, periods: number, subjStartTime: number) {
                if (!output[day]) output[day] = {}

                for (let x = 0; x < periods; x++) {
                    const timeOffset = (x) * 1200000
                    const time = subjStartTime + timeOffset
                    if (!output[day][time]) output[day][time] = []
                    output[day][time].push(lvl + alp[parseInt(className)]);
                }
            }
        }
    })
    await Promise.all(prom);

    if (Object.keys(output).length == 0) return Response.json({ err: "No subjects reconised" }, { status: 400 })
    if (!memory[week]) memory[week] = {}
    memory[week][subjectName] = output

    return Response.json(output)
}

