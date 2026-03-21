import { Entity } from "../../core/entities/entity";
import type { UniqueEntityId } from "./value-objects/unique-entity-id";

export interface AnswerProps {
	content: string; // O conteudo da resposta
	authorId: UniqueEntityId; // O autor da resposta
	questionId: UniqueEntityId; // A questão que esta sendo respondida
	createdAt: Date; // Data de criação
	updatedAt?: Date; // Data de atualização
}

export class Answer extends Entity<AnswerProps> {
	get content() {
		return this.props.content;
	}
}
