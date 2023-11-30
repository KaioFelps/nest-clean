import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { MakeQuestionFactory } from "test/factories/make-question";
import { MakeQuestionCommentFactory } from "test/factories/make-question-comment";
import { MakeStudentFactory } from "test/factories/make-student";

describe("Fetch question comments (E2E)", () => {
  let app: INestApplication;
  let jwt: JwtService;
  let studentFactory: MakeStudentFactory;
  let questionFactory: MakeQuestionFactory;
  let commentFactory: MakeQuestionCommentFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        MakeStudentFactory,
        MakeQuestionFactory,
        MakeQuestionCommentFactory,
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    jwt = moduleRef.get(JwtService);
    studentFactory = moduleRef.get(MakeStudentFactory);
    questionFactory = moduleRef.get(MakeQuestionFactory);
    commentFactory = moduleRef.get(MakeQuestionCommentFactory);

    await app.init();
  });

  test("[GET] /questions/comments/:questionId/", async () => {
    const user = await studentFactory.createAndPersist();

    const question = await questionFactory.createAndPersist({
      authorId: user.id,
    });

    await Promise.all([
      commentFactory.createAndPersist({
        authorId: user.id,
        questionId: question.id,
        content: "boa pergunta",
      }),

      commentFactory.createAndPersist({
        authorId: user.id,
        questionId: question.id,
        content: "estou tendo o mesmo problema",
      }),

      commentFactory.createAndPersist({
        authorId: user.id,
        questionId: question.id,
        content: "bem feito",
      }),
    ]);

    const accessToken = await jwt.signAsync({ sub: user.id.toString() });

    const response = await request(app.getHttpServer())
      .get(`/questions/comments/${question.id.toString()}`)
      .set({ Authorization: `Bearer ${accessToken}` });

    expect(response.statusCode).toBe(200);
    expect(response.body.comments.length).toBe(3);
    expect(response.body.comments).toEqual(
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
