import { InMemoryQuestionRepository } from "test/repositories/in-memory-question-repository";
import { GetQuestionBySlugService } from "./get-question-by-slug";
import { MakeQuestionFactory } from "test/factories/make-question";
import { Slug } from "../../enterprise/entities/value-objects/slug";
import { InMemoryQuestionAttachmentRepository } from "test/repositories/in-memory-question-attachment-repository";
import { InMemoryStudentRepository } from "test/repositories/in-memory-student-repository";
import { InMemoryAttachmentRepository } from "test/repositories/in-memory-attachment-repository";
import { MakeStudentFactory } from "test/factories/make-student";
import { MakeAttachmentFactory } from "test/factories/make-attachment";
import { MakeQuestionAttachmentFactory } from "test/factories/make-question-attachment";

let inMemoryQuestionRepository: InMemoryQuestionRepository;
let inMemoryQuestionAttachmentRepository: InMemoryQuestionAttachmentRepository;
let inMemoryStudentRepository: InMemoryStudentRepository;
let inMemoryAttachmentRepository: InMemoryAttachmentRepository;

let sut: GetQuestionBySlugService;

describe("Get question by slug service", () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentRepository =
      new InMemoryQuestionAttachmentRepository();

    inMemoryStudentRepository = new InMemoryStudentRepository();

    inMemoryAttachmentRepository = new InMemoryAttachmentRepository();

    inMemoryQuestionRepository = new InMemoryQuestionRepository(
      inMemoryQuestionAttachmentRepository,
      inMemoryStudentRepository,
      inMemoryAttachmentRepository,
    );

    sut = new GetQuestionBySlugService(inMemoryQuestionRepository);
  });

  test("if it's possible to get a question by it's slug", async () => {
    const student = MakeStudentFactory.execute({ name: "John Doe" });
    inMemoryStudentRepository.items.push(student);

    const attachment = MakeAttachmentFactory.execute({
      title: "some attachment",
    });
    inMemoryAttachmentRepository.items.push(attachment);

    const newQuestion = MakeQuestionFactory.execute({
      slug: Slug.create("slug-de-teste"),
      authorId: student.id,
    });

    inMemoryQuestionAttachmentRepository.items.push(
      MakeQuestionAttachmentFactory.execute({
        attachmentId: attachment.id,
        questionId: newQuestion.id,
      }),
    );

    await inMemoryQuestionRepository.create(newQuestion);

    const response = await sut.execute({
      slug: "slug-de-teste",
    });

    expect(response.isRight()).toBe(true);

    expect(response.value).toMatchObject({
      question: expect.objectContaining({
        title: newQuestion.title,
        author: "John Doe",
        attachments: [
          expect.objectContaining({
            title: "some attachment",
          }),
        ],
      }),
    });
  });
});
