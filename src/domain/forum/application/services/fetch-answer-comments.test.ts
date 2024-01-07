import { MakeAnswerFactory } from "test/factories/make-answer";
import { FetchAnswerCommentService } from "./fetch-answer-comments";
import { InMemoryAnswerCommentRepository } from "test/repositories/in-memory-answer-comment-repository";
import { MakeAnswerCommentFactory } from "test/factories/make-answer-comment";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { InMemoryAnswerRepository } from "test/repositories/in-memory-answer-repository";
import { InMemoryAnswerAttachmentRepository } from "test/repositories/in-memory-answer-attachment-repository";
import { InMemoryStudentRepository } from "test/repositories/in-memory-student-repository";
import { MakeStudentFactory } from "test/factories/make-student";

let inMemoryAnswerAttachmentRepository: InMemoryAnswerAttachmentRepository;
let inMemoryAnswerRepository: InMemoryAnswerRepository;
let inMemoryAnswerCommentRepository: InMemoryAnswerCommentRepository;
let inMemoryStudentRepository: InMemoryStudentRepository;
let sut: FetchAnswerCommentService;

describe("Fetch answer's comment service", () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentRepository =
      new InMemoryAnswerAttachmentRepository();

    inMemoryAnswerRepository = new InMemoryAnswerRepository(
      inMemoryAnswerAttachmentRepository,
    );

    inMemoryStudentRepository = new InMemoryStudentRepository();

    inMemoryAnswerCommentRepository = new InMemoryAnswerCommentRepository(
      inMemoryStudentRepository,
    );

    sut = new FetchAnswerCommentService(inMemoryAnswerCommentRepository);
  });

  test("if it's possible to get a paginated list of comments from a answer", async () => {
    const student = MakeStudentFactory.execute({ name: "John Doe" });
    inMemoryStudentRepository.items.push(student);

    const comment1 = MakeAnswerCommentFactory.execute({
      answerId: new UniqueEntityId("answer-1"),
      authorId: student.id,
    });
    await inMemoryAnswerCommentRepository.create(comment1);

    const comment2 = MakeAnswerCommentFactory.execute({
      answerId: new UniqueEntityId("answer-1"),
      authorId: student.id,
    });
    await inMemoryAnswerCommentRepository.create(comment2);

    const comment3 = MakeAnswerCommentFactory.execute({
      answerId: new UniqueEntityId("answer-1"),
      authorId: student.id,
    });
    await inMemoryAnswerCommentRepository.create(comment3);

    const response = await sut.execute({
      answerId: "answer-1",
      page: 1,
    });

    expect(response.isRight()).toBe(true);

    expect(response.value?.comments).toHaveLength(3);

    expect(response.value?.comments).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          commentId: comment1.id,
          author: "John Doe",
        }),
        expect.objectContaining({
          commentId: comment2.id,
          author: "John Doe",
        }),
        expect.objectContaining({
          commentId: comment3.id,
          author: "John Doe",
        }),
      ]),
    );
  });

  test("if comments are comming paginated", async () => {
    const student = MakeStudentFactory.execute({ name: "John Doe" });
    inMemoryStudentRepository.items.push(student);

    const answer = MakeAnswerFactory.execute();
    await inMemoryAnswerRepository.create(answer);

    for (let i = 1; i <= 22; i++) {
      await inMemoryAnswerCommentRepository.create(
        MakeAnswerCommentFactory.execute({
          answerId: answer.id,
          authorId: student.id,
        }),
      );
    }

    let response = await sut.execute({
      answerId: answer.id.toString(),
      page: 1,
    });

    expect(response.isRight()).toBe(true);
    expect(response.value?.comments).toHaveLength(20);

    response = await sut.execute({ answerId: answer.id.toString(), page: 2 });

    expect(response.isRight()).toBe(true);
    expect(response.value?.comments).toHaveLength(2);
  });
});
