import Image from "next/image";
import Root from "../components/root";
import path from "path";
import fs from "fs";
import ImageCanvas from "./display";
import { AltRoute } from "@mui/icons-material";

export default async function Watch({
	params,
	searchParams,
}: {
	params: { slug: string };
	searchParams?: { [key: string]: string | string[] | undefined };
}) {
	const level = searchParams?.l || 1;
	const classAlp = searchParams?.c || 1;
	const week = searchParams?.w || "odd";
	const day: string = (searchParams?.d as string) || "Monday";
	const i = (searchParams?.i as string) || "0";

	const classesPath = path.join(process.cwd(), "public", "classes");

	var responseJson: any = {};
	const classesDir = fs.readdirSync(classesPath);
	var classes_i = 1;
	classesDir.forEach((levelName) => {
		const file_path = path.join(classesPath, levelName);
		const classNames = fs.readdirSync(file_path);
		classNames.forEach((className) => {
			responseJson[levelName + className] = classes_i;
			classes_i++;
		});
	});

	const coordsFile = path.join(
		classesPath,
		level.toString(),
		classAlp.toString(),
		`${week}-coords.json`
	);

	if (!fs.existsSync(coordsFile)) return <>err</>;

	const coordsContent = JSON.parse(fs.readFileSync(coordsFile, "utf-8"));
	const coordsDay = coordsContent.output_diag[day];
	const coordsValue = Object.values(coordsDay).filter((o: any) => o.Name != "");

	const coords = coordsValue[parseInt(i) - 1] as any;
	const coords2 = coordsValue[parseInt(i) - 2] as any;

	return (
		<Root className="h-screen">
			<div className="max-w-full">
				<ol>
					<li>Day: {day}</li>
					<li>Scanned Name: {coords.Name}</li>
				</ol>
				<ImageCanvas
					imageUrl={`/pages/${week}/${responseJson[level?.toString() + classAlp]}.png`}
					x1={coords.x}
					y1={coords.y + 100}
					x2={coords2?.x || 261}
					y2={coords.y + 152}></ImageCanvas>
			</div>
		</Root>
	);
}
