import { InMemoryAnswerRepository } from "test/repositories/in-memory-answer-repository";
import { CommentOnAnswerService } from "./comment-on-answer";
import { MakeAnswerFactory } from "test/factories/make-answer";
import { InMemoryAnswerCommentRepository } from "test/repositories/in-memory-answer-comment-repository";
import { InMemoryAnswerAttachmentRepository } from "test/repositories/in-memory-answer-attachment-repository";

let inMemoryAnswerAttachmentRepository: InMemoryAnswerAttachmentRepository;
let inMemoryAnswerRepository: InMemoryAnswerRepository;
let inMemoryAnswerCommentRepository: InMemoryAnswerCommentRepository;
let sut: CommentOnAnswerService;

describe("Comment on answer service", () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentRepository =
      new InMemoryAnswerAttachmentRepository();

    inMemoryAnswerRepository = new InMemoryAnswerRepository(
      inMemoryAnswerAttachmentRepository,
    );

    inMemoryAnswerCommentRepository = new InMemoryAnswerCommentRepository();

    sut = new CommentOnAnswerService(
      inMemoryAnswerRepository,
      inMemoryAnswerCommentRepository,
    );
  });

  test("if it's possible to comment on a answer", async () => {
    const answer = MakeAnswerFactory.execute();

    await inMemoryAnswerRepository.create(answer);

    await sut.execute({
      answerId: answer.id.toString(),
      authorId: answer.authorId.toString(),
      content: "Comentário teste",
    });

    expect(inMemoryAnswerCommentRepository.items[0].content).toEqual(
      "Comentário teste",
    );
  });
});
