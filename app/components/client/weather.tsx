"use client";

import { DateMs } from "@/app/lib/functions";
import { dayList, weekList } from "@/app/lib/types";
import { useEffect, useState } from "react";
import BeachAccessIcon from "@mui/icons-material/BeachAccess";
import Link from "next/link";
const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function WeatherData({ dayList, day }: { dayList: dayList; day?: keyof weekList }) {
	const placeholder = (
		<div
			className="flex items-center gap-2 p-2 m-2 bg-on-secondary-color rounded-lg"
			key={"12asdf"}>
			<div className="size-6 bg-primary-color"></div>
			<div className="w-full">
				<h1 className="w-3/4 h-4 bg-primary-color m-2"></h1>
				<p className="w-3/4  h-4 bg-primary-color m-2"></p>
			</div>
		</div>
	);
	const [element, setElement] = useState<React.JSX.Element[]>([placeholder]);
	useEffect(() => {
		const d = Object.keys(dayList);
		if (!d[0] || !day) return;

		const endTimeMs = parseInt(d[d.length - 1]);

		const dateNow = new DateMs();
		const midnight = dateNow.getTime() - dateNow.getMidnightOffset();

		const endDate = new Date(midnight + endTimeMs);

		function filterToEndHour(w: any) {
			const date = new Date(w.dt * 1000);
			return (
				date.getHours() == endDate.getHours() &&
				date.getDay() == days.findIndex((e) => e == day)
			);
		}
		fetch("/api/weather")
			.then((d) => d.json())
			.then((data) => {
				const currentForecast = (data.hourly as any[]).filter(filterToEndHour)[0];
				if (!currentForecast) return setElement([]);
				const currentWeather = currentForecast.weather as {
					id: number;
					main: string;
					description: string;
					icon: string;
				}[];
				const elements = currentWeather.map((weatherNotices, i) => {
					const needUmbrella = weatherNotices.id < 800; //? https://openweathermap.org/weather-conditions#Weather-Condition-Codes-2
					if (!needUmbrella) return <></>;
					return (
						<div
							className="flex items-center gap-2 p-2 m-2 bg-cyan-600 rounded-lg"
							key={i}>
							<BeachAccessIcon />
							<div>
								<span className="opacity-40">
									<Link
										target="_blank"
										className="underline"
										href="https://openweathermap.org">
										openweathermap.org
									</Link>
									{" @" + endDate.getHours() + ":00"}
								</span>
								<h1 className="font-bold">Grab an Umbrella it might rain</h1>
								<p>
									{weatherNotices.main} - {weatherNotices.description}
								</p>
							</div>
						</div>
					);
				});
				setElement(elements);
			});
	}, [dayList, day]);

	return element;
}
