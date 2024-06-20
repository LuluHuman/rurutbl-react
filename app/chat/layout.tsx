import { LayoutProps } from "@/.next/types/app/layout";
import ChannelsSelect from "./ChannelsSelect";

export default function ChatLayout({ children }: Readonly<LayoutProps>) {
	return (
		<div className="flex sm:h-dvh h-[92.5vh]">
			<ChannelsSelect />
			{children}
		</div>
	);
}
