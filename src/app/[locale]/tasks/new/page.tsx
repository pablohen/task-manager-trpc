import { Stack, Title } from "@mantine/core";
import type { Metadata } from "next";
import { PageBreadcrumbs } from "@/components/page-breadcrumbs";
import { TaskForm } from "@/components/task-form";
import { getIntl } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
	const intl = await getIntl();
	return { title: intl.formatMessage({ id: "form.newTitle" }) };
}

export default async function NewTaskPage() {
	const intl = await getIntl();
	const title = intl.formatMessage({ id: "form.newTitle" });

	return (
		<Stack>
			<PageBreadcrumbs
				items={[
					{ label: intl.formatMessage({ id: "list.title" }), href: "/" },
					{ label: title },
				]}
			/>
			<Title order={1}>{title}</Title>
			<TaskForm />
		</Stack>
	);
}
