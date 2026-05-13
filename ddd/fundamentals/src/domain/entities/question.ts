import { Entity } from "../../core/entities/entity";
import type { Optional } from "../../core/types/optional";
import { Slug } from "./value-objects/slug";
import type { UniqueEntityId } from "./value-objects/unique-entity-id";

export interface QuestionProps {
	title: string; // Titulo da questão
	content: string; // Conteudo da questão
	slug: Slug; // Representação do titulo questão sem acentos e caracteres especias
	authorId: UniqueEntityId; // Autor da questão
	bestAnswerId?: UniqueEntityId; // A melhor resposta para a questão
	createdAt: Date; // Data de criação
	updatedAt?: Date; // Data de atualização
}

export class Question extends Entity<QuestionProps> {
	get title() {
		return this.props.title;
	}

	get content() {
		return this.props.content;
	}

	get slug() {
		return this.props.slug;
	}

	get authorId() {
		return this.props.authorId;
	}

	get bestAnswerId() {
		return this.props.bestAnswerId;
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

	set title(title: string) {
		this.props.title = title;

		this.props.slug = Slug.createFromText(title);

		this.touch();
	}

	set bestAnswerId(bestAnswerId: UniqueEntityId | undefined) {
		this.props.bestAnswerId = bestAnswerId;
	}

	static create(
		props: Optional<QuestionProps, "createdAt" | "slug">,
		id?: UniqueEntityId,
	): Question {
		const question = new Question(
			{
				...props,
				slug: props.slug ?? Slug.createFromText(props.title),
				createdAt: new Date(),
			},
			id,
		);

		return question;
	}
}
