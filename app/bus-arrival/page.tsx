import BusArrival from "./page-client";
export default function BusArrivalServer({ google_api_key }: { google_api_key: string }) {
	return <BusArrival google_api_key={process.env.google_api_key || ""} />;
}
