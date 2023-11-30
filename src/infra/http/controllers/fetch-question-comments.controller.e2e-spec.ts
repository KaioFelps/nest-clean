import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { MakeAnswerFactory } from "test/factories/make-answer";
import { MakeQuestionFactory } from "test/factories/make-question";
import { MakeStudentFactory } from "test/factories/make-student";

describe("Fetch questions answers (E2E)", () => {
  let app: INestApplication;
  let jwt: JwtService;
  let studentFactory: MakeStudentFactory;
  let questionFactory: MakeQuestionFactory;
  let answerFactory: MakeAnswerFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [MakeStudentFactory, MakeQuestionFactory, MakeAnswerFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    jwt = moduleRef.get(JwtService);
    studentFactory = moduleRef.get(MakeStudentFactory);
    questionFactory = moduleRef.get(MakeQuestionFactory);
    answerFactory = moduleRef.get(MakeAnswerFactory);

    await app.init();
  });

  test("[GET] /answers/:questionId/", async () => {
    const user = await studentFactory.createAndPersist();
    const question = await questionFactory.createAndPersist({
      authorId: user.id,
    });

    await Promise.all([
      answerFactory.createAndPersist({
        authorId: user.id,
        questionId: question.id,
        content: "boa pergunta",
      }),

      answerFactory.createAndPersist({
        authorId: user.id,
        questionId: question.id,
        content: "estou tendo o mesmo problema",
      }),

      answerFactory.createAndPersist({
        authorId: user.id,
        questionId: question.id,
        content: "bem feito",
      }),
    ]);

    const accessToken = await jwt.signAsync({ sub: user.id.toString() });

    const response = await request(app.getHttpServer())
      .get(`/answers/${question.id.toString()}`)
      .set({ Authorization: `Bearer ${accessToken}` });

    expect(response.statusCode).toBe(200);
    expect(response.body.answers.length).toBe(3);
    expect(response.body.answers).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          content: "boa pergunta",
        }),
        expect.objectContaining({
          content: "estou tendo o mesmo problema",
        }),
        expect.objectContaining({
          content: "bem feito",
        }),
      ]),
    );
  });
});
