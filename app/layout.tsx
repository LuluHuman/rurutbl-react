import type { Metadata } from "next";
import "./globals.css";
import { NavBar } from "./components/navBar";
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
				<div id="root">
					<noscript>
						<div
							style={{
								textAlign: "center",
								color: "red",
								fontSize: "2rem",
								position: "fixed",
								top: "50vh",
								background:"white"
							}}>
							ah boy/girl/whatever, who teach you websites still can work without
							javascript
						</div>
					</noscript>
					{children}
				</div>
			</body>
		</html>
	);
}
