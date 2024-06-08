"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";

export function NavBar() {
	const pathname = usePathname();

	const [collapsed, setCollapsed] = useState(true);
	const buttons = {
		__Menu: ["", "="],
		"/": ["Main", "🕒"],
		"/full": ["Full Table", "📄"],
		__Seperator: [],
		"/settings": ["Settings", "⚙️"]
	};

	const links = [];
	for (const path in buttons) {
		const [label, icon] = buttons[path as keyof typeof buttons];

		const isSeperator = path == "__Seperator";
		const isMenu = path == "__Menu";
		const isActive = path == pathname;

		if (isMenu) {
			links.push(
				<li className={`p-2 rounded mb-3 sm:list-item hidden`}>
					<button onClick={() => setCollapsed(!collapsed)}>
						<span className="icon">{icon}</span>
						<span className={`label ${collapsed ? "hidden" : ""}`}>{label}</span>
					</button>
				</li>
			);
			continue;
		}
		if (isSeperator) {
			links.push(<li className={"border-t-gray-600 border-t-2 p-0"}></li>);
			continue;
		}
		links.push(
			<li className={isActive ? "active" : ""}>
				{isActive ? <span className="active"></span> : <></>}
				<Link href={path}>
					<span className="icon">{icon}</span>
					<span className={`label ${collapsed ? "sm:hidden " : ""}`}>{label}</span>
				</Link>
			</li>
		);
	}
	return <ul className="fixed">{links}</ul>;
}
