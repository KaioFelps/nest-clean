import { MakeQuestionFactory } from "test/factories/make-question";
import { FetchQuestionCommentService } from "./fetch-question-comments";
import { InMemoryQuestionCommentRepository } from "test/repositories/in-memory-question-comment-repository";
import { MakeQuestionCommentFactory } from "test/factories/make-question-comment";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { InMemoryQuestionRepository } from "test/repositories/in-memory-question-repository";
import { InMemoryQuestionAttachmentRepository } from "test/repositories/in-memory-question-attachment-repository";

let inMemoryQuestionAttachmentRepository: InMemoryQuestionAttachmentRepository;
let inMemoryQuestionRepository: InMemoryQuestionRepository;
let inMemoryQuestionCommentRepository: InMemoryQuestionCommentRepository;
let sut: FetchQuestionCommentService;

describe("Fetch question's comment service", () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentRepository =
      new InMemoryQuestionAttachmentRepository();

    inMemoryQuestionRepository = new InMemoryQuestionRepository(
      inMemoryQuestionAttachmentRepository,
    );

    inMemoryQuestionCommentRepository = new InMemoryQuestionCommentRepository();

    sut = new FetchQuestionCommentService(inMemoryQuestionCommentRepository);
  });

  test("if it's possible to get a paginated list of comments from a question", async () => {
    await inMemoryQuestionCommentRepository.create(
      MakeQuestionCommentFactory.execute({
        questionId: new UniqueEntityId("question-1"),
      }),
    );

    await inMemoryQuestionCommentRepository.create(
      MakeQuestionCommentFactory.execute({
        questionId: new UniqueEntityId("question-1"),
      }),
    );

    await inMemoryQuestionCommentRepository.create(
      MakeQuestionCommentFactory.execute({
        questionId: new UniqueEntityId("question-1"),
      }),
    );

    const response = await sut.execute({
      questionId: "question-1",
      page: 1,
    });

    expect(response.isRight()).toBe(true);
    expect(response.value?.questionComments).toHaveLength(3);
  });

  test("if comments are comming paginated", async () => {
    const question = MakeQuestionFactory.execute();
    await inMemoryQuestionRepository.create(question);

    for (let i = 1; i <= 22; i++) {
      await inMemoryQuestionCommentRepository.create(
        MakeQuestionCommentFactory.execute({ questionId: question.id }),
      );
    }

    let response = await sut.execute({
      questionId: question.id.toString(),
      page: 1,
    });

    expect(response.isRight()).toBe(true);
    expect(response.value?.questionComments).toHaveLength(20);

    response = await sut.execute({
      questionId: question.id.toString(),
      page: 2,
    });

    expect(response.isRight()).toBe(true);
    expect(response.value?.questionComments).toHaveLength(2);
  });
});
