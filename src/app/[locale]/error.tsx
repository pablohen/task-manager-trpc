"use client";

import { Alert, Button, Stack } from "@mantine/core";

export default function ErrorPage({
	error,
	retry,
}: {
	error: unknown;
	retry: () => void;
}) {
	const message =
		error instanceof Error ? error.message : "Something went wrong.";

	return (
		<Stack align="flex-start">
			<Alert color="red" title="Something went wrong">
				{message}
			</Alert>
			<Button variant="light" onClick={() => retry()}>
				Try again
			</Button>
		</Stack>
	);
}
