import { AppModule } from "@/app.module";
import { PrismaService } from "@/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { hash } from "bcryptjs";
import request from "supertest";

describe("Authenticate (E2E)", () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);

    await app.init();
  });

  test("[POST] /sessions", async () => {
    await prisma.user.create({
      data: {
        name: "Kaio Felipe",
        email: "kaiolacradorlacrademaispracaralho@lacre.karolconka",
        password: await hash(
          "kaioconkamamacitalacrantelacradora@2023atualizadosemanuncio",
          8,
        ),
      },
    });

    const response = await request(app.getHttpServer()).post("/sessions").send({
      email: "kaiolacradorlacrademaispracaralho@lacre.karolconka",
      password: "kaioconkamamacitalacrantelacradora@2023atualizadosemanuncio",
    });

    expect(response.statusCode).toBe(201);
    expect(response.body.access_token).toStrictEqual(expect.any(String));
  });
});
