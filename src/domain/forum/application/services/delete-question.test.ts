import { InMemoryQuestionRepository } from "test/repositories/in-memory-question-repository";
import { DeleteQuestionService } from "./delete-question";
import { MakeQuestionFactory } from "test/factories/make-question";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { NotAllowedError } from "./errors/not-allowed-error";
import { InMemoryQuestionAttachmentRepository } from "test/repositories/in-memory-question-attachment-repository";
import { MakeQuestionAttachmentFactory } from "test/factories/make-question-attachment";

let inMemoryQuestionRepository: InMemoryQuestionRepository;
let inMemoryQuestionAttachmentRepository: InMemoryQuestionAttachmentRepository;
let sut: DeleteQuestionService;

describe("Delete question service", () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentRepository =
      new InMemoryQuestionAttachmentRepository();
    inMemoryQuestionRepository = new InMemoryQuestionRepository(
      inMemoryQuestionAttachmentRepository,
    );
    sut = new DeleteQuestionService(inMemoryQuestionRepository);
  });

  test("if it's possible to delete a question", async () => {
    const newQuestion = MakeQuestionFactory.execute(
      {},
      new UniqueEntityId("question-1"),
    );

    await inMemoryQuestionRepository.create(newQuestion);

    inMemoryQuestionAttachmentRepository.items.push(
      MakeQuestionAttachmentFactory.execute({
        questionId: newQuestion.id,
        attachmentId: new UniqueEntityId("1"),
      }),
      MakeQuestionAttachmentFactory.execute({
        questionId: newQuestion.id,
        attachmentId: new UniqueEntityId("2"),
      }),
    );

    await sut.execute({
      questionId: "question-1",
      authorId: newQuestion.authorId.toString(),
    });

    expect(inMemoryQuestionRepository.items).toHaveLength(0);
    expect(inMemoryQuestionAttachmentRepository.items).toHaveLength(0);
  });

  test("if it's impossible to delete a question that doesn't belong to the user", async () => {
    const newQuestion = MakeQuestionFactory.execute(
      {},
      new UniqueEntityId("question-1"),
    );

    await inMemoryQuestionRepository.create(newQuestion);

    const response = await sut.execute({
      questionId: "question-1",
      authorId: "not-the-author-id",
    });

    expect(response.isLeft()).toBe(true);
    expect(response.value).toBeInstanceOf(NotAllowedError);
  });
});
