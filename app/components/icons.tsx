import NotAccessibleIcon from "@mui/icons-material/NotAccessible";
export function VisitDouble() {
	return (
		<svg
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg">
			<g clip-path="url(#clip0_5_2)">
				<path
					d="M7 7H17V10L21 6L17 2V5H5V11H7V7ZM17 17H7V14L3 18L7 22V19H19V13H17V17Z"
					fill="#E8EAED"
				/>
				<path
					d="M11.3333 13.8H14V15H10V12.6C10 11.934 10.6 11.4 11.3333 11.4H12.6667V10.2H10V9H12.6667C13.4 9 14 9.534 14 10.2V11.4C14 12.066 13.4 12.6 12.6667 12.6H11.3333V13.8Z"
					fill="#E8EAED"
				/>
			</g>
			<defs>
				<clipPath id="clip0_5_2">
					<rect
						width="24"
						height="24"
						fill="white"
					/>
				</clipPath>
			</defs>
		</svg>
	);
}

export function DirectionBusDouble() {
	return (
		<svg
			width="24"
			height="24"
			viewBox="0 0 31 31"
			fill="none"
			xmlns="http://www.w3.org/2000/svg">
			<g clip-path="url(#clip0_3_21)">
				<path
					d="M8 23C8 23.88 8.39 24.67 9 25.22V27C9 27.55 9.45 28 10 28H11C11.55 28 12 27.55 12 27V26H20V27C20 27.55 20.45 28 21 28H22C22.55 28 23 27.55 23 27V25.22C23.61 24.67 24 23.88 24 23V13L16 13C13 13 8 13 8 13V23ZM11.5 24C10.67 24 10 23.33 10 22.5C10 21.67 10.67 21 11.5 21C12.33 21 13 21.67 13 22.5C13 23.33 12.33 24 11.5 24ZM20.5 24C19.67 24 19 23.33 19 22.5C19 21.67 19.67 21 20.5 21C21.33 21 22 21.67 22 22.5C22 23.33 21.33 24 20.5 24ZM22 18H10V13L13 13L16 13L22 13V18Z"
					fill="#E8EAED"
				/>
				<path
					d="M8 13H24L24 6C24 2.5 20.42 2 16 2C11.58 2 8 2.5 8 6V13ZM22 11H10V6H22V11Z"
					fill="#E8EAED"
				/>
			</g>
			<defs>
				<clipPath id="clip0_3_21">
					<rect
						width="31"
						height="31"
						fill="white"
					/>
				</clipPath>
			</defs>
		</svg>
	);
}

export function NotAccessible() {
	return (
		<span className="text-[0.875rem] leading-5">
			<NotAccessibleIcon />
		</span>
	);
}
