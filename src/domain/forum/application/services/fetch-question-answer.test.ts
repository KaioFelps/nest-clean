import { InMemoryQuestionRepository } from "test/repositories/in-memory-question-repository";
import { MakeQuestionFactory } from "test/factories/make-question";
import { InMemoryAnswerRepository } from "test/repositories/in-memory-answer-repository";
import { FetchQuestionAnswersService } from "./fetch-question-answers";
import { MakeAnswerFactory } from "test/factories/make-answer";
import { InMemoryQuestionAttachmentRepository } from "test/repositories/in-memory-question-attachment-repository";
import { InMemoryAnswerAttachmentRepository } from "test/repositories/in-memory-answer-attachment-repository";

let inMemoryAnswerAttachmentRepository: InMemoryAnswerAttachmentRepository;
let inMemoryQuestionAttachmentRepository: InMemoryQuestionAttachmentRepository;
let inMemoryQuestionRepository: InMemoryQuestionRepository;
let inMemoryAnswerRepository: InMemoryAnswerRepository;
let sut: FetchQuestionAnswersService;

describe("Fetch question's answers service", () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentRepository =
      new InMemoryAnswerAttachmentRepository();

    inMemoryQuestionAttachmentRepository =
      new InMemoryQuestionAttachmentRepository();

    inMemoryQuestionRepository = new InMemoryQuestionRepository(
      inMemoryQuestionAttachmentRepository,
    );

    inMemoryAnswerRepository = new InMemoryAnswerRepository(
      inMemoryAnswerAttachmentRepository,
    );

    sut = new FetchQuestionAnswersService(inMemoryAnswerRepository);
  });

  test("if it's possible to get paginated list of answers from a question", async () => {
    const question = MakeQuestionFactory.execute();
    await inMemoryQuestionRepository.create(question);

    await inMemoryAnswerRepository.create(
      MakeAnswerFactory.execute({
        questionId: question.id,
      }),
    );

    await inMemoryAnswerRepository.create(
      MakeAnswerFactory.execute({
        questionId: question.id,
      }),
    );

    await inMemoryAnswerRepository.create(MakeAnswerFactory.execute({}));

    const response = await sut.execute({
      page: 1,
      questionId: question.id.toString(),
    });

    expect(response.isRight()).toBe(true);
    expect(response.value?.answers).toHaveLength(2);
  });

  test("if answers are comming paginated", async () => {
    const question = MakeQuestionFactory.execute();
    await inMemoryQuestionRepository.create(question);

    for (let i = 1; i <= 22; i++) {
      await inMemoryAnswerRepository.create(
        MakeAnswerFactory.execute({ questionId: question.id }),
      );
    }

    let response = await sut.execute({
      questionId: question.id.toString(),
      page: 1,
    });

    expect(response.isRight()).toBe(true);
    expect(response.value?.answers).toHaveLength(20);

    response = await sut.execute({
      questionId: question.id.toString(),
      page: 2,
    });

    expect(response.isRight()).toBe(true);
    expect(response.value?.answers).toHaveLength(2);
  });
});
