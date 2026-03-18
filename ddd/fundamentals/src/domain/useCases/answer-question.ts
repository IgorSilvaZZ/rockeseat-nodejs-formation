// Representa basicamente o instrutor respondendo uma pergunta especifica

import { Answer } from "../entities/answer";
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
		const answer = new Answer({
			content,
			authorId: instructorId,
			questionId,
		});

		await this.answersRepository.create(answer);

		return answer;
	}
}
