import { Stack, Text, Title } from "@mantine/core";
import { LinkButton } from "@/components/link-button";

export default function NotFound() {
	return (
		<Stack align="flex-start">
			<Title order={1}>Not found</Title>
			<Text c="dimmed">This task doesn't exist or was deleted.</Text>
			<LinkButton href="/" variant="light">
				Back to tasks
			</LinkButton>
		</Stack>
	);
}
