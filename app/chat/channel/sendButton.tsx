"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface SendButton {
	apiEndpoint: string;
	cid: string;
}
export default function SendButton({ apiEndpoint, cid }: SendButton) {
	const [token, setToken] = useState<string>();
	const [loading, setLoading] = useState(true);

	const router = useRouter();
	useEffect(() => {
		const token = localStorage.getItem("token");
		if (!token) return router.push(apiEndpoint + "/oauth");

		const headers = new Headers();
		headers.append("Content-Type", "application/json");
		headers.append("Token", token || "");

		fetch(apiEndpoint + "/me", { headers: headers })
			.then((req) => {
				if (req.status == 400) return router.push(apiEndpoint + "/oauth");
				if (req.status == 401) return router.push(apiEndpoint + "/oauth");
				if (req.status == 500) return alert("Error while verifying user");
				req.json();
			})
			.then(() => {
				setToken(token);
				setLoading(false);
			})
			.catch((err) => {
				console.log(err);
				alert("Error while verifying user");
			});
	}, []);

	function handleSubmit(e: any) {
		e.preventDefault();
		const form = e.target;
		const formData = new FormData(form);
		const formJson = Object.fromEntries(formData.entries());

		const headers = new Headers();
		headers.append("Content-Type", "application/json");
		headers.append("Token", token || "");

		fetch(apiEndpoint + "/messages?cid=" + cid, {
			method: "POST",
			headers: headers,
			body: JSON.stringify(formJson),
		})
			.then((req) => {
				if (req.status !== 200) return alert("Error sending message");
				e.target.reset();
			})
			.catch((err) => {
				console.log(err);
				alert("Error sending message");
			});
	}

	return (
		<div className="relative bottom-0 w-full">
			{loading ? (
				<span>Log in to continue</span>
			) : (
				<form
					autoComplete="off"
					method="post"
					className="inline-flex items-center w-full"
					onSubmit={handleSubmit}>
					<input
						className="text-white h-10 m-2 p-2 bg-menu-color rounded-md"
						style={{ width: "calc(100% - 2.5rem)" }}
						placeholder={`Message #${cid}`}
						type="text"
						name="content"
					/>
					<button
						type="submit"
						className="material-icons p-2 m-2 bg-menu-color rounded-full">
						{"\ue163"}
					</button>
				</form>
			)}
		</div>
	);
}
