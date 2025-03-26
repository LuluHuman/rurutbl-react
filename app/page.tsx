import Client from "./components/client/client";
import Root from "./components/root";
export const dynamic = "force-dynamic"; // defaults to auto
import "./globals.css";
export default async function Home() {
	return (
		<Root className="flex items-center flex-wrap justify-center flex-col">
			<Client />
		</Root>
	);
}
