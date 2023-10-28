import { InMemoryAnswerRepository } from "test/repositories/in-memory-answer-repository";
import { AnswerQuestionService } from "./answer-question";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { InMemoryAnswerAttachmentRepository } from "test/repositories/in-memory-answer-attachment-repository";

let inMemoryAnswerAttachmentRepository: InMemoryAnswerAttachmentRepository;
let inMemoryAnswerRepository: InMemoryAnswerRepository;
let sut: AnswerQuestionService;

describe("Create answer service", () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentRepository =
      new InMemoryAnswerAttachmentRepository();
    inMemoryAnswerRepository = new InMemoryAnswerRepository(
      inMemoryAnswerAttachmentRepository,
    );
    sut = new AnswerQuestionService(inMemoryAnswerRepository);
  });

  test("if it's possible to create an answer", async () => {
    const response = await sut.execute({
      questionId: "1",
      instructorId: "1",
      content: "Nova resposta",
      attachmentsIds: ["1", "2"],
    });

    expect(response.isRight()).toBe(true);
    expect(inMemoryAnswerRepository.items[0]).toEqual(response.value?.answer);
    expect(
      inMemoryAnswerRepository.items[0].attachments.currentItems,
    ).toHaveLength(2);
    expect(inMemoryAnswerRepository.items[0].attachments.getItems()).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityId("1") }),
      expect.objectContaining({ attachmentId: new UniqueEntityId("2") }),
    ]);
  });
});
