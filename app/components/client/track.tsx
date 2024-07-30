"use client";

import { crowdedness, TrackType } from "@/app/lib/types";
import { msToHM } from "@/app/lib/trackHelper";
import "./style.css";
import { useEffect, useState } from "react";

export function Track({ dayList, active, day, settings, isOdd }: TrackType) {
	var track: React.JSX.Element[] = [];
	var i = 0;

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
		var crowd = <></>;

		if (isFinished) styles.push("line-through");
		switch (subject) {
			case "Recess":
			case "Break": {
				styles.push("text-gray-500");
				crowd = (
					<Crowdedness
						subject={subject}
						day={day}
						isOdd={isOdd}
						time={lsnStartTime}
					/>
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

function Crowdedness({ subject, day, isOdd, time }: any) {
	const [crowdedness, setCrowd] = useState<React.JSX.Element>(<>...</>);
	const path = "/api/getCommonSubj";
	const url = `${path}?subjectName=${subject}&week=${isOdd ? "Odd" : "Even"}`;
	useEffect(() => {
		fetch(url)
			.then((d) => d.json())
			.then((crowdness) => {
				const dayOfCrowd = crowdness[day as keyof crowdedness];
				if (dayOfCrowd == undefined) return setCrowd(<>xP</>);
				const classes = dayOfCrowd[time.toString()];
				const classes2 = dayOfCrowd[(time + 1200000).toString()];
				if (!classes || !classes2) return setCrowd(<>xP</>);
				
				const color = (classes: string[]) => {
					const percentage = (classes.length / 13) * 100;
					if (percentage <= 30) return "#0a0";
					if (percentage <= 60 && percentage >= 30) return "#FF9800";
					if (percentage >= 60) return "#F00";
				};
				setCrowd(
					<>
						{subject == "Recess" ? (
							[classes, classes2].map((c) => {
								return (
									<div
										className={"rangein"}
										style={{
											backgroundColor: color(c),
										}}
										aria-label={c.join(", ")}>
										{c.length} Classes
									</div>
								);
							})
						) : (
							<div
								className={"rangein"}
								style={{
									backgroundColor: color(classes),
								}}
								aria-label={classes.join(", ")}>
								{classes.length} Classes ({classes.join(", ")})
							</div>
						)}
					</>
				);
			});
	}, []);
	return <div className={"rangeout"}>Crowdedness {crowdedness}</div>;
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
