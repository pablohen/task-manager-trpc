import {
	ActionIcon,
	Button,
	createTheme,
	Textarea,
	TextInput,
} from "@mantine/core";

// Mobile first: comfortable touch targets everywhere, scaled up only where
// the extra room helps.
export const theme = createTheme({
	headings: {
		sizes: {
			h1: { fontSize: "clamp(1.75rem, 1.25rem + 2.5vw, 2.125rem)" },
		},
	},
	components: {
		Button: Button.extend({ defaultProps: { size: "md" } }),
		// ~44px, the usual minimum touch target.
		ActionIcon: ActionIcon.extend({ defaultProps: { size: "xl" } }),
		// 16px text keeps iOS Safari from zooming in when an input is focused.
		TextInput: TextInput.extend({ defaultProps: { size: "md" } }),
		Textarea: Textarea.extend({ defaultProps: { size: "md" } }),
	},
});
