import type { Task } from "./schema";

const titles = [
	"Set up the project board",
	"Draft the onboarding checklist",
	"Review the pull request for the login page",
	"Plan the team offsite agenda",
	"Update the API documentation",
	"Fix the flaky checkout test",
	"Prepare the sprint demo",
	"Order new office chairs",
	"Clean up unused feature flags",
	"Write the quarterly report",
	"Book the meeting room for Friday",
	"Migrate the cron jobs to the new scheduler",
	"Research accessibility testing tools",
	"Archive last year's design files",
	"Schedule one-on-ones for next week",
	"Refactor the pricing calculator",
	"Translate the help center articles",
	"Renew the domain certificate",
	"Collect feedback on the new dashboard",
	"Organize the shared drive",
	"Add dark mode to the settings page",
	"Benchmark the search endpoint",
	"Reply to the vendor proposal",
	"Write release notes for v2.3",
	"Water the office plants",
];

const HOUR = 60 * 60 * 1000;

// Fictional sample data, oldest first, one hour apart.
export function seedTasks(now = Date.now()): Task[] {
	return titles.map((title, i) => ({
		id: crypto.randomUUID(),
		title,
		description: i % 3 === 0 ? `Notes for "${title}".` : undefined,
		createdAt: new Date(now - (titles.length - i) * HOUR),
	}));
}
