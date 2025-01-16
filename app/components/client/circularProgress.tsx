import { CircularProgressType } from "@/app/lib/types";

import React from "react";

export function CircularProgress({ valuePercentage = 0, text }: CircularProgressType) {
	if (text.title == "")
		return (
			<div className="h-[85vw] w-[85vw] max-h-pbsize max-w-pbsize flex items-center justify-center text-3xl">
				RuruTBL
			</div>
		);
	const FULL_DASH_ARRAY = 283;
	const circleDasharray = `${(1 - valuePercentage) * FULL_DASH_ARRAY} 283`;

	let timer = (
		<path
			strokeDasharray={circleDasharray}
			className="stroke-[5px] rotate-90 origin-center transition-all duration-1000 ease-linear  stroke-current"
			style={{ strokeLinecap: "round", fillRule: "nonzero" }} // Tailwind you suck (better then bootstrap tho)
			d="M 50, 50m -45, 0a 45,45 0 1,0 90,0a 45,45 0 1,0 -90,0"
		/>
	);

	return (
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
						{timer}
					</g>
				</svg>
				<div className="absolute top-0  w-full h-full flex items-center justify-center flex-col   text-center">
					<span>{text.title /*Math*/}</span>
					<span>{text.subtitle /*Time until {Next Subject} || Time Left*/}</span>
					<span>{text.timeRemaining}</span>
				</div>
			</div>
		</div>
	);
}

export function CircularProgressLoading() {
	return (
		<div className="h-full w-full max-h-pbsize max-w-pbsize	">
			<div className="relative w-full h-full">
				<svg
					className="scale-x-[1]"
					viewBox="0 0 100 100"
					xmlns="http://www.w3.org/2000/svg">
					<g className="fill-none stroke-none">
						<circle
							className="stroke-[5px] stroke-gray-600"
							cx="50"
							cy="50"
							r="45"
						/>
						<path
							strokeDasharray="283"
							className="stroke-[5px] rotate-90 origin-center transition-all ease-linear  stroke-current"
							d="M 50, 50m -45, 0a 45,45 0 1,0 90,0a 45,45 0 1,0 -90,0"
						/>
					</g>
				</svg>
				<div className="absolute top-0  w-full h-full    flex items-center justify-center flex-col   text-center">
					<span className="px40" />
					<span
						className="px40"
						style={{ minWidth: "90px", width: "unset" }}
					/>
					<span className="px40" />
				</div>
			</div>
		</div>
	);
}
