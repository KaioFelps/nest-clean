import { InMemoryQuestionRepository } from "test/repositories/in-memory-question-repository";
import { FetchLatestQuestionsService } from "./fetch-latest-questions";
import { MakeQuestionFactory } from "test/factories/make-question";
import { InMemoryQuestionAttachmentRepository } from "test/repositories/in-memory-question-attachment-repository";

let inMemoryQuestionAttachmentRepository: InMemoryQuestionAttachmentRepository;
let inMemoryQuestionRepository: InMemoryQuestionRepository;
let sut: FetchLatestQuestionsService;

describe("Fetch latest questions service", () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentRepository =
      new InMemoryQuestionAttachmentRepository();

    inMemoryQuestionRepository = new InMemoryQuestionRepository(
      inMemoryQuestionAttachmentRepository,
    );

    sut = new FetchLatestQuestionsService(inMemoryQuestionRepository);
  });

  test("if it's possible to get paginated list of latest questions", async () => {
    await inMemoryQuestionRepository.create(
      MakeQuestionFactory.execute({
        createdAt: new Date(2022, 0, 20),
      }),
    );

    await inMemoryQuestionRepository.create(
      MakeQuestionFactory.execute({
        createdAt: new Date(2022, 0, 18),
      }),
    );

    await inMemoryQuestionRepository.create(
      MakeQuestionFactory.execute({
        createdAt: new Date(2022, 0, 23),
      }),
    );

    const response = await sut.execute({
      page: 1,
    });

    expect(response.isRight()).toBe(true);
    expect(response.value?.questions).toEqual([
      expect.objectContaining({
        createdAt: new Date(2022, 0, 23),
      }),
      expect.objectContaining({
        createdAt: new Date(2022, 0, 20),
      }),
      expect.objectContaining({
        createdAt: new Date(2022, 0, 18),
      }),
    ]);
  });

  test("if latest questions are comming paginated", async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryQuestionRepository.create(MakeQuestionFactory.execute({}));
    }

    let response = await sut.execute({ page: 1 });

    expect(response.isRight()).toBe(true);
    expect(response.value?.questions).toHaveLength(20);

    response = await sut.execute({ page: 2 });

    expect(response.isRight()).toBe(true);
    expect(response.value?.questions).toHaveLength(2);
  });
});
