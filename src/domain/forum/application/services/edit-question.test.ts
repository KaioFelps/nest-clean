import { InMemoryQuestionRepository } from "test/repositories/in-memory-question-repository";
import { EditQuestionService } from "./edit-question";
import { MakeQuestionFactory } from "test/factories/make-question";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { NotAllowedError } from "./errors/not-allowed-error";
import { InMemoryQuestionAttachmentRepository } from "test/repositories/in-memory-question-attachment-repository";
import { MakeQuestionAttachmentFactory } from "test/factories/make-question-attachment";
import { QuestionAttachmentList } from "../../enterprise/entities/question-attachment-list";
import { InMemoryStudentRepository } from "test/repositories/in-memory-student-repository";
import { InMemoryAttachmentRepository } from "test/repositories/in-memory-attachment-repository";

let inMemoryQuestionAttachmentRepository: InMemoryQuestionAttachmentRepository;
let inMemoryStudentRepository: InMemoryStudentRepository;
let inMemoryAttachmentRepository: InMemoryAttachmentRepository;
let inMemoryQuestionRepository: InMemoryQuestionRepository;
let sut: EditQuestionService;

describe("Edit question service", () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentRepository =
      new InMemoryQuestionAttachmentRepository();

    inMemoryStudentRepository = new InMemoryStudentRepository();

    inMemoryAttachmentRepository = new InMemoryAttachmentRepository();

    inMemoryQuestionRepository = new InMemoryQuestionRepository(
      inMemoryQuestionAttachmentRepository,
      inMemoryStudentRepository,
      inMemoryAttachmentRepository,
    );

    sut = new EditQuestionService(
      inMemoryQuestionRepository,
      inMemoryQuestionAttachmentRepository,
    );
  });

  test("if it's possible to edit a question", async () => {
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
      authorId: newQuestion.authorId.toString(),
      questionId: newQuestion.id.toString(),
      title: "Pergunta teste",
      content: "Conteúdo teste",
      attachmentsIds: ["1", "3"],
    });

    expect(inMemoryQuestionRepository.items[0]).toMatchObject({
      title: "Pergunta teste",
      content: "Conteúdo teste",
    });
    expect(
      inMemoryQuestionRepository.items[0].attachments.getItems(),
    ).toHaveLength(2);
    expect(inMemoryQuestionRepository.items[0].attachments.getItems()).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityId("1") }),
      expect.objectContaining({ attachmentId: new UniqueEntityId("3") }),
    ]);
  });

  test("if it's impossible to edit a question that doesn't belong to the user", async () => {
    const newQuestion = MakeQuestionFactory.execute(
      {},
      new UniqueEntityId("question-1"),
    );

    await inMemoryQuestionRepository.create(newQuestion);

    const response = await sut.execute({
      authorId: "wrong-author-id",
      questionId: newQuestion.id.toString(),
      title: "Pergunta teste",
      content: "Conteúdo teste",
      attachmentsIds: [],
    });

    expect(response.isLeft()).toBe(true);
    expect(response.value).toBeInstanceOf(NotAllowedError);
  });

  test("if it updates and persists attachments changes on question edit", async () => {
    const newQuestion = MakeQuestionFactory.execute(
      {
        authorId: new UniqueEntityId("author-1"),
      },
      new UniqueEntityId("question-1"),
    );

    const newQuestionAttachments = [
      MakeQuestionAttachmentFactory.execute({
        questionId: newQuestion.id,
        attachmentId: new UniqueEntityId("1"),
      }),
      MakeQuestionAttachmentFactory.execute({
        questionId: newQuestion.id,
        attachmentId: new UniqueEntityId("2"),
      }),
    ];

    newQuestion.attachments = new QuestionAttachmentList(
      newQuestionAttachments,
    );

    await inMemoryQuestionRepository.create(newQuestion);

    const result = await sut.execute({
      questionId: newQuestion.id.toValue(),
      authorId: "author-1",
      title: "Pergunta teste",
      content: "Conteúdo teste",
      attachmentsIds: ["1", "3"],
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryQuestionAttachmentRepository.items).toHaveLength(2);
    expect(inMemoryQuestionAttachmentRepository.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          attachmentId: new UniqueEntityId("1"),
        }),
        expect.objectContaining({
          attachmentId: new UniqueEntityId("3"),
        }),
      ]),
    );
  });
});
