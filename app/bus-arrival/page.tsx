"use client";

import React, { useState, useEffect, DOMElement } from "react";
import { state, busStop, services, nextBus } from "../lib/types";
import "material-icons/iconfont/material-icons.css";
import "./style.css";

// const apiEndpoint = "http://localhost";
const apiEndpoint = "https://api.luluhoy.tech";
export default function BusArrival() {
	const [state, setState] = useState<state>({ state: "loading", error: null });
	const [coords, setCoords] = useState<{ latitude: number; longitude: number }>();
	const [children, setChildren] = useState<React.JSX.Element[]>();
	const [searchChildren, setSearchChildren] = useState<React.JSX.Element[]>(); // unfortunately i could'nt search for my dad

	useEffect(() => {
		if (!navigator.geolocation) {
			setState({ state: "error", error: "Geolocation is not supported by this browser." });
			return;
		}

		navigator.geolocation.getCurrentPosition(onCoords, onError);
		function onCoords({ coords: { latitude, longitude } }: GeolocationPosition) {
			setCoords({ latitude: latitude, longitude: longitude });
		}

		function onError(error: GeolocationPositionError) {
			switch (error.code) {
				case error.PERMISSION_DENIED:
					setState({ state: "error", error: "Permission has been denied" });
					break;
				case error.POSITION_UNAVAILABLE:
					setState({ state: "error", error: "Position is unavalable" });
					break;
				case error.TIMEOUT:
					setState({ state: "error", error: "Timeed out while getting location" });
					break;
				default:
					setState({ state: "error", error: "Unknown Error. Code: " + error.code });
					break;
			}
		}
	}, []);

	useEffect(() => {
		if (state.state !== "error" && coords) {
			fetch(`${apiEndpoint}/nearby-busstops?lat=${coords.latitude}&lon=${coords.longitude}`)
				.then((req) => req.json())
				.then((data) => {
					const list: React.JSX.Element[] = [];
					data.forEach((busStop: busStop) => {
						const busStopDiv = <BusStopElement busStop={busStop} />;
						list.push(busStopDiv);
					});
					setChildren(list);
					setState({ state: "loaded", error: "" });
				})
				.catch((err) => {
					setState({ state: "error", error: err.message });
				});
		}
	}, [coords]);

	const isLoading = state.state == "loading";
	const isError = state.state == "error";
	var fallbackText = null;
	if (isLoading) {
		fallbackText = "Loading..";
	} else if (isError) {
		fallbackText = "An error occured, " + state.error;
	}

	return (
		<div className="w-[500px]">
			{isLoading || isError ? (
				fallbackText
			) : (
				<div className="p-5">
					<div>
						<label htmlFor="search">Search</label>
						<br />
						<input
							name="search"
							type="text"
							placeholder="Bus Stop code or name"
							className="text-black"
							onInput={(e) => {
								const q = (e.target as HTMLInputElement).value;
								if (q == "") return setSearchChildren(undefined);

								fetch(`${apiEndpoint}/search-busstops?q=${encodeURI(q)}`)
									.then((req) => req.json())
									.then((data) => {
										const list: React.JSX.Element[] = [];
										data.forEach((busStop: busStop) => {
											const busStopDiv = <BusStopElement busStop={busStop} />;
											list.push(busStopDiv);
										});
										setSearchChildren(list);
									});
							}}
						/>
					</div>
					<span>Key:</span>
					<div>
						<span className="font-bold">
							2<sup>nd</sup>
						</span>
						<span>
							: 2<sup>nd</sup> Visit
						</span>
					</div>
					<div>
						<span className="font-bold">Dbl</span>
						<span>: Double Decker</span>
					</div>
					<div>
						<span
							className="material-icons"
							style={{ fontSize: "0.875rem", lineHeight: "1.25rem" }}>
							{"\uf0fe"}
						</span>
						<span>: Not wheelchair accessable</span>
					</div>
					{searchChildren || children}
				</div>
			)}
		</div>
	);
}

function BusStopElement({ busStop }: { busStop: busStop }) {
	const [isCollapsed, setCollapsedState] = useState(true);
	const [elementChildren, setElementChildren] = useState<React.JSX.Element[]>([]);

	function timeLeft(EstimatedArrival: string) {
		const estArrTime = new Date(EstimatedArrival).getTime();
		const timeNow = new Date().getTime();
		const msTimeLeft = estArrTime - timeNow;
		const minTimeLeft = Math.floor(msTimeLeft / 60000);

		if (minTimeLeft < 2) {
			return "Arr";
		} else if (Number.isNaN(minTimeLeft)) {
			return "~";
		}
		return minTimeLeft;
	}

	function NextBusSection({ nextBus }: { nextBus: nextBus }) {
		if (nextBus.EstimatedArrival == "")
			return (
				<td className="text-center">
					<div className="flex flex-col">
						<span>~</span>
					</div>
				</td>
			);
		const estarr = new Date(nextBus.EstimatedArrival);
		var textColor = "";
		var footerTexts = [];
		switch (nextBus.Load) {
			case "SEA":
				textColor = "text-green-400";
				break;
			case "SDA":
				textColor = "text-yellow-600";
				break;
			case "LSD":
				textColor = "text-red-600";
				break;
		}
		if (nextBus.VisitNumber == "2") {
			footerTexts.push(
				<span className="font-bold">
					2<sup>nd</sup>
				</span>
			);
		}
		if (nextBus.Type != "DD") {
			footerTexts.push(<span className="font-bold">Dbl</span>);
		}
		if (nextBus.Feature != "WAB") {
			footerTexts.push(
				<span
					className="material-icons"
					style={{ fontSize: "0.875rem", lineHeight: "1.25rem" }}>
					{"\uf0fe"}
				</span>
			);
		}

		return (
			<td className="text-center">
				<div className="flex flex-col">
					<span className={textColor}>{timeLeft(nextBus.EstimatedArrival)}</span>
					<span className="text-sm">
						{estarr.getHours()}:
						{estarr.getMinutes().toString().length == 1
							? estarr.getMinutes().toString() + "0"
							: estarr.getMinutes()}
					</span>
					<span className="text-sm space-x-2 text-gray-600 ">{footerTexts}</span>
				</div>
			</td>
		);
	}
	function populateTable() {
		setCollapsedState(!isCollapsed);
		if (!isCollapsed) return;

		fetch(`${apiEndpoint}/bus-arrival?BusStopCode=${busStop.BusStopCode}`)
			.then((req) => req.json())
			.then((Services: services) => {
				const table: React.JSX.Element[] = [];
				Services.forEach((service) => {
					const row = (
						<tr>
							<th className="text-left">{service.ServiceNo}</th>
							<NextBusSection nextBus={service.NextBus} />
							<NextBusSection nextBus={service.NextBus2} />
							<NextBusSection nextBus={service.NextBus3} />
						</tr>
					);
					table.push(row);
				});

				setElementChildren(table);
			});
	}

	return (
		<div
			key={busStop.BusStopCode}
			className="p-2 border-b-gray-500 border-b-2">
			<div
				className="flex flex-col m-2 cursor-pointer"
				onClick={populateTable}>
				<span>
					<span className="material-icons">{isCollapsed ? "\ue5df" : "\ue5c5"}</span>
					{busStop.Description}
				</span>
				<span className="text-gray-600 text-sm">{`${busStop.RoadName} (${busStop.BusStopCode})`}</span>
			</div>
			<div style={{ display: isCollapsed ? "none" : "" }}>
				<table className="w-full">
					<tbody>{elementChildren}</tbody>
				</table>
			</div>
		</div>
	);
}
