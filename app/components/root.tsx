import Image from "next/image";
import React from "react";
import { HTMLAttributes } from "react";
export default function Root({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: HTMLAttributes<HTMLDivElement>["className"];
}) {
	const _startTime = 1756483200000;
	const _endTime = 1759075200000;
	const _timeElapsed = new Date().getTime() - _startTime;
	const _duration = _endTime - _startTime;

	const percentage = _timeElapsed / _duration;

	return (
		<>
			<div
				className="fixed w-screen h-screen flex items-center justify-center"
				style={{
					opacity: percentage,
				}}>
				<div>
					<Image
						style={{ filter: `brightness(${percentage})` }}
						className="max-w-lg w-full"
						width={1535}
						height={863}
						src={"/closing.png"}
						alt="Closing Image - Mizuku"
					/>
					<h1 className="text-2xl text-center">Cya next time! </h1>
					<p>- Lulu 4B 2025</p>
					<p>
						<span>Source codes: </span>
						<a
							className="text-primary-color"
							href="https://github.com/LuluHuman/rurutbl-react">
							Webpage
						</a>
						{", "}
						<a
							className="text-primary-color"
							href="https://github.com/LuluHuman/rurutbl-scanner">
							Scanner
						</a>
					</p>
				</div>
			</div>
			<div
				id="root"
				className={
					`m-0 pl-0 pb-[100px] sm:pb-0 overflow-x-hidden flex-wrap ${
						percentage >= 1 && "hidden"
					} ` + className
				}
				style={{
					opacity: 1 - percentage,
				}}>
				{children}
			</div>
		</>
	);
}
