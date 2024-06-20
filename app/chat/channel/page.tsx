"use client";

import { useEffect, useState } from "react";
import ChatView from "./chatView";
import SendButton from "./sendButton";

import { redirect, useSearchParams } from "next/navigation";
import { defaultSettings } from "@/app/lib/trackHelper";
import { Loading } from "@/app/components/Loading";


const apiEndpoint = "https://api.luluhoy.tech";
export default function Chat() {
	const query = useSearchParams();
	const _c = query.get("ctype");

	const [ctype, setCtype] = useState<string>();
	const [content, setContent] = useState<React.JSX.Element>();

	useEffect(() => {
		if (!_c) {
			redirect("/chat");
		} else if (ctype !== _c) {
			setCtype(_c);
		}
	}, [_c, ctype]);

	useEffect(() => {
		if (!ctype) return;

		const savedSettings = localStorage.getItem("settings") || JSON.stringify(defaultSettings); // Idk wtf am i doing but ig it should work
		if (!savedSettings) return;
		const settings: typeof defaultSettings = JSON.parse(savedSettings);

		var cid = ctype;
		switch (ctype) {
			case "public":
				cid = "public";
				break;
			case "class":
				cid = settings.class.level + settings.class.class;
				break;
			case "level":
				cid = "sec-" + settings.class.level;
				break;
		}

		setContent(
			<>
				<div className="w-full bg-secondary-color p-3">
					<span className="mx-2">#{cid}</span>
					<span className="flex items-center w-fit">
						<span className="material-icons">{"\uea4b"}</span>
						<span className="inline-block">Chat is experemental. Expect bugs</span>
					</span>
				</div>
				<div className="w-full h-full">
					<ChatView
						apiEndpoint={apiEndpoint}
						cid={cid}
					/>
					<SendButton
						apiEndpoint={apiEndpoint}
						cid={cid}
					/>
				</div>
			</>
		);
	}, [ctype, _c]);

	return (
		<div className="w-full h-full overflow-hidden bg-primary-color">
			{content || <Loading />}
		</div>
	);
}
