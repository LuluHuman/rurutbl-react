"use client";

import React, { useState, useEffect, DOMElement } from "react";
import { state, busStop, services, nextBus } from "../lib/types";
import "material-icons/iconfont/material-icons.css";
import { Loading } from "../components/loading/component";

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
				.catch((err: TypeError) => {
					console.log(err);

					setState({
						state: "error",
						error: err.message.includes("NetworkError")
							? "Server can't be reached"
							: err.message,
					});
				});
		}
	}, [coords]);

	const isLoading = state.state == "loading";
	const isError = state.state == "error";
	var fallbackText = null;
	if (isLoading) {
		fallbackText = <Loading />;
	} else if (isError) {
		fallbackText = "Error: " + state.error;
	}

	return (
		<div className="w-full max-w-[640px] py-5">
			<div>
				<div className="flex items-center flex-col">
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
				{/*come on the poeple in my school are literally young if they dont undertand they are cooked*/}
				{searchChildren ? <span>Search Results</span> : <h1>Nearby Bus Stops</h1>}
				{(isLoading || isError) && !searchChildren
					? fallbackText
					: searchChildren || <>{children}</>}
			</div>
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

	function populateTable() {
		setCollapsedState(!isCollapsed);
		if (!isCollapsed) return; // if it has been set to colapsed

		fetch(`${apiEndpoint}/bus-arrival?BusStopCode=${busStop.BusStopCode}`)
			.then((req) => req.json())
			.then((Services: services) => {
				if (Services.length == 0) {
					setElementChildren([<span>{"Not In Operation. [ Services[] is empty]"}</span>]);
					return;
				}

				const table: React.JSX.Element[] = [];
				Services.forEach((service) => {
					const row = (
						<tr className="border-[1px] border-solid border-gray-300">
							<th className="text-left px-[4px] py-[8px]">{service.ServiceNo}</th>
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

	function NextBusSection({ nextBus }: { nextBus: nextBus }) {
		const children = (() => {
			if (nextBus.EstimatedArrival == "") return <span>~</span>;

			const estArr = new Date(nextBus.EstimatedArrival);
			var textColor = {
				SEA: "text-green-400",
				SDA: "text-yellow-600",
				LSD: "text-red-600",
				"": "",
			}[nextBus.Load]; //
			var footerTexts = [];

			if (nextBus.VisitNumber == "2") {
				footerTexts.push(
					<span className="font-bold">
						2<sup>nd</sup>
					</span>
				);
			}
			if (nextBus.Type == "DD") {
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
				<>
					<span className={textColor}>{timeLeft(nextBus.EstimatedArrival)}</span>
					<span className="text-sm">
						{estArr.getHours()}:
						{estArr.getMinutes().toString().length == 1
							? estArr.getMinutes().toString() + "0"
							: estArr.getMinutes()}
					</span>
					<span className="text-sm space-x-2 text-gray-600 ">{footerTexts}</span>
				</>
			);
		})();

		return (
			<td className="text-center py-[4px] px-[8px]">
				<div className="flex flex-col">{children}</div>
			</td>
		);
	}

	return (
		<div
			key={busStop.BusStopCode}
			className="flex flex-wrap items-center p-2 border-b-gray-500 border-b-2 min-w-max select-none">
			<span className={`material-icons transition ${isCollapsed ? "" : "rotate-90"}`}>
				{"\ue5df"}
			</span>
			<div
				className="flex flex-col m-2 cursor-pointer"
				style={{ width: "calc(100% - 3rem)" }}
				onClick={populateTable}>
				<span>{busStop.Description}</span>
				<span className="text-gray-600 text-sm">{`${busStop.RoadName} (${busStop.BusStopCode})`}</span>
			</div>
			<div className={`${isCollapsed ? "hidden" : "w-full max-w-[100vw]"}`}>
				<table className="w-full">
					<tbody>{elementChildren}</tbody>
				</table>
			</div>
		</div>
	);
}
