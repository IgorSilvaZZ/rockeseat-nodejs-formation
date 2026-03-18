import { randomUUID } from "node:crypto";

export class Student {
	public id: string; // Id unico do estudante
	public name: string; // Nome do estudante

	constructor(name: string, id?: string) {
		this.id = id ?? randomUUID();
		this.name = name;
	}
}
