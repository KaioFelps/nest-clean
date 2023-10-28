import { InMemoryAnswerCommentRepository } from "test/repositories/in-memory-answer-comment-repository";
import { DeleteAnswerCommentService } from "./delete-answer-comment";
import { MakeAnswerCommentFactory } from "test/factories/make-answer-comment";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { NotAllowedError } from "./errors/not-allowed-error";

let inMemoryRepository: InMemoryAnswerCommentRepository;
let sut: DeleteAnswerCommentService;

describe("Delete answer comment service", () => {
  beforeEach(() => {
    inMemoryRepository = new InMemoryAnswerCommentRepository();
    sut = new DeleteAnswerCommentService(inMemoryRepository);
  });

  test("if it's possible to delete a answer comment", async () => {
    const newAnswerComment = MakeAnswerCommentFactory.execute(
      {},
      new UniqueEntityId("answer-comment-1"),
    );

    await inMemoryRepository.create(newAnswerComment);

    await sut.execute({
      answerCommentId: "answer-comment-1",
      authorId: newAnswerComment.authorId.toString(),
    });

    expect(inMemoryRepository.items).toHaveLength(0);
  });

  test("if it's impossible to delete a answer comment that doesn't belong to the user", async () => {
    const newAnswerComment = MakeAnswerCommentFactory.execute(
      {},
      new UniqueEntityId("answer-comment-1"),
    );

    await inMemoryRepository.create(newAnswerComment);

    const result = await sut.execute({
      answerCommentId: "answer-comment-1",
      authorId: "not-the-author-id",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
