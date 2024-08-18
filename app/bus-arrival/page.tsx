import BusArrival from "./page-client";
export default function BusArrivalServer() {
	return <BusArrival google_api_key={process.env.google_api_key || ""} />;
}
