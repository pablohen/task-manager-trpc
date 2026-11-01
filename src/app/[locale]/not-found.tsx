import { Stack, Text, Title } from "@mantine/core";
import { LinkButton } from "@/components/link-button";
import { getIntl } from "@/i18n/server";

export default async function NotFound() {
	const intl = await getIntl();

	return (
		<Stack align="flex-start">
			<Title order={1}>{intl.formatMessage({ id: "notFound.title" })}</Title>
			<Text c="dimmed">{intl.formatMessage({ id: "notFound.body" })}</Text>
			<LinkButton href="/" variant="light">
				{intl.formatMessage({ id: "notFound.back" })}
			</LinkButton>
		</Stack>
	);
}
