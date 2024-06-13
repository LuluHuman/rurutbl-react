import type { Metadata } from "next";
import "./globals.css";
import { NavBar } from "./components/navBar/component";
import "material-icons/iconfont/material-icons.css";

export const metadata: Metadata = {
	title: "RuruTBL",
	description: "RuruTBL - ihavenoideawhattobuthere",
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
			<body>
				<NavBar />
				<div id="root">{children}</div>
			</body>
		</html>
	);
}
