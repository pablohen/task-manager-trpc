import type { Messages } from "./en";

export const es: Messages = {
	"app.name": "Gestor de Tareas",
	"app.description": "Un pequeño gestor de tareas hecho con Next.js y tRPC",
	"nav.home": "Todas las tareas",
	"nav.newTask": "Nueva tarea",
	"nav.language": "Cambiar idioma",

	"search.label": "Buscar tareas",
	"search.clear": "Borrar búsqueda",

	"list.title": "Tareas",
	"list.empty": "Todavía no hay tareas.",
	"list.createFirst": "Crea tu primera tarea",
	"list.noMatches": "Ninguna tarea coincide con “{search}”.",
	"list.loadMoreError": "No se pudieron cargar más tareas.",
	"list.retry": "Reintentar",
	"list.end": "Has llegado al final.",

	"task.edit": "Editar",
	"task.editLabel": "Editar “{title}”",
	"task.delete": "Eliminar",
	"task.deleteLabel": "Eliminar “{title}”",

	"delete.title": "Eliminar tarea",
	"delete.body": "“{title}” se eliminará de forma permanente.",
	"delete.confirm": "Eliminar",
	"delete.cancel": "Cancelar",
	"delete.success": "Tarea eliminada",
	"delete.error": "No se pudo eliminar la tarea",

	"form.newTitle": "Nueva tarea",
	"form.editTitle": "Editar tarea",
	"form.title": "Título",
	"form.titlePlaceholder": "¿Qué hay que hacer?",
	"form.description": "Descripción",
	"form.descriptionPlaceholder": "Detalles opcionales",
	"form.create": "Crear tarea",
	"form.save": "Guardar cambios",
	"form.cancel": "Cancelar",
	"form.created": "Tarea creada",
	"form.updated": "Tarea actualizada",
	"form.createError": "No se pudo crear la tarea",
	"form.updateError": "No se pudo actualizar la tarea",

	"validation.titleRequired": "El título es obligatorio",
	"validation.titleTooLong": "El título debe tener como máximo 120 caracteres",
	"validation.descriptionTooLong":
		"La descripción debe tener como máximo 1000 caracteres",

	"error.notFound": "Tarea no encontrada",
	"error.generic": "Algo salió mal. Inténtalo de nuevo.",
	"error.title": "Algo salió mal",
	"error.retry": "Reintentar",

	"notFound.title": "No encontrado",
	"notFound.body": "La página o tarea que buscas no existe.",
	"notFound.back": "Volver a las tareas",
};
