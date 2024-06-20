"use client";
// cb stand for CALLBACK any sg curse word you're out

import { useSearchParams, redirect } from "next/navigation";
import { useEffect } from "react";
import { Loading } from "../components/Loading";
export default function Callback() {
	const search = useSearchParams();
	const token = search.get("token");
	if (!token) return redirect("/#Error");

	useEffect(() => {
		localStorage.setItem("token", token);
		redirect("/chat");
	}, []);

	return <Loading />;
}
