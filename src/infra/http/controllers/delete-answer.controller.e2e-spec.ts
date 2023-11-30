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

describe("Delete answer (E2E)", () => {
  let app: INestApplication;
  let jwt: JwtService;
  let prisma: PrismaService;
  let studentFactory: MakeStudentFactory;
  let answerFactory: MakeAnswerFactory;
  let questionFactory: MakeQuestionFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [MakeStudentFactory, MakeAnswerFactory, MakeQuestionFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    jwt = moduleRef.get(JwtService);
    prisma = moduleRef.get(PrismaService);
    studentFactory = moduleRef.get(MakeStudentFactory);
    answerFactory = moduleRef.get(MakeAnswerFactory);
    questionFactory = moduleRef.get(MakeQuestionFactory);

    await app.init();
  });

  test("[DELETE] /answers/delete/:id", async () => {
    const user = await studentFactory.createAndPersist();
    const accessToken = jwt.sign({ sub: user.id.toString() });

    const question = await questionFactory.createAndPersist({
      authorId: user.id,
    });

    const answer = await answerFactory.createAndPersist({
      authorId: user.id,
      questionId: question.id,
    });

    const response = await request(app.getHttpServer())
      .delete(`/answers/delete/${answer.id.toString()}`)
      .set({ Authorization: `Bearer ${accessToken}` })
      .send();

    const answersOnDB = await prisma.answer.findMany();

    expect(response.statusCode).toBe(204);

    expect(answersOnDB.length).toBe(0);
  });
});
