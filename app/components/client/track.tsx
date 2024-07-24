"use client";

import { TrackType } from "@/app/lib/types";
import { msToHM } from "@/app/lib/trackHelper";
import "./style.css";

function assignColor(percentage: number) {
	if (percentage <= 30) return "#0a0";
	if (percentage <= 60 && percentage >= 30) return "#FF9800";
	if (percentage >= 60) return "#F00";
}

export function Track({ dayList, active, canteenCrowdness, day, settings }: TrackType) {
	var track: React.JSX.Element[] = [];
	var i = 0;
	if (!dayList) return <>Error</>;

	const timeList = Object.keys(dayList).toSorted();

	timeList.forEach(async (lsnStartTimex) => {
		const lsnStartTime = parseInt(lsnStartTimex);
		var subject = dayList[lsnStartTimex];
		subject = i == timeList.length - 1 ? "END" : subject || "";

		var HM = msToHM(lsnStartTime);

		let isFinished = i < (active || 0);
		let isActive = i == active;
		let isEND = subject == "END";

		var styles: string[] = [];
		var crowd = null;

		if (isFinished) styles.push("line-through");
		switch (subject) {
			case "Recess":
			case "Break": {
				styles.push("text-gray-500");
				const a = canteenCrowdness[subject];
				const b = a[day];
				if (b == undefined) break;
				const classes = b[lsnStartTime.toString()];
				if (classes == undefined) break;
				crowd = (
					<div className={"rangeout"}>
						Crowdedness
						<div
							className={"rangein"}
							style={{ backgroundColor: assignColor((classes.length / 13) * 100) }}>
							{classes.length}: {classes.join(", ")}
						</div>
					</div>
				);

				break;
			}

			case "{SciElec}":
				subject = settings.Elec.Sci || subject;

			default:
				break;
		}
		const li = (
			<li
				className={`${isEND ? "endLi" : "subjLi"} ${isActive ? "active" : ""} `}
				key={typeof subject == "string" ? subject : subject[0]}>
				{isEND ? (
					<span>END - {HM}</span>
				) : (
					<>
						<div className={styles.join(" ")}>
							{typeof subject == "string" ? subject : subject.join(" / ")}
						</div>
						<div className={styles.join(" ")}>{HM}</div>
						{crowd}
					</>
				)}
			</li>
		);
		track.push(li);
		i++;
	});
	return <ul id="track">{track}</ul>;
}

export function TrackLoading() {
	return (
		<ul id="track">
			{[1, 2, 3, 4, 5, 6].map((index) => (
				<li
					key={index}
					className="li-loading">
					<div className="px40"></div>
					<div className="px40"></div>
				</li>
			))}
		</ul>
	);
}
