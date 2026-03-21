import { Entity } from "../../core/entities/entity";
import type { Slug } from "./value-objects/slug";
import type { UniqueEntityId } from "./value-objects/unique-entity-id";

export interface QuestionProps {
	title: string; // Titulo da questão
	content: string; // Conteudo da questão
	slug: Slug; // Representação do titulo questão sem acentos e caracteres especias
	authorId: UniqueEntityId; // Autor da questão
	bestAnswerId?: string; // A melhor resposta para a questão
	createdAt: Date; // Data de criação
	updatedAt?: Date; // Data de atualização
}

export class Question extends Entity<QuestionProps> {}
