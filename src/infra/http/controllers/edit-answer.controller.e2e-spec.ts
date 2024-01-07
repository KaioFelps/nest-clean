import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { MakeAnswerFactory } from "test/factories/make-answer";
import { MakeAnswerAttachmentFactory } from "test/factories/make-answer-attachment";
import { MakeAttachmentFactory } from "test/factories/make-attachment";
import { MakeQuestionFactory } from "test/factories/make-question";
import { MakeStudentFactory } from "test/factories/make-student";

describe("Edit answer (E2E)", () => {
  let app: INestApplication;
  let jwt: JwtService;
  let prisma: PrismaService;
  let studentFactory: MakeStudentFactory;
  let questionFactory: MakeQuestionFactory;
  let answerFactory: MakeAnswerFactory;
  let attachmentFactory: MakeAttachmentFactory;
  let answerAttachmentFactory: MakeAnswerAttachmentFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        MakeStudentFactory,
        MakeAnswerFactory,
        MakeQuestionFactory,
        MakeAttachmentFactory,
        MakeAnswerAttachmentFactory,
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    jwt = moduleRef.get(JwtService);
    prisma = moduleRef.get(PrismaService);
    studentFactory = moduleRef.get(MakeStudentFactory);
    questionFactory = moduleRef.get(MakeQuestionFactory);
    answerFactory = moduleRef.get(MakeAnswerFactory);
    attachmentFactory = moduleRef.get(MakeAttachmentFactory);
    answerAttachmentFactory = moduleRef.get(MakeAnswerAttachmentFactory);

    await app.init();
  });

  test("[PUT] /answers/edit/:id", async () => {
    const user1 = await studentFactory.createAndPersist();
    const user2 = await studentFactory.createAndPersist();

    const question = await questionFactory.createAndPersist({
      authorId: user1.id,
    });

    const answer = await answerFactory.createAndPersist({
      authorId: user2.id,
      questionId: question.id,
    });

    const attachment1 = await attachmentFactory.createAndPersist();
    const attachment2 = await attachmentFactory.createAndPersist();

    await answerAttachmentFactory.createAndPersist({
      attachmentId: attachment1.id,
      answerId: answer.id,
    });

    await answerAttachmentFactory.createAndPersist({
      attachmentId: attachment2.id,
      answerId: answer.id,
    });

    const attachment3 = await attachmentFactory.createAndPersist();

    const accessToken = jwt.sign({ sub: user2.id.toString() });

    const response = await request(app.getHttpServer())
      .put(`/answers/edit/${answer.id.toString()}`)
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        content: "Novo conteúdo",
        attachments: [attachment1.id.toString(), attachment3.id.toString()],
      });

    const answerOnDB = await prisma.answer.findUnique({
      where: { id: answer.id.toString() },
    });

    const answerAttachmentsOnDB = await prisma.attachment.findMany({
      where: {
        answerId: answerOnDB?.id,
      },
    });

    expect(response.statusCode).toBe(204);

    expect(answerOnDB).toEqual(
      expect.objectContaining({
        content: "Novo conteúdo",
      }),
    );

    expect(answerAttachmentsOnDB).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: attachment1.id.toString() }),
        expect.objectContaining({ id: attachment3.id.toString() }),
      ]),
    );
  });
});
