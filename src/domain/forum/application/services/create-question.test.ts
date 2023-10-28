import { InMemoryQuestionRepository } from "test/repositories/in-memory-question-repository";
import { CreateQuestionService } from "./create-question";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { InMemoryQuestionAttachmentRepository } from "test/repositories/in-memory-question-attachment-repository";

let inMemoryQuestionAttachmentRepository: InMemoryQuestionAttachmentRepository;

let inMemoryRepository: InMemoryQuestionRepository;
let sut: CreateQuestionService;

describe("Create question service", () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentRepository =
      new InMemoryQuestionAttachmentRepository();
    inMemoryRepository = new InMemoryQuestionRepository(
      inMemoryQuestionAttachmentRepository,
    );
    sut = new CreateQuestionService(inMemoryRepository);
  });

  test("if it's possible to create a question", async () => {
    const response = await sut.execute({
      authorId: "1",
      content: "Sample question content here",
      title: "Sample question title",
      attachmentsIds: ["1", "2"],
    });

    expect(response.isRight()).toBe(true);
    expect(inMemoryRepository.items[0].id).toEqual(response.value?.question.id);
    expect(inMemoryRepository.items[0].attachments.currentItems).toHaveLength(
      2,
    );
    expect(inMemoryRepository.items[0].attachments.getItems()).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityId("1") }),
      expect.objectContaining({ attachmentId: new UniqueEntityId("2") }),
    ]);
  });
});
