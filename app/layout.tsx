import type { Metadata } from "next";
import "./globals.css";
import { NavBar } from "./components/navBar";

export const metadata: Metadata = {
	title: "RuruTBL",
	description: "RuruTBL - ihavenoideawhattoputhere",
};
interface layout {
	children: React.ReactNode;
}

export default function RootLayout({ children }: Readonly<layout>) {
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
