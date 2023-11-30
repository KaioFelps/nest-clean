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

describe("Choose question's best answer (E2E)", () => {
  let app: INestApplication;
  let jwt: JwtService;
  let prisma: PrismaService;
  let studentFactory: MakeStudentFactory;
  let questionFactory: MakeQuestionFactory;
  let answerFactory: MakeAnswerFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [MakeStudentFactory, MakeAnswerFactory, MakeQuestionFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    jwt = moduleRef.get(JwtService);
    prisma = moduleRef.get(PrismaService);
    studentFactory = moduleRef.get(MakeStudentFactory);
    questionFactory = moduleRef.get(MakeQuestionFactory);
    answerFactory = moduleRef.get(MakeAnswerFactory);

    await app.init();
  });

  test("[PATCH] /answers/set-as-best/:answerId", async () => {
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
      .patch(`/answers/set-as-best/${answer.id.toString()}`)
      .set({ Authorization: `Bearer ${accessToken}` });

    const questionOnDB = await prisma.question.findUnique({
      where: { id: question.id.toString() },
    });

    expect(response.statusCode).toBe(204);
    expect(questionOnDB?.bestAnswerId).toEqual(answer.id.toString());
  });
});
