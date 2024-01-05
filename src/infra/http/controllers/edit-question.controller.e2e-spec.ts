import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { MakeAttachmentFactory } from "test/factories/make-attachment";
import { MakeQuestionFactory } from "test/factories/make-question";
import { MakeQuestionAttachmentFactory } from "test/factories/make-question-attachment";
import { MakeStudentFactory } from "test/factories/make-student";

describe("Edit question (E2E)", () => {
  let app: INestApplication;
  let jwt: JwtService;
  let prisma: PrismaService;
  let studentFactory: MakeStudentFactory;
  let questionFactory: MakeQuestionFactory;
  let attachmentFactory: MakeAttachmentFactory;
  let questionAttachmentFactory: MakeQuestionAttachmentFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        MakeStudentFactory,
        MakeQuestionFactory,
        MakeAttachmentFactory,
        MakeQuestionAttachmentFactory,
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    jwt = moduleRef.get(JwtService);
    prisma = moduleRef.get(PrismaService);
    studentFactory = moduleRef.get(MakeStudentFactory);
    questionFactory = moduleRef.get(MakeQuestionFactory);
    attachmentFactory = moduleRef.get(MakeAttachmentFactory);
    questionAttachmentFactory = moduleRef.get(MakeQuestionAttachmentFactory);

    await app.init();
  });

  test("[PUT] /questions/edit/:id", async () => {
    const user = await studentFactory.createAndPersist();
    const accessToken = jwt.sign({ sub: user.id.toString() });

    const question = await questionFactory.createAndPersist({
      authorId: user.id,
    });

    const attachment1 = await attachmentFactory.createAndPersist();
    const attachment2 = await attachmentFactory.createAndPersist();

    await questionAttachmentFactory.createAndPersist({
      attachmentId: attachment1.id,
      questionId: question.id,
    });

    await questionAttachmentFactory.createAndPersist({
      attachmentId: attachment2.id,
      questionId: question.id,
    });

    const attachment3 = await attachmentFactory.createAndPersist();

    const response = await request(app.getHttpServer())
      .put(`/questions/edit/${question.id.toString()}`)
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        title: "Nova pergunta",
        content: "Novo conteúdo",
        attachments: [attachment1.id.toString(), attachment3.id.toString()],
      });

    const questionsOnDB = await prisma.question.findMany();
    const questionAttachmentsOnDB = await prisma.attachment.findMany({
      where: {
        questionId: questionsOnDB[0].id,
      },
    });

    expect(response.statusCode).toBe(204);

    expect(questionsOnDB[0]).toEqual(
      expect.objectContaining({
        title: "Nova pergunta",
        content: "Novo conteúdo",
      }),
    );

    expect(questionAttachmentsOnDB).toHaveLength(2);

    expect(questionAttachmentsOnDB).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: attachment1.id.toString(),
        }),
        expect.objectContaining({
          id: attachment3.id.toString(),
        }),
      ]),
    );
  });
});
