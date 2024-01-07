import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { MakeAnswerFactory } from "test/factories/make-answer";
import { MakeAnswerCommentFactory } from "test/factories/make-answer-comment";
import { MakeQuestionFactory } from "test/factories/make-question";
import { MakeStudentFactory } from "test/factories/make-student";

describe("Fetch answer comments (E2E)", () => {
  let app: INestApplication;
  let jwt: JwtService;
  let studentFactory: MakeStudentFactory;
  let questionFactory: MakeQuestionFactory;
  let answerFactory: MakeAnswerFactory;
  let commentFactory: MakeAnswerCommentFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        MakeStudentFactory,
        MakeQuestionFactory,
        MakeAnswerCommentFactory,
        MakeAnswerFactory,
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    jwt = moduleRef.get(JwtService);
    studentFactory = moduleRef.get(MakeStudentFactory);
    questionFactory = moduleRef.get(MakeQuestionFactory);
    answerFactory = moduleRef.get(MakeAnswerFactory);
    commentFactory = moduleRef.get(MakeAnswerCommentFactory);

    await app.init();
  });

  test("[GET] /answers/comments/:answerId/", async () => {
    const user = await studentFactory.createAndPersist({ name: "John Doe" });

    const question = await questionFactory.createAndPersist({
      authorId: user.id,
    });

    const answer = await answerFactory.createAndPersist({
      authorId: user.id,
      questionId: question.id,
    });

    await Promise.all([
      commentFactory.createAndPersist({
        answerId: answer.id,
        authorId: user.id,
        content: "boa pergunta",
      }),

      commentFactory.createAndPersist({
        answerId: answer.id,
        authorId: user.id,
        content: "estou tendo o mesmo problema",
      }),

      commentFactory.createAndPersist({
        answerId: answer.id,
        authorId: user.id,
        content: "bem feito",
      }),
    ]);

    const accessToken = await jwt.signAsync({ sub: user.id.toString() });

    const response = await request(app.getHttpServer())
      .get(`/answers/comments/${answer.id.toString()}`)
      .set({ Authorization: `Bearer ${accessToken}` });

    expect(response.statusCode).toBe(200);

    expect(response.body.comments.length).toBe(3);

    expect(response.body.comments).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          content: "boa pergunta",
          authorName: "John Doe",
        }),
        expect.objectContaining({
          content: "estou tendo o mesmo problema",
          authorName: "John Doe",
        }),
        expect.objectContaining({
          content: "bem feito",
          authorName: "John Doe",
        }),
      ]),
    );
  });
});
