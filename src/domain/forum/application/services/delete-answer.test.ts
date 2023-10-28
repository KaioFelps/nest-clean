import { InMemoryAnswerRepository } from "test/repositories/in-memory-answer-repository";
import { DeleteAnswerService } from "./delete-answer";
import { MakeAnswerFactory } from "test/factories/make-answer";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { NotAllowedError } from "./errors/not-allowed-error";
import { MakeAnswerAttachmentFactory } from "test/factories/make-answer-attachment";
import { InMemoryAnswerAttachmentRepository } from "test/repositories/in-memory-answer-attachment-repository";

let inMemoryAnswerAttachmentRepository: InMemoryAnswerAttachmentRepository;
let inMemoryAnswerRepository: InMemoryAnswerRepository;
let sut: DeleteAnswerService;

describe("Delete answer service", () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentRepository =
      new InMemoryAnswerAttachmentRepository();
    inMemoryAnswerRepository = new InMemoryAnswerRepository(
      inMemoryAnswerAttachmentRepository,
    );
    sut = new DeleteAnswerService(inMemoryAnswerRepository);
  });

  test("if it's possible to delete a answer", async () => {
    const newAnswer = MakeAnswerFactory.execute(
      {},
      new UniqueEntityId("answer-1"),
    );

    await inMemoryAnswerRepository.create(newAnswer);

    inMemoryAnswerAttachmentRepository.items.push(
      MakeAnswerAttachmentFactory.execute({
        answerId: newAnswer.id,
        attachmentId: new UniqueEntityId("1"),
      }),
      MakeAnswerAttachmentFactory.execute({
        answerId: newAnswer.id,
        attachmentId: new UniqueEntityId("2"),
      }),
    );

    await sut.execute({
      answerId: "answer-1",
      authorId: newAnswer.authorId.toString(),
    });

    expect(inMemoryAnswerRepository.items).toHaveLength(0);
    expect(inMemoryAnswerAttachmentRepository.items).toHaveLength(0);
  });

  test("if it's impossible to delete a answer that doesn't belong to the user", async () => {
    const newAnswer = MakeAnswerFactory.execute(
      {},
      new UniqueEntityId("answer-1"),
    );

    await inMemoryAnswerRepository.create(newAnswer);

    const response = await sut.execute({
      answerId: "answer-1",
      authorId: "not-the-author-id",
    });

    expect(response.isLeft()).toBe(true);
    expect(response.value).toBeInstanceOf(NotAllowedError);
  });
});
