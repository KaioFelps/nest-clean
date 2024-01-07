import { InMemoryQuestionCommentRepository } from "test/repositories/in-memory-question-comment-repository";
import { DeleteQuestionCommentService } from "./delete-question-comment";
import { MakeQuestionCommentFactory } from "test/factories/make-question-comment";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { NotAllowedError } from "./errors/not-allowed-error";
import { InMemoryStudentRepository } from "test/repositories/in-memory-student-repository";

let inMemoryQuestionCommentRepository: InMemoryQuestionCommentRepository;
let inMemoryStudentRepository: InMemoryStudentRepository;
let sut: DeleteQuestionCommentService;

describe("Delete question comment service", () => {
  beforeEach(() => {
    inMemoryStudentRepository = new InMemoryStudentRepository();

    inMemoryQuestionCommentRepository = new InMemoryQuestionCommentRepository(
      inMemoryStudentRepository,
    );

    sut = new DeleteQuestionCommentService(inMemoryQuestionCommentRepository);
  });

  test("if it's possible to delete a question comment", async () => {
    const newQuestionComment = MakeQuestionCommentFactory.execute(
      {},
      new UniqueEntityId("question-comment-1"),
    );

    await inMemoryQuestionCommentRepository.create(newQuestionComment);

    await sut.execute({
      questionCommentId: "question-comment-1",
      authorId: newQuestionComment.authorId.toString(),
    });

    expect(inMemoryQuestionCommentRepository.items).toHaveLength(0);
  });

  test("if it's impossible to delete a question comment that doesn't belong to the user", async () => {
    const newQuestionComment = MakeQuestionCommentFactory.execute(
      {},
      new UniqueEntityId("question-comment-1"),
    );

    await inMemoryQuestionCommentRepository.create(newQuestionComment);

    const response = await sut.execute({
      questionCommentId: "question-comment-1",
      authorId: "not-the-author-id",
    });

    expect(response.isLeft()).toBe(true);
    expect(response.value).toBeInstanceOf(NotAllowedError);
  });
});
