import React from "react";
import { HTMLAttributes } from "react";
export default function Root({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: HTMLAttributes<HTMLDivElement>["className"];
}) {
	return (
		<div
			id="root"
			className={"m-0 pl-0 sm:pl-20 pb-[100px] sm:pb-0 overflow-x-hidden flex-wrap " + className}>
			{children}
		</div>
	);
}