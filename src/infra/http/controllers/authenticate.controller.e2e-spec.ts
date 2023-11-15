import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { hash } from "bcryptjs";
import request from "supertest";
import { MakeStudentFactory } from "test/factories/make-student";

describe("Authenticate (E2E)", () => {
  let app: INestApplication;
  let studentFactory: MakeStudentFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [MakeStudentFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    studentFactory = moduleRef.get(MakeStudentFactory);

    await app.init();
  });

  test("[POST] /sessions", async () => {
    await studentFactory.createAndPersist({
      name: "Kaio Felipe",
      email: "kaiolacradorlacrademaispracaralho@lacre.karolconka",
      password: await hash(
        "kaioconkamamacitalacrantelacradora@2023atualizadosemanuncio",
        8,
      ),
    });

    const response = await request(app.getHttpServer()).post("/sessions").send({
      email: "kaiolacradorlacrademaispracaralho@lacre.karolconka",
      password: "kaioconkamamacitalacrantelacradora@2023atualizadosemanuncio",
    });

    expect(response.statusCode).toBe(201);
    expect(response.body.access_token).toStrictEqual(expect.any(String));
  });
});
