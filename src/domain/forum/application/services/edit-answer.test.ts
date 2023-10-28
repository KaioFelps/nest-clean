import { InMemoryAnswerRepository } from "test/repositories/in-memory-answer-repository";
import { EditAnswerService } from "./edit-answer";
import { MakeAnswerFactory } from "test/factories/make-answer";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { NotAllowedError } from "./errors/not-allowed-error";
import { InMemoryAnswerAttachmentRepository } from "test/repositories/in-memory-answer-attachment-repository";
import { MakeAnswerAttachmentFactory } from "test/factories/make-answer-attachment";

let inMemoryAnswerAttachmentRepository: InMemoryAnswerAttachmentRepository;
let inMemoryAnswerRepository: InMemoryAnswerRepository;
let sut: EditAnswerService;

describe("Edit answer service", () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentRepository =
      new InMemoryAnswerAttachmentRepository();

    inMemoryAnswerRepository = new InMemoryAnswerRepository(
      inMemoryAnswerAttachmentRepository,
    );

    sut = new EditAnswerService(
      inMemoryAnswerRepository,
      inMemoryAnswerAttachmentRepository,
    );
  });

  test("if it's possible to edit a answer", async () => {
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
      authorId: newAnswer.authorId.toString(),
      answerId: newAnswer.id.toString(),
      content: "Conteúdo teste",
      attachmentIds: ["1", "2"],
    });

    expect(inMemoryAnswerRepository.items[0]).toMatchObject({
      content: "Conteúdo teste",
    });
  });

  test("if it's impossible to edit a answer that doesn't belong to the user", async () => {
    const newAnswer = MakeAnswerFactory.execute(
      {},
      new UniqueEntityId("answer-1"),
    );

    await inMemoryAnswerRepository.create(newAnswer);

    const response = await sut.execute({
      authorId: "wrong-author-id",
      answerId: newAnswer.id.toString(),
      content: "Conteúdo teste",
      attachmentIds: [],
    });

    expect(response.isLeft()).toBe(true);
    expect(response.value).toBeInstanceOf(NotAllowedError);
  });
});
