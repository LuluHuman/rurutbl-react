import { type NextRequest } from 'next/server'
import path, { parse } from "path"
import fs from "fs"
export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams
    const subjectName: string | null = searchParams.get('subjectName')
    var week: string | null = searchParams.get('week')

    var output: any = {};

    const classesPath = path.join(process.cwd(), "/public/classes")
    const levelDir = await fs.readdirSync(classesPath)
    const m = levelDir.map(async lvl => {
        const classNames = await fs.readdirSync(path.join(classesPath, lvl))
        classNames.map(async className => {
            const weekListr = fs.readFileSync(path.join(classesPath, lvl, className, `${week ? week.toLowerCase() : "odd"}.json`))
            const weekList = JSON.parse(weekListr.toString())
            for (const day in weekList) {
                const dayList = weekList[day];
                for (const time in dayList) {
                    const name = dayList[time];
                    
                    if (!name) continue
                    if (!name.includes(subjectName)) continue
                    if (!output[day]) output[day] = {}
                    if (!output[day][time]) output[day][time] = []

                    var timep2: number | string = parseInt(time) + 120000;
                    timep2 = timep2 < 1000 ? "0" + timep2 : timep2.toString();
                    if (!output[day][timep2]) output[day][timep2] = [];

                    const alp = "xABCDEFGHI".split("");
                    output[day][time].push(lvl + alp[parseInt(className)]);
                    output[day][timep2].push(lvl + alp[parseInt(className)]);
                }
            }
        })
    })
    await Promise.all(m);

    return Response.json(output)
}

