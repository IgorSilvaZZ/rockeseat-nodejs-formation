import type { Answer } from "@/domain/entities/answer";
import type { AnswersRepository } from "@/domain/repositories/answers-repository";
import { AnswerQuestionUseCase } from "@/domain/useCases/answer-question";

const fakeAnswersRepository: AnswersRepository = {
	create: async (answer: Answer): Promise<void> => {
		return;
	},
};

test("Create an answer", async () => {
	const answerQuestion = new AnswerQuestionUseCase(fakeAnswersRepository);

	const answer = await answerQuestion.execute({
		instructorId: "1",
		questionId: "1",
		content: "Nova resposta",
	});

	expect(answer.content).toEqual("Nova resposta");
});
