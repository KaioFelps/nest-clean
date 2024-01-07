import { MakeQuestionFactory } from "test/factories/make-question";
import { FetchQuestionCommentService } from "./fetch-question-comments";
import { InMemoryQuestionCommentRepository } from "test/repositories/in-memory-question-comment-repository";
import { MakeQuestionCommentFactory } from "test/factories/make-question-comment";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { InMemoryQuestionRepository } from "test/repositories/in-memory-question-repository";
import { InMemoryQuestionAttachmentRepository } from "test/repositories/in-memory-question-attachment-repository";
import { InMemoryStudentRepository } from "test/repositories/in-memory-student-repository";
import { MakeStudentFactory } from "test/factories/make-student";

let inMemoryQuestionAttachmentRepository: InMemoryQuestionAttachmentRepository;
let inMemoryQuestionRepository: InMemoryQuestionRepository;
let inMemoryQuestionCommentRepository: InMemoryQuestionCommentRepository;
let inMemoryStudentRepository: InMemoryStudentRepository;
let sut: FetchQuestionCommentService;

describe("Fetch question's comment service", () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentRepository =
      new InMemoryQuestionAttachmentRepository();

    inMemoryQuestionRepository = new InMemoryQuestionRepository(
      inMemoryQuestionAttachmentRepository,
    );

    inMemoryStudentRepository = new InMemoryStudentRepository();

    inMemoryQuestionCommentRepository = new InMemoryQuestionCommentRepository(
      inMemoryStudentRepository,
    );

    sut = new FetchQuestionCommentService(inMemoryQuestionCommentRepository);
  });

  test("if it's possible to get a paginated list of comments from a question", async () => {
    const author = MakeStudentFactory.execute({ name: "John Doe" });

    inMemoryStudentRepository.items.push(author);

    const comment1 = MakeQuestionCommentFactory.execute({
      questionId: new UniqueEntityId("question-1"),
      authorId: author.id,
    });
    await inMemoryQuestionCommentRepository.create(comment1);

    const comment2 = MakeQuestionCommentFactory.execute({
      questionId: new UniqueEntityId("question-1"),
      authorId: author.id,
    });
    await inMemoryQuestionCommentRepository.create(comment2);

    const comment3 = MakeQuestionCommentFactory.execute({
      questionId: new UniqueEntityId("question-1"),
      authorId: author.id,
    });
    await inMemoryQuestionCommentRepository.create(comment3);

    const response = await sut.execute({
      questionId: "question-1",
      page: 1,
    });

    expect(response.isRight()).toBe(true);

    expect(response.value?.comments).toHaveLength(3);

    expect(response.value?.comments).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          author: "John Doe",
          commentId: comment1.id,
        }),
        expect.objectContaining({
          author: "John Doe",
          commentId: comment2.id,
        }),
        expect.objectContaining({
          author: "John Doe",
          commentId: comment3.id,
        }),
      ]),
    );
  });

  test("if comments are comming paginated", async () => {
    const author = MakeStudentFactory.execute();

    inMemoryStudentRepository.items.push(author);

    const question = MakeQuestionFactory.execute();
    await inMemoryQuestionRepository.create(question);

    for (let i = 1; i <= 22; i++) {
      await inMemoryQuestionCommentRepository.create(
        MakeQuestionCommentFactory.execute({
          questionId: question.id,
          authorId: author.id,
        }),
      );
    }

    let response = await sut.execute({
      questionId: question.id.toString(),
      page: 1,
    });

    expect(response.isRight()).toBe(true);
    expect(response.value?.comments).toHaveLength(20);

    response = await sut.execute({
      questionId: question.id.toString(),
      page: 2,
    });

    expect(response.isRight()).toBe(true);
    expect(response.value?.comments).toHaveLength(2);
  });
});
