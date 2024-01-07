import { InMemoryAnswerCommentRepository } from "test/repositories/in-memory-answer-comment-repository";
import { DeleteAnswerCommentService } from "./delete-answer-comment";
import { MakeAnswerCommentFactory } from "test/factories/make-answer-comment";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { NotAllowedError } from "./errors/not-allowed-error";
import { InMemoryStudentRepository } from "test/repositories/in-memory-student-repository";

let inMemoryStudentRepository: InMemoryStudentRepository;
let inMemoryAnswerCommentRepository: InMemoryAnswerCommentRepository;
let sut: DeleteAnswerCommentService;

describe("Delete answer comment service", () => {
  beforeEach(() => {
    inMemoryStudentRepository = new InMemoryStudentRepository();

    inMemoryAnswerCommentRepository = new InMemoryAnswerCommentRepository(
      inMemoryStudentRepository,
    );

    sut = new DeleteAnswerCommentService(inMemoryAnswerCommentRepository);
  });

  test("if it's possible to delete a answer comment", async () => {
    const newAnswerComment = MakeAnswerCommentFactory.execute(
      {},
      new UniqueEntityId("answer-comment-1"),
    );

    await inMemoryAnswerCommentRepository.create(newAnswerComment);

    await sut.execute({
      answerCommentId: "answer-comment-1",
      authorId: newAnswerComment.authorId.toString(),
    });

    expect(inMemoryAnswerCommentRepository.items).toHaveLength(0);
  });

  test("if it's impossible to delete a answer comment that doesn't belong to the user", async () => {
    const newAnswerComment = MakeAnswerCommentFactory.execute(
      {},
      new UniqueEntityId("answer-comment-1"),
    );

    await inMemoryAnswerCommentRepository.create(newAnswerComment);

    const result = await sut.execute({
      answerCommentId: "answer-comment-1",
      authorId: "not-the-author-id",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
