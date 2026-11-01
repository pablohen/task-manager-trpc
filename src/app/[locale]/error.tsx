"use client";

import { Alert, Button, Stack } from "@mantine/core";
import { useIntl } from "react-intl";

export default function ErrorPage({
	error,
	retry,
}: {
	error: unknown;
	retry: () => void;
}) {
	const intl = useIntl();

	return (
		<Stack align="flex-start">
			<Alert color="red" title={intl.formatMessage({ id: "error.title" })}>
				{error instanceof Error
					? error.message
					: intl.formatMessage({ id: "error.generic" })}
			</Alert>
			<Button variant="light" onClick={() => retry()}>
				{intl.formatMessage({ id: "error.retry" })}
			</Button>
		</Stack>
	);
}
