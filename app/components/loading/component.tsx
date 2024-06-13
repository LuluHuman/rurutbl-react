"use client"

import Image from "next/image";
import { useEffect, useState } from "react";

export function Loading() {
	const [timeout, setTimeouted] = useState(false);
	useEffect(() => {
        
		setTimeout(() => {
			setTimeouted(true);
		}, 10000);

	}, []);
	return (
		<div className="w-full h-dvh flex items-center flex-col justify-center">
			<Image
				src="/loading.gif"
				alt="loader"
				priority={false}
				width={64}
				height={64}
			/>
			<br />
			{timeout ? <span>This is taking longer then expected...</span> : ""}
		</div>
	);
}
