"use client";

import React, { useState, useEffect } from "react";
import { AdvancedMarker, APIProvider, Map, Marker } from "@vis.gl/react-google-maps";
import { state, busStop, services, nextBus } from "../lib/types";
import { Loading } from "../components/Loading";
import Root from "../components/root";

import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { DirectionBusDouble, NotAccessible, VisitDouble } from "../components/icons";
export default function BusArrival({ google_api_key }: { google_api_key: string }) {
	const [state, setState] = useState<state>({ state: "loading", error: null });
	const [coords, setCoords] = useState<{ latitude: number; longitude: number }>();
	const [children, setChildren] = useState<React.JSX.Element[]>();
	const [searchChildren, setSearchChildren] = useState<React.JSX.Element[]>();
	const [map, setMap] = useState<React.JSX.Element>(<>Loading Map</>);

	useEffect(() => {
		if (!navigator.geolocation) {
			setState({ state: "error", error: "Geolocation is not supported by this browser." });
			return;
		}

		const onCoords = ({ coords: { latitude, longitude } }: GeolocationPosition) =>
			setCoords({ latitude: latitude, longitude: longitude });
		navigator.geolocation.getCurrentPosition(onCoords, onError);

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
			const nearbyBusUrl = `/api/nearby-busstops?lat=${coords.latitude}&lon=${coords.longitude}`;
			const request = fetch(nearbyBusUrl).then((req) => req.json());
			request
				.then((data) => {
					const busStopsList = data.map((busStop: busStop) => (
						<BusStopElement
							busStop={busStop}
							key={busStop.BusStopCode}
						/>
					));

					const position = { lat: coords.latitude, lng: coords.longitude };
					setMap(
						<div className="h-72 w-full">
							<APIProvider apiKey={google_api_key}>
								<Map
									defaultCenter={position}
									defaultZoom={17}
									mapId={"Morethen1"}>
									{data.map((busStop: busStop) => {
										return (
											<AdvancedMarker
												position={{
													lat: busStop.Latitude,
													lng: busStop.Longitude,
												}}>
												<button
													className="bg-blue-500 text-white w-fit px-2"
													onClick={() =>
														console.log(busStop.Description)
													}>
													<h1 className="text-nowrap">
														{busStop.Description}
													</h1>
												</button>
											</AdvancedMarker>
										);
									})}
								</Map>
							</APIProvider>
						</div>
					);
					setChildren(busStopsList);
					setState({ state: "loaded", error: "" });
				})
				.catch((err: TypeError) => {
					console.log(err);
					const isNetworkError = err.message.includes("NetworkError");
					setState({
						state: "error",
						error: isNetworkError ? "Server can't be reached" : err.message,
					});
				});
		}
	}, [coords]);

	const isLoading = state.state == "loading";
	const isError = state.state == "error";
	var fallbackText = null;
	if (isLoading) fallbackText = <Loading />;
	else if (isError) fallbackText = "Error: " + state.error;

	function SearchForBus(e: React.FormEvent<HTMLInputElement>) {
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
				setSearchChildren([<div>Error: Could not search for bus stops</div>]);
			});
	}

	return (
		<Root className="w-full max-w-[640px] py-5">
			<div className="flex items-center flex-col">
				<label htmlFor="search">Search</label>
				<br />
				<input
					name="search"
					type="text"
					placeholder="Bus Stop code or name"
					className="text-black"
					onInput={SearchForBus}
				/>
			</div>
			{searchChildren ? (
				<span>Search Results</span>
			) : (
				<h1 className="text-3xl">Nearby Bus Stops</h1>
			)}
			{(isLoading || isError) && !searchChildren
				? fallbackText
				: searchChildren || (
						<>
							{map}
							{children}
						</>
				  )}
		</Root>
	);
}

function BusStopElement({ busStop }: { busStop: busStop }) {
	const [isCollapsed, setCollapsedState] = useState(true);
	const [elementChildren, setElementChildren] = useState<React.JSX.Element[]>(skeletonTable);

	return (
		<div
			key={busStop.BusStopCode}
			className="flex flex-wrap items-center p-3 border-b-gray-500 border-b-2 w-[99%] select-none">
			<span className={`transition ${isCollapsed ? "" : "rotate-90"}`}>
				<ArrowRightIcon />
			</span>
			<div
				className="flex flex-col m-2 cursor-pointer"
				style={{ width: "calc(100% - 3rem)" }}
				onClick={() =>
					populateTable(setCollapsedState, setElementChildren, isCollapsed, busStop)
				}>
				<span>{busStop.Description}</span>
				<span className="text-gray-600 text-sm">{`${busStop.RoadName} (${busStop.BusStopCode})`}</span>
			</div>
			<div className={`${isCollapsed ? "hidden" : "w-full max-w-[100vw]"}`}>
				{elementChildren}
			</div>
		</div>
	);
}

function skeletonTable() {
	return [1, 2, 3].map((i) => (
		<ul className="flex justify-between border-b border-gray-500">
			<li className="text-left px-[4px] py-[8px] w-11">___</li>
			{[1, 2, 3].map((_) => (
				<li className="text-center py-[4px] px-[8px] ">
					<div className="flex flex-col w-20">
						<div className="bg-gray-600 border-l-2 rounded-lg">
							<div className=" flex items-center justify-center">
								<span>__</span>
							</div>
							<span className="text-sm">__:__</span>
						</div>
					</div>
				</li>
			))}
		</ul>
	));
}

function populateTable(
	setCollapsedState: React.Dispatch<React.SetStateAction<boolean>>,
	setElementChildren: React.Dispatch<React.SetStateAction<React.JSX.Element[]>>,
	isCollapsed: boolean,
	busStop: busStop
) {
	setCollapsedState(!isCollapsed);
	if (!isCollapsed) return;

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
					<ul
						className="flex justify-between border-b border-gray-500"
						key={busStop.BusStopCode}>
						<li className="text-left px-[4px] py-[8px] w-11">{service.ServiceNo}</li>
						{[service.NextBus, service.NextBus2, service.NextBus3].map((x) => (
							<NextBusSection
								nextBus={x}
								key={`${busStop.BusStopCode}-${service.ServiceNo}`}
							/>
						))}
					</ul>
				);
				list.push(row);
			});

			setElementChildren(list);
		})
		.catch((err) =>
			setElementChildren([
				<span>
					Server Error: Could not load bus arrival
					<br />
					{err}
				</span>,
			])
		);
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
		}[nextBus.Load];

		var icons = [];
		if (nextBus.VisitNumber == "2") icons.push(<VisitDouble />);
		if (nextBus.Type == "DD") icons.push(<DirectionBusDouble />);
		if (nextBus.Feature != "WAB") icons.push(<NotAccessible />);

		const timeLeft = (EstimatedArrival: string) => {
			const estArrTime = new Date(EstimatedArrival).getTime();
			const timeNow = new Date().getTime();
			const msTimeLeft = estArrTime - timeNow;
			const minTimeLeft = Math.floor(msTimeLeft / 60000);

			if (minTimeLeft < 1) return "Arr";
			else if (Number.isNaN(minTimeLeft)) return "~";
			return minTimeLeft;
		};

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
		<li className="text-center py-[4px] px-[8px]">
			<div className={`flex flex-col w-20`}>{children}</div>
		</li>
	);
}
