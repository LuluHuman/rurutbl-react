import path from "path"
import fs from "fs"

var preload: undefined | object

export async function GET() {
    if (preload) return Response.json(preload)

    var responseJson: any = {}
    const classesPath = path.join(process.cwd(), "public", "classes");
    const classesDir = fs.readdirSync(classesPath);
    classesDir.forEach(levelName => {
        responseJson[levelName] = [];
        const file_path = path.join(classesPath, levelName);
        const classNames = fs.readdirSync(file_path)
        classNames.forEach(className => { responseJson[levelName].push(className); });
    });
    preload = responseJson
    return Response.json(responseJson)
}

