"use client";

import React, { useState, useEffect } from "react";
import { state, busStop, services, nextBus } from "../lib/types";
import "material-icons/iconfont/material-icons.css";
import { Loading } from "../components/Loading";
import { DirectionBusDouble, NotAccessible, VisitDouble } from "../components/icons";

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
					setState({ state: "error", error: "Timed out while getting location" });
					break;
				default:
					setState({ state: "error", error: "Unknown Error. Code: " + error.code });
					break;
			}
		}
	}, []);

	useEffect(() => {
		if (state.state !== "error" && coords) {
			fetch(`/api/nearby-busstops?lat=${coords.latitude}&lon=${coords.longitude}`)
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

							fetch(`/api/search-busstops?q=${encodeURI(q)}`)
								.then((req) => req.json())
								.then((data) => {
									const list: React.JSX.Element[] = [];
									data.forEach((busStop: busStop) => {
										const busStopDiv = <BusStopElement busStop={busStop} />;
										list.push(busStopDiv);
									});
									setSearchChildren(list);
								})
								.catch((err) => {
									console.log(err);
									setSearchChildren([
										<div>Error: Could not search for bus stops</div>,
									]);
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

		fetch(`/api/bus-arrival?BusStopCode=${busStop.BusStopCode}`)
			.then((req) => req.json())
			.then((Services: services) => {
				if (Services.length == 0) {
					setElementChildren([<span>{"Not In Operation. [ Services[] is empty]"}</span>]);
					return;
				}

				const list: React.JSX.Element[] = [];
				Services.forEach((service) => {
					const row = (
						<ul className="flex justify-between border-b border-gray-500">
							<li className="text-left px-[4px] py-[8px] w-11">
								{service.ServiceNo}
							</li>
							<NextBusSection nextBus={service.NextBus} />
							<NextBusSection nextBus={service.NextBus2} />
							<NextBusSection nextBus={service.NextBus3} />
						</ul>
					);
					list.push(row);
				});

				setElementChildren(list);
			})
			.catch((err) => {
				console.log(err);
				setElementChildren([<span>Server Error: Could not load bus arrival</span>]);
			});
	}

	function NextBusSection({ nextBus }: { nextBus: nextBus }) {
		const children = (() => {
			if (nextBus.EstimatedArrival == "") return <></>;

			const estArr = new Date(nextBus.EstimatedArrival);
			var borderColor = {
				SEA: "border-green-400",
				SDA: "border-yellow-600",
				LSD: "border-red-600",
				"": "",
			}[nextBus.Load]; //
			var icons = [];

			if (nextBus.VisitNumber == "2") {
				icons.push(<VisitDouble />);
			}
			if (nextBus.Type == "DD") {
				icons.push(<DirectionBusDouble />);
			}
			if (nextBus.Feature != "WAB") {
				icons.push(<NotAccessible />);
			}

			return (
				<div className={`bg-gray-600 border-l-2 ${borderColor} rounded-lg`}>
					<div className={" flex items-center justify-center"}>
						<span>{timeLeft(nextBus.EstimatedArrival)}</span>
						{icons}
					</div>
					<span className="text-sm">
						{estArr.getHours()}:
						{estArr.getMinutes().toString().length == 1
							? estArr.getMinutes().toString() + "0"
							: estArr.getMinutes()}
					</span>
				</div>
			);
		})();

		return (
			<li className="text-center py-[4px] px-[8px] ">
				<div className={`flex flex-col w-20`}>{children}</div>
			</li>
		);
	}

	return (
		<div
			key={busStop.BusStopCode}
			className="flex flex-wrap items-center p-3 border-b-gray-500 border-b-2 w-[99%] select-none">
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
				{elementChildren}
			</div>
		</div>
	);
}
