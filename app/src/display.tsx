"use client";
import { useEffect, useRef } from "react";

export default function ImageCanvas({
	imageUrl,
	x1,
	y1,
	x2,
	y2,
}: {
	imageUrl: string;
	x1: number;
	y1: number;
	x2: number;
	y2: number;
}) {
	const canvasRef = useRef<any>(null);

	useEffect(() => {
		const canvas = canvasRef?.current as any;
		if (!canvas) return;
		const context = canvas.getContext("2d");

		const image = new Image();
		image.src = imageUrl;

		image.onload = () => {
			// Set canvas size to match the image
			canvas.width = image.width;
			canvas.height = image.height;

			// Draw the image onto the canvas
			context.drawImage(image, 0, 0);

			// Draw the rectangle (box)
			context.strokeStyle = "red";
			context.lineWidth = 2;
			context.strokeRect(x1, y1, x2 - x1, y2 - y1);
		};
	}, [imageUrl, x1, y1, x2, y2]);

	return (
		<canvas
			ref={canvasRef}
			className="w-full"
			style={{ border: "1px solid black", display: "block", margin: "auto" }}
		/>
	);
}
