import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { MakeQuestionFactory } from "test/factories/make-question";
import { MakeStudentFactory } from "test/factories/make-student";

describe("Answer question (E2E)", () => {
  let app: INestApplication;
  let jwt: JwtService;
  let prisma: PrismaService;
  let studentFactory: MakeStudentFactory;
  let questionFactory: MakeQuestionFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [MakeStudentFactory, MakeQuestionFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    jwt = moduleRef.get(JwtService);
    prisma = moduleRef.get(PrismaService);
    studentFactory = moduleRef.get(MakeStudentFactory);
    questionFactory = moduleRef.get(MakeQuestionFactory);

    await app.init();
  });

  test("[POST] /questions/:questionId/comment", async () => {
    const user = await studentFactory.createAndPersist();

    const question = await questionFactory.createAndPersist({
      authorId: user.id,
    });

    const accessToken = jwt.sign({ sub: user.id.toString() });

    const response = await request(app.getHttpServer())
      .post(`/questions/${question.id.toString()}/comment`)
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        content: "Boa pergunta",
      });

    const answersOfQuestionOnDB = await prisma.comment.findMany({
      where: {
        questionId: question.id.toString(),
      },
    });

    expect(response.statusCode).toBe(201);
    expect(answersOfQuestionOnDB.length).toBe(1);
    expect(answersOfQuestionOnDB[0]).toEqual(
      expect.objectContaining({
        content: "Boa pergunta",
      }),
    );
  });
});
