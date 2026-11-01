"use client";

import { NavigationProgress, nprogress } from "@mantine/nprogress";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

// The App Router has no navigation events, so start the bar when an internal
// link is clicked and finish it once the URL has changed.
export function RouteProgress() {
	const pathname = usePathname();
	const searchParams = useSearchParams();

	// biome-ignore lint/correctness/useExhaustiveDependencies: runs on URL change
	useEffect(() => {
		nprogress.complete();
	}, [pathname, searchParams]);

	useEffect(() => {
		const onClick = (event: MouseEvent) => {
			// Next's Link already called preventDefault by the time this runs, so
			// filter out what wouldn't be an in-app navigation instead.
			if (
				event.button !== 0 ||
				event.metaKey ||
				event.ctrlKey ||
				event.shiftKey ||
				event.altKey
			) {
				return;
			}
			const anchor = (event.target as Element).closest("a");
			if (
				!anchor ||
				anchor.target === "_blank" ||
				anchor.hasAttribute("download")
			) {
				return;
			}
			const url = new URL(anchor.href);
			const sameOrigin = url.origin === window.location.origin;
			const samePage =
				url.pathname === window.location.pathname &&
				url.search === window.location.search;
			if (sameOrigin && !samePage) nprogress.start();
		};
		document.addEventListener("click", onClick);
		return () => document.removeEventListener("click", onClick);
	}, []);

	return <NavigationProgress />;
}
