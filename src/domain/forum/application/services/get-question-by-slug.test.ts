import { InMemoryQuestionRepository } from "test/repositories/in-memory-question-repository";
import { GetQuestionBySlugService } from "./get-question-by-slug";
import { MakeQuestionFactory } from "test/factories/make-question";
import { Slug } from "../../enterprise/entities/value-objects/slug";
import { InMemoryQuestionAttachmentRepository } from "test/repositories/in-memory-question-attachment-repository";

let inMemoryQuestionRepository: InMemoryQuestionRepository;
let inMemoryQuestionAttachmentRepository: InMemoryQuestionAttachmentRepository;

let sut: GetQuestionBySlugService;

describe("Get question by slug service", () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentRepository =
      new InMemoryQuestionAttachmentRepository();
    inMemoryQuestionRepository = new InMemoryQuestionRepository(
      inMemoryQuestionAttachmentRepository,
    );
    sut = new GetQuestionBySlugService(inMemoryQuestionRepository);
  });

  test("if it's possible to get a question by it's slug", async () => {
    const newQuestion = MakeQuestionFactory.execute({
      slug: Slug.create("slug-de-teste"),
    });

    await inMemoryQuestionRepository.create(newQuestion);

    const response = await sut.execute({
      slug: "slug-de-teste",
    });

    expect(response.isRight()).toBe(true);

    if (response.isRight()) {
      expect(response.value.question).toEqual(newQuestion);
    }
  });
});
