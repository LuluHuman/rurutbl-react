"use client";

import { useEffect, useState } from "react";
import { CircularProgress, CircularProgressLoading } from "./components/client/circularProgress";

export default function Home() {
	const semstartStartDate = new Date("2025-1-2 8:00 am").getTime();
	const [msTimeLeft, SetTimeLeft] = useState(semstartStartDate - new Date().getTime());

	useEffect(() => {
		const i = setInterval(() => {
			SetTimeLeft(semstartStartDate - new Date().getTime());
		}, 1_000);
	}, []);

	const timeleftFraction = msTimeLeft / semstartStartDate;
	const FULL_DASH_ARRAY = 283;
	const circleDasharray = `${timeleftFraction * FULL_DASH_ARRAY} 283`;
	const _days = Math.ceil(msTimeLeft / 24 / 60 / 60 / 1000);
	return (
		<div className="w-screen h-screen flex items-center justify-center">
			<div className="h-[85vw] w-[85vw] max-h-pbsize max-w-pbsize">
				<div className="relative w-full h-full">
					<svg
						className="scale-x-[1]"
						viewBox="0 0 100 100"
						xmlns="http://www.w3.org/2000/svg">
						<g className="fill-none stroke-none]">
							<circle
								className="stroke-[5px] stroke-gray-600"
								cx="50"
								cy="50"
								r="45"
							/>
							<path
								strokeDasharray={circleDasharray}
								className="stroke-[5px] rotate-90 origin-center transition-all duration-1000 ease-linear  stroke-current"
								style={{ strokeLinecap: "round", fillRule: "nonzero" }}
								d="M 50, 50m -45, 0a 45,45 0 1,0 90,0a 45,45 0 1,0 -90,0"
							/>
						</g>
					</svg>
					<div className="absolute top-0  w-full h-full flex items-center justify-center flex-col   text-center">
						<span>{_days} Days left</span>
					</div>
				</div>
			</div>
		</div>
	);
}
