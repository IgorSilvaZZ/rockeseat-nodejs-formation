// Representa basicamente o instrutor respondendo uma pergunta especifica

import { Answer } from "../entities/answer";
import { UniqueEntityId } from "../entities/value-objects/unique-entity-id";
import type { AnswersRepository } from "../repositories/answers-repository";

interface AnswerQuestionUseCaseRequest {
	instructorId: string; // Instrutor que esta respondendo
	questionId: string; // Questão que esta sendo respondida
	content: string; // Conteudo da resposta
}

export class AnswerQuestionUseCase {
	constructor(private answersRepository: AnswersRepository) {}

	async execute({
		instructorId,
		questionId,
		content,
	}: AnswerQuestionUseCaseRequest) {
		const answer = Answer.create({
			content,
			authorId: new UniqueEntityId(instructorId),
			questionId: new UniqueEntityId(questionId),
		});

		await this.answersRepository.create(answer);

		return answer;
	}
}
