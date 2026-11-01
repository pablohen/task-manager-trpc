export const en = {
	"app.name": "Task Manager",
	"app.description": "A small task manager built with Next.js and tRPC",
	"nav.home": "All tasks",
	"nav.newTask": "New task",
	"nav.language": "Change language",

	"search.label": "Search tasks",
	"search.clear": "Clear search",

	"list.title": "Tasks",
	"list.empty": "No tasks yet.",
	"list.createFirst": "Create your first task",
	"list.noMatches": "No tasks match “{search}”.",
	"list.loadMoreError": "Could not load more tasks.",
	"list.retry": "Try again",
	"list.end": "You’ve reached the end.",

	"task.edit": "Edit",
	"task.editLabel": "Edit “{title}”",
	"task.delete": "Delete",
	"task.deleteLabel": "Delete “{title}”",

	"delete.title": "Delete task",
	"delete.body": "“{title}” will be permanently removed.",
	"delete.confirm": "Delete",
	"delete.cancel": "Cancel",
	"delete.success": "Task deleted",
	"delete.error": "Could not delete the task",

	"form.newTitle": "New task",
	"form.editTitle": "Edit task",
	"form.title": "Title",
	"form.titlePlaceholder": "What needs to be done?",
	"form.description": "Description",
	"form.descriptionPlaceholder": "Optional details",
	"form.create": "Create task",
	"form.save": "Save changes",
	"form.cancel": "Cancel",
	"form.created": "Task created",
	"form.updated": "Task updated",
	"form.createError": "Could not create the task",
	"form.updateError": "Could not update the task",

	"validation.titleRequired": "Title is required",
	"validation.titleTooLong": "Title must be at most 120 characters",
	"validation.descriptionTooLong":
		"Description must be at most 1000 characters",

	"error.notFound": "Task not found",
	"error.generic": "Something went wrong. Please try again.",
	"error.title": "Something went wrong",
	"error.retry": "Try again",

	"notFound.title": "Not found",
	"notFound.body": "The page or task you’re looking for doesn’t exist.",
	"notFound.back": "Back to tasks",
} as const;

export type MessageId = keyof typeof en;
export type Messages = Record<MessageId, string>;
