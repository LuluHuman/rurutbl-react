import type { Metadata } from "next";
import "./globals.css";
import { headers } from 'next/headers';
import { NavBar } from "./components/navBar";

export const metadata: Metadata = {
	title: "RuruTBL",
	description: "RuruTBL - ihavenoideawhattoputhere",
};
interface layout {
	children: React.ReactNode;
}

export default function RootLayout({ children }: Readonly<layout>) {
	const headersList = headers();
	const domain = headersList.get('host') || "";
	const fullUrl = headersList.get('referer') || "";
	console.log(fullUrl.replace(domain, ""));
	return (
		<html lang="en">
			<head>
				<link
					rel="manifest"
					href="/manifest.json"
				/>
			</head>
			<body className="font-sans w-screen items-start bg-bg text-white">
				<NavBar />
				{children}
			</body>
		</html>
	);
}
