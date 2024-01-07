import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { MakeAttachmentFactory } from "test/factories/make-attachment";
import { MakeQuestionFactory } from "test/factories/make-question";
import { MakeStudentFactory } from "test/factories/make-student";

describe("Answer question (E2E)", () => {
  let app: INestApplication;
  let jwt: JwtService;
  let prisma: PrismaService;
  let studentFactory: MakeStudentFactory;
  let questionFactory: MakeQuestionFactory;
  let attachmentFactory: MakeAttachmentFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        MakeStudentFactory,
        MakeQuestionFactory,
        MakeAttachmentFactory,
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    jwt = moduleRef.get(JwtService);
    prisma = moduleRef.get(PrismaService);
    studentFactory = moduleRef.get(MakeStudentFactory);
    questionFactory = moduleRef.get(MakeQuestionFactory);
    attachmentFactory = moduleRef.get(MakeAttachmentFactory);

    await app.init();
  });

  test("[POST] /questions/:questionId/answer", async () => {
    const user1 = await studentFactory.createAndPersist();

    const question = await questionFactory.createAndPersist({
      authorId: user1.id,
    });

    const user2 = await studentFactory.createAndPersist();

    const attachment1 = await attachmentFactory.createAndPersist();
    const attachment2 = await attachmentFactory.createAndPersist();

    const accessToken = jwt.sign({ sub: user2.id.toString() });

    const response = await request(app.getHttpServer())
      .post(`/questions/${question.id.toString()}/answer`)
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        content:
          "Olá, já experimentou apagar a pasta node_modules e reinstalar as dependências?",
        attachments: [attachment1.id.toString(), attachment2.id.toString()],
      });

    const answersOfQuestionOnDB = await prisma.answer.findMany({
      where: {
        questionId: question.id.toString(),
      },
    });

    const answerAttachmentsOnDB = await prisma.attachment.findMany({
      where: {
        answerId: answersOfQuestionOnDB[0].id,
      },
    });

    expect(response.statusCode).toBe(201);

    expect(answersOfQuestionOnDB.length).toBe(1);

    expect(answersOfQuestionOnDB[0]).toEqual(
      expect.objectContaining({
        content:
          "Olá, já experimentou apagar a pasta node_modules e reinstalar as dependências?",
      }),
    );

    expect(answerAttachmentsOnDB).toHaveLength(2);
  });
});
