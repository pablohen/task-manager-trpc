import {
	ActionIcon,
	Button,
	createTheme,
	type MantineColorsTuple,
	Textarea,
	TextInput,
} from "@mantine/core";

// Brand palette: hot pink accent, navy text and a
// deep blue → pink gradient.
const pink: MantineColorsTuple = [
	"#ffe5f0",
	"#ffcce0",
	"#ff99c2",
	"#ff66a3",
	"#ff3385",
	"#ff1a75",
	"#ff0066",
	"#e6005c",
	"#b80049",
	"#8a0037",
];

const navy: MantineColorsTuple = [
	"#e8eaf2",
	"#c9cee0",
	"#a3aaca",
	"#7b85b2",
	"#56629a",
	"#3a4780",
	"#263368",
	"#1a2550",
	"#0d1634",
	"#070c1f",
];

export const brandGradient =
	"linear-gradient(142deg, #001994 17%, #ff0066 83%)";

const sans =
	"var(--font-plex-sans), -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";

// Mobile first: comfortable touch targets everywhere, scaled up only where
// the extra room helps.
export const theme = createTheme({
	colors: { pink, navy },
	primaryColor: "pink",
	// Shade 6 (#ff0066) is under 4.5:1 against white text; 7 passes WCAG AA
	// for filled buttons while the brighter pink stays for accents.
	primaryShade: 7,
	black: navy[8],
	fontFamily: sans,
	fontFamilyMonospace: "var(--font-plex-mono), ui-monospace, monospace",
	defaultGradient: { from: "#001994", to: "#ff0066", deg: 142 },
	headings: {
		fontFamily: sans,
		fontWeight: "600",
		sizes: {
			// Large headings are light on the reference site.
			h1: {
				fontSize: "clamp(1.75rem, 1.25rem + 2.5vw, 2.25rem)",
				fontWeight: "400",
			},
		},
	},
	components: {
		// Pill buttons, as on the reference site.
		Button: Button.extend({ defaultProps: { size: "md", radius: "xl" } }),
		// ~44px, the usual minimum touch target.
		ActionIcon: ActionIcon.extend({ defaultProps: { size: "xl" } }),
		// 16px text keeps iOS Safari from zooming in when an input is focused.
		TextInput: TextInput.extend({ defaultProps: { size: "md" } }),
		Textarea: Textarea.extend({ defaultProps: { size: "md" } }),
	},
});
