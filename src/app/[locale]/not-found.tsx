import { Stack, Text, Title } from "@mantine/core";
import { LinkButton } from "@/components/link-button";

export default function NotFound() {
	return (
		<Stack align="flex-start">
			<Title order={1}>Not found</Title>
			<Text c="dimmed">The page or task you're looking for doesn't exist.</Text>
			<LinkButton href="/" variant="light">
				Back to tasks
			</LinkButton>
		</Stack>
	);
}
