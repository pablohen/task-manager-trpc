import type { Messages } from "./en";

export const pt: Messages = {
	"app.name": "Gerenciador de Tarefas",
	"app.description":
		"Um pequeno gerenciador de tarefas feito com Next.js e tRPC",
	"nav.home": "Todas as tarefas",
	"nav.newTask": "Nova tarefa",
	"nav.language": "Mudar idioma",

	"search.label": "Buscar tarefas",
	"search.clear": "Limpar busca",

	"list.title": "Tarefas",
	"list.empty": "Nenhuma tarefa ainda.",
	"list.createFirst": "Crie sua primeira tarefa",
	"list.noMatches": "Nenhuma tarefa corresponde a “{search}”.",
	"list.loadMoreError": "Não foi possível carregar mais tarefas.",
	"list.retry": "Tentar novamente",
	"list.end": "Você chegou ao fim.",

	"task.edit": "Editar",
	"task.editLabel": "Editar “{title}”",
	"task.delete": "Excluir",
	"task.deleteLabel": "Excluir “{title}”",

	"delete.title": "Excluir tarefa",
	"delete.body": "“{title}” será removida permanentemente.",
	"delete.confirm": "Excluir",
	"delete.cancel": "Cancelar",
	"delete.success": "Tarefa excluída",
	"delete.error": "Não foi possível excluir a tarefa",

	"form.newTitle": "Nova tarefa",
	"form.editTitle": "Editar tarefa",
	"form.title": "Título",
	"form.titlePlaceholder": "O que precisa ser feito?",
	"form.description": "Descrição",
	"form.descriptionPlaceholder": "Detalhes opcionais",
	"form.create": "Criar tarefa",
	"form.save": "Salvar alterações",
	"form.cancel": "Cancelar",
	"form.created": "Tarefa criada",
	"form.updated": "Tarefa atualizada",
	"form.createError": "Não foi possível criar a tarefa",
	"form.updateError": "Não foi possível atualizar a tarefa",

	"validation.titleRequired": "O título é obrigatório",
	"validation.titleTooLong": "O título deve ter no máximo 120 caracteres",
	"validation.descriptionTooLong":
		"A descrição deve ter no máximo 1000 caracteres",

	"error.notFound": "Tarefa não encontrada",
	"error.generic": "Algo deu errado. Tente novamente.",
	"error.title": "Algo deu errado",
	"error.retry": "Tentar novamente",

	"notFound.title": "Não encontrado",
	"notFound.body": "A página ou tarefa que você procura não existe.",
	"notFound.back": "Voltar para as tarefas",
};
