import { Slug } from "@/domain/forum/enterprise/entities/value-objects/slug";
import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { MakeQuestionFactory } from "test/factories/make-question";
import { MakeStudentFactory } from "test/factories/make-student";

describe("Get question by slug (E2E)", () => {
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

  test("[GET] /questions/:slug", async () => {
    const user = await studentFactory.createAndPersist();

    const accessToken = await jwt.signAsync({ sub: user.id.toString() });

    await questionFactory.createAndPersist({
      authorId: user.id,
      title: "Sair do jogo",
      content: "Olá, bom dia!\n Quer sair do jogo?",
      slug: Slug.create("sair-do-jogo"),
    });

    const response = await request(app.getHttpServer())
      .get("/questions/sair-do-jogo")
      .set({ Authorization: `Bearer ${accessToken}` });

    expect(response.statusCode).toBe(200);
    expect(response.body.question).toEqual(
      expect.objectContaining({
        title: "Sair do jogo",
        content: "Olá, bom dia!\n Quer sair do jogo?",
      }),
    );
  });
});
