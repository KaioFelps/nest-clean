import { Slug } from "@/domain/forum/enterprise/entities/value-objects/slug";
import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { MakeQuestionFactory } from "test/factories/make-question";
import { MakeStudentFactory } from "test/factories/make-student";

describe("Fetch latest questions (E2E)", () => {
  let app: INestApplication;
  let jwt: JwtService;
  let studentFactory: MakeStudentFactory;
  let questionFactory: MakeQuestionFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [MakeStudentFactory, MakeQuestionFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    jwt = moduleRef.get(JwtService);
    studentFactory = moduleRef.get(MakeStudentFactory);
    questionFactory = moduleRef.get(MakeQuestionFactory);

    await app.init();
  });

  test("[GET] /questions", async () => {
    const user = await studentFactory.createAndPersist();

    await Promise.all([
      await questionFactory.createAndPersist({
        title: "Sair do jogo",
        content: "Olá, bom dia!\n Quer sair do jogo?",
        authorId: user.id,
        slug: Slug.createFromText("Sair do jogo"),
      }),

      await questionFactory.createAndPersist({
        title: "Por que o nordeste está sendo dominado pela juliete?",
        authorId: user.id,
      }),

      await questionFactory.createAndPersist({
        title: "como eu faço pra criar uma pergunta",
        authorId: user.id,
      }),
    ]);

    const accessToken = await jwt.signAsync({ sub: user.id.toString() });

    const response = await request(app.getHttpServer())
      .get("/questions")
      .set({ Authorization: `Bearer ${accessToken}` });

    expect(response.statusCode).toBe(200);
    expect(response.body.questions.length).toBe(3);
    expect(response.body.questions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          title: "Sair do jogo",
          content: "Olá, bom dia!\n Quer sair do jogo?",
        }),
        expect.objectContaining({
          title: "Por que o nordeste está sendo dominado pela juliete?",
        }),
        expect.objectContaining({
          title: "como eu faço pra criar uma pergunta",
        }),
      ]),
    );
  });
});
