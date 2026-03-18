import { randomUUID } from "node:crypto";

export interface AnswerProps {
	content: string;
	authorId: string;
	questionId: string;
}

export class Answer {
	public id: string; // Id unico da resposta
	public content: string; // O conteudo da resposta
	public authorId: string; // O autor da resposta
	public questionId: string; // A questão que esta sendo respondida

	constructor(props: AnswerProps, id?: string) {
		this.id = id ?? randomUUID();
		this.content = props.content;
		this.authorId = props.authorId;
		this.questionId = props.questionId;
	}
}
