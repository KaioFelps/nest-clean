import { IQuestionRepository } from "@/domain/forum/application/repositories/question-repository";
import { AppModule } from "@/infra/app.module";
import { ICacheRepository } from "@/infra/cache/cache-repository";
import { CacheModule } from "@/infra/cache/cache.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { MakeAttachmentFactory } from "test/factories/make-attachment";
import { MakeQuestionFactory } from "test/factories/make-question";
import { MakeQuestionAttachmentFactory } from "test/factories/make-question-attachment";
import { MakeStudentFactory } from "test/factories/make-student";

describe("Prisma Questions Repository (E2E)", () => {
  let app: INestApplication;
  let studentFactory: MakeStudentFactory;
  let questionFactory: MakeQuestionFactory;
  let attachmentFactory: MakeAttachmentFactory;
  let questionAttachmentFactory: MakeQuestionAttachmentFactory;
  let cacheRepository: ICacheRepository;
  let questionRepository: IQuestionRepository;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule, CacheModule],
      providers: [
        MakeStudentFactory,
        MakeQuestionFactory,
        MakeAttachmentFactory,
        MakeQuestionAttachmentFactory,
      ],
    }).compile();

    app = moduleRef.createNestApplication();

    studentFactory = moduleRef.get(MakeStudentFactory);
    questionFactory = moduleRef.get(MakeQuestionFactory);
    attachmentFactory = moduleRef.get(MakeAttachmentFactory);
    questionAttachmentFactory = moduleRef.get(MakeQuestionAttachmentFactory);
    cacheRepository = moduleRef.get(ICacheRepository);
    questionRepository = moduleRef.get(IQuestionRepository);

    await app.init();
  });

  it("should cache question details", async () => {
    const user = await studentFactory.createAndPersist();

    const question = await questionFactory.createAndPersist({
      authorId: user.id,
    });

    const attachment = await attachmentFactory.createAndPersist();
    await questionAttachmentFactory.createAndPersist({
      attachmentId: attachment.id,
      questionId: question.id,
    });

    const slug = question.slug.value;

    const questionDetails =
      await questionRepository.findBySlugWithDetails(slug);

    const cachedQuestion = await cacheRepository.get(
      `question:${slug}:details`,
    );

    expect(cachedQuestion).toEqual(JSON.stringify(questionDetails));
  });

  it("should reset question details cache when saving the question", async () => {
    const user = await studentFactory.createAndPersist();

    const question = await questionFactory.createAndPersist({
      authorId: user.id,
    });

    const attachment = await attachmentFactory.createAndPersist();
    await questionAttachmentFactory.createAndPersist({
      attachmentId: attachment.id,
      questionId: question.id,
    });

    const slug = question.slug.value;

    await cacheRepository.set(
      `question:${slug}:details`,
      JSON.stringify({ empty: true }),
    );

    await questionRepository.save(question);

    const cachedQuestion = await cacheRepository.get(
      `question:${slug}:details`,
    );

    expect(cachedQuestion).toBeNull();
  });
});
