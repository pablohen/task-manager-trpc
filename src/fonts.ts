import { IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";

// Self-hosted by next/font, exposed as CSS variables for the Mantine theme.
export const plexSans = IBM_Plex_Sans({
	subsets: ["latin"],
	weight: ["400", "500", "600"],
	variable: "--font-plex-sans",
});

export const plexMono = IBM_Plex_Mono({
	subsets: ["latin"],
	weight: ["400"],
	variable: "--font-plex-mono",
});
