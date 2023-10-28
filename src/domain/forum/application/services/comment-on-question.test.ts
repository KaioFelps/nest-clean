import { InMemoryQuestionRepository } from "test/repositories/in-memory-question-repository";
import { CommentOnQuestionService } from "./comment-on-question";
import { MakeQuestionFactory } from "test/factories/make-question";
import { InMemoryQuestionCommentRepository } from "test/repositories/in-memory-question-comment-repository";
import { InMemoryQuestionAttachmentRepository } from "test/repositories/in-memory-question-attachment-repository";

let inMemoryQuestionAttachmentRepository: InMemoryQuestionAttachmentRepository;
let inMemoryQuestionRepository: InMemoryQuestionRepository;
let inMemoryQuestionCommentRepository: InMemoryQuestionCommentRepository;
let sut: CommentOnQuestionService;

describe("Comment on question service", () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentRepository =
      new InMemoryQuestionAttachmentRepository();

    inMemoryQuestionRepository = new InMemoryQuestionRepository(
      inMemoryQuestionAttachmentRepository,
    );

    inMemoryQuestionCommentRepository = new InMemoryQuestionCommentRepository();

    sut = new CommentOnQuestionService(
      inMemoryQuestionRepository,
      inMemoryQuestionCommentRepository,
    );
  });

  test("if it's possible to comment on a question", async () => {
    const question = MakeQuestionFactory.execute();

    await inMemoryQuestionRepository.create(question);

    await sut.execute({
      questionId: question.id.toString(),
      authorId: question.authorId.toString(),
      content: "Comentário teste",
    });

    expect(inMemoryQuestionCommentRepository.items[0].content).toEqual(
      "Comentário teste",
    );
  });
});
