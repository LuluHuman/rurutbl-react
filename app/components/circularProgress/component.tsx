import { CircularProgressType } from "@/app/lib/types";

import "./style.css";
import React from "react";

export function CircularProgress({ valuePercentage = 0, text }: CircularProgressType) {
	const FULL_DASH_ARRAY = 283;
	const circleDasharray = `${(1 - valuePercentage) * FULL_DASH_ARRAY} 283`;

	let timer = (
		<path
			strokeDasharray={circleDasharray}
			className="base-timer__path-remaining"
			d="M 50, 50m -45, 0a 45,45 0 1,0 90,0a 45,45 0 1,0 -90,0"
		/>
	);

	return (
		<div className="timer-container">
			<div className="base-timer">
				<svg
					className="base-timer__svg"
					viewBox="0 0 100 100"
					xmlns="http://www.w3.org/2000/svg">
					<g className="base-timer__circle">
						<circle
							className="base-timer__path-elapsed"
							cx="50"
							cy="50"
							r="45"
						/>
						{timer}
					</g>
				</svg>
				<div>
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
		<div className="timer-container">
			<div className="base-timer">
				<svg
					className="base-timer__svg"
					viewBox="0 0 100 100"
					xmlns="http://www.w3.org/2000/svg">
					<g className="base-timer__circle">
						<circle
							className="base-timer__path-elapsed"
							cx="50"
							cy="50"
							r="45"
						/>
						<path
							strokeDasharray="283"
							className="base-timer__path-remaining"
							d="M 50, 50m -45, 0a 45,45 0 1,0 90,0a 45,45 0 1,0 -90,0"
						/>
					</g>
				</svg>
				<div>
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
