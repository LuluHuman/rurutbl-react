import { type NextRequest } from 'next/server'
import path from "path"
import fs from "fs"
export const dynamic = 'force-dynamic' // defaults to auto
export async function GET(req: NextRequest) {
    var json: any = {}
    const folder = path.join(process.cwd(), "public", "classes");
    const dir = fs.readdirSync(folder);
    dir.forEach(levelName => {
        json[levelName] = [];
        const file_path = path.join(folder, levelName);
        const classNames = fs.readdirSync(file_path)
        classNames.forEach(className => { json[levelName].push(className); });
    });
    return Response.json(json)
}

