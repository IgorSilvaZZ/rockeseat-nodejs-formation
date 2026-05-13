import { Entity } from "@/core/entities/entity";
import type { Optional } from "@/core/types/optional";
import type { UniqueEntityId } from "@/domain/entities/value-objects/unique-entity-id";

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

	get authorId() {
		return this.props.authorId;
	}

	get questionId() {
		return this.props.questionId;
	}

	get createdAt() {
		return this.props.createdAt;
	}

	get updatedAt() {
		return this.props.updatedAt;
	}

	get excerpt() {
		return this.content.substring(0, 120).trimEnd().concat("...");
	}

	private touch() {
		this.props.updatedAt = new Date();
	}

	set content(content: string) {
		this.props.content = content;

		this.touch();
	}

	static create(
		props: Optional<AnswerProps, "createdAt">,
		id?: UniqueEntityId,
	): Answer {
		const answer = new Answer(
			{
				...props,
				createdAt: new Date(),
			},
			id,
		);

		return answer;
	}
}
