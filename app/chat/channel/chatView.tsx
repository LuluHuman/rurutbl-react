"use client";

import io from "socket.io-client";
import { useState, useEffect } from "react";
import { Loading } from "@/app/components/Loading";

interface ChatView {
	apiEndpoint: string;
	cid: string;
}
export default function ChatView({ apiEndpoint, cid: _c }: ChatView) {
	const [messagesArr, setMessages] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const [creating, setCreating] = useState(false);
	const [cid, setCid] = useState<string>();

	useEffect(() => {
		if (cid !== _c) {
			setCid(_c);
		}
	}, [_c]);

	useEffect(() => {
		setLoading(true);
		const socket = io(apiEndpoint, { transports: ["websocket"] });
		if (!cid) return;
		fetch(apiEndpoint + "/messages?cid=" + cid)
			.then((data) => data.json())
			.then((data) => {
				if (data.error == `Channel<${cid}> does not exist` && !creating) {
					setCreating(true);
					fetch(apiEndpoint + "/channel?cid=" + cid, { method: "PUT" })
						.then((s) => {
							if (s.status != 201) return err(s);
							setTimeout(() => (window.location.href = window.location.href), 3000);
						})
						.catch((err) => err);

					return;
				}
				setLoading(false);
				setMessages(data as any[]);
			})
			.catch((err) => {
				console.log(err);
				setLoading(false);
				setMessages([
					{
						cleanContent: btoa(
							JSON.stringify({
								content: "Error: Unable to get messages",
								author: "API ERROR",
							})
						),
					},
				] as any[]);
			});

		const sid = "message-" + cid.toLowerCase();
		console.log("connecting to socket: " + sid);
		socket.on(sid, (data) => {
			setMessages((prevMessages) => [data, ...prevMessages]);
		});

		return () => {
			socket.off("message-" + cid);
		};

		function err(err: any) {
			console.log(err);
			setLoading(false);
			setMessages([
				{
					cleanContent: btoa(
						JSON.stringify({
							content: "Error: Unable to create channel",
							author: "API ERROR",
						})
					),
				},
			] as any[]);
		}
	}, [cid]);

	return loading ? (
		<Loading />
	) : (
		<div className="w-full h-[85%] flex flex-col-reverse overflow-y-scroll">
			{messagesArr?.reverse().map((discordMessage: any) => {
				var message = discordMessage;
				try {
					const bsf = Buffer.from(discordMessage.cleanContent, "base64").toString();
					message = JSON.parse(bsf);
				} catch (err) {
					message.author = `EXTERNAL MESSAGE (authorId: ${message.authorId})`;
				}
				return (
					<li
						className="m-4 list-none"
						key={discordMessage.id}>
						<div className="flex items-center select-none">
							<strong
								aria-selected={message.author || "Unknown"}
								className="overflow-hidden inline-block text-nowrap overflow-ellipsis mr-1"
								style={{ maxWidth: "calc(100% - 100px)" }}>
								{message.author || "Unknown"}
							</strong>
							<span className="text-gray-700 text-sm text-nowrap">
								{" " + formatDateTime(discordMessage.createdTimestamp)}
							</span>
						</div>
						<div>{message.content}</div>
					</li>
				);
			})}
			<ul className="w-full text-center border-b-2">Currently max 50 messages shown</ul>
		</div>
	);
}

function formatDateTime(timestamp: number) {
	if (!timestamp) return "";
	const date = new Date(timestamp);
	const now = new Date();

	const isToday =
		date.getDate() === now.getDate() &&
		date.getMonth() === now.getMonth() &&
		date.getFullYear() === now.getFullYear();

	const isYesterday = (() => {
		const yesterday = new Date();
		yesterday.setDate(yesterday.getDate() - 1);
		return (
			date.getDate() === yesterday.getDate() &&
			date.getMonth() === yesterday.getMonth() &&
			date.getFullYear() === yesterday.getFullYear()
		);
	})();

	const timeString = date.toLocaleTimeString([], {
		hour12: false,
		hour: "2-digit",
		minute: "2-digit",
	});

	if (isToday) {
		return `Today at ${timeString}`;
	} else if (isYesterday) {
		return `Yesterday at ${timeString}`;
	} else {
		const dateString = date.toLocaleDateString([], {
			year: "2-digit",
			month: "2-digit",
			day: "2-digit",
		});
		return `${dateString} ${timeString}`;
	}
}
