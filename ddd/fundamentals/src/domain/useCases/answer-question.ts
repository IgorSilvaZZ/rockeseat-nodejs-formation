// Representa basicamente o instrutor respondendo uma pergunta especifica

import { Answer } from "../entities/answer";

interface AnswerQuestionUseCaseRequest {
	instructorId: string; // Instrutor que esta respondendo
	questionId: string; // Questão que esta sendo respondida
	content: string; // Conteudo da resposta
}

export class AnswerQuestionUseCase {
	execute({ instructorId, questionId, content }: AnswerQuestionUseCaseRequest) {
		const answer = new Answer(content);

		return answer;
	}
}
