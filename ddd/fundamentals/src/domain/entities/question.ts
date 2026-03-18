import { randomUUID } from "node:crypto";

export interface QuestionProps {
	title: string;
	content: string;
	authorId: string;
}

export class Question {
	public id: string; // Id unico da questão
	public title: string; // Titulo da questão
	public content: string; // Conteudo da questão
	public authorId: string; // Autor da questão

	constructor(props: QuestionProps, id?: string) {
		this.id = id ?? randomUUID();
		this.title = props.title;
		this.content = props.content;
		this.authorId = props.authorId;
	}
}
