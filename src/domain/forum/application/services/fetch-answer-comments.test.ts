import { MakeAnswerFactory } from "test/factories/make-answer";
import { FetchAnswerCommentService } from "./fetch-answer-comments";
import { InMemoryAnswerCommentRepository } from "test/repositories/in-memory-answer-comment-repository";
import { MakeAnswerCommentFactory } from "test/factories/make-answer-comment";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { InMemoryAnswerRepository } from "test/repositories/in-memory-answer-repository";
import { InMemoryAnswerAttachmentRepository } from "test/repositories/in-memory-answer-attachment-repository";

let inMemoryAnswerAttachmentRepository: InMemoryAnswerAttachmentRepository;
let inMemoryAnswerRepository: InMemoryAnswerRepository;
let inMemoryAnswerCommentRepository: InMemoryAnswerCommentRepository;
let sut: FetchAnswerCommentService;

describe("Fetch answer's comment service", () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentRepository =
      new InMemoryAnswerAttachmentRepository();

    inMemoryAnswerRepository = new InMemoryAnswerRepository(
      inMemoryAnswerAttachmentRepository,
    );

    inMemoryAnswerCommentRepository = new InMemoryAnswerCommentRepository();

    sut = new FetchAnswerCommentService(inMemoryAnswerCommentRepository);
  });

  test("if it's possible to get a paginated list of comments from a answer", async () => {
    await inMemoryAnswerCommentRepository.create(
      MakeAnswerCommentFactory.execute({
        answerId: new UniqueEntityId("answer-1"),
      }),
    );

    await inMemoryAnswerCommentRepository.create(
      MakeAnswerCommentFactory.execute({
        answerId: new UniqueEntityId("answer-1"),
      }),
    );

    await inMemoryAnswerCommentRepository.create(
      MakeAnswerCommentFactory.execute({
        answerId: new UniqueEntityId("answer-1"),
      }),
    );

    const response = await sut.execute({
      answerId: "answer-1",
      page: 1,
    });

    expect(response.isRight()).toBe(true);
    expect(response.value?.answerComments).toHaveLength(3);
  });

  test("if comments are comming paginated", async () => {
    const answer = MakeAnswerFactory.execute();
    await inMemoryAnswerRepository.create(answer);

    for (let i = 1; i <= 22; i++) {
      await inMemoryAnswerCommentRepository.create(
        MakeAnswerCommentFactory.execute({ answerId: answer.id }),
      );
    }

    let response = await sut.execute({
      answerId: answer.id.toString(),
      page: 1,
    });

    expect(response.isRight()).toBe(true);
    expect(response.value?.answerComments).toHaveLength(20);

    response = await sut.execute({ answerId: answer.id.toString(), page: 2 });

    expect(response.isRight()).toBe(true);
    expect(response.value?.answerComments).toHaveLength(2);
  });
});
