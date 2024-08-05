import { Loading as LoadingComp } from "./components/Loading";
import Root from "./components/root";

export default function Loading() {
	return (
		<Root className="h-screen">
			<LoadingComp />
		</Root>
	);
}
