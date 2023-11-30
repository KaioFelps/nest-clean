import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { MakeAnswerFactory } from "test/factories/make-answer";
import { MakeQuestionFactory } from "test/factories/make-question";
import { MakeStudentFactory } from "test/factories/make-student";

describe("Answer answer (E2E)", () => {
  let app: INestApplication;
  let jwt: JwtService;
  let prisma: PrismaService;
  let studentFactory: MakeStudentFactory;
  let answerFactory: MakeAnswerFactory;
  let questionFactory: MakeAnswerFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [MakeStudentFactory, MakeQuestionFactory, MakeAnswerFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    jwt = moduleRef.get(JwtService);
    prisma = moduleRef.get(PrismaService);
    studentFactory = moduleRef.get(MakeStudentFactory);
    answerFactory = moduleRef.get(MakeAnswerFactory);
    questionFactory = moduleRef.get(MakeQuestionFactory);

    await app.init();
  });

  test("[POST] /answers/:answerId/comment", async () => {
    const user = await studentFactory.createAndPersist();

    const question = await questionFactory.createAndPersist({
      authorId: user.id,
    });

    const answer = await answerFactory.createAndPersist({
      authorId: user.id,
      questionId: question.id,
    });

    const accessToken = jwt.sign({ sub: user.id.toString() });

    const response = await request(app.getHttpServer())
      .post(`/answers/${answer.id.toString()}/comment`)
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        content: "Boa resposta",
      });

    const answersOfAnswerOnDB = await prisma.comment.findMany({
      where: {
        answerId: answer.id.toString(),
      },
    });

    expect(response.statusCode).toBe(201);
    expect(answersOfAnswerOnDB.length).toBe(1);
    expect(answersOfAnswerOnDB[0]).toEqual(
      expect.objectContaining({
        content: "Boa resposta",
      }),
    );
  });
});
