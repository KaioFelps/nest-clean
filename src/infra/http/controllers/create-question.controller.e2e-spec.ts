import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { MakeStudentFactory } from "test/factories/make-student";

describe("Create question (E2E)", () => {
  let app: INestApplication;
  let jwt: JwtService;
  let prisma: PrismaService;
  let studentFactory: MakeStudentFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [MakeStudentFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    jwt = moduleRef.get(JwtService);
    prisma = moduleRef.get(PrismaService);
    studentFactory = moduleRef.get(MakeStudentFactory);

    await app.init();
  });

  test("[POST] /questions", async () => {
    const user = await studentFactory.createAndPersist();

    const accessToken = jwt.sign({ sub: user.id });

    const response = await request(app.getHttpServer())
      .post("/questions")
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        title: "Sair do jogo",
        content: "Olá, bom dia!\n Quer sair do jogo?",
      });

    const questionsOnDB = await prisma.question.findMany();

    expect(response.statusCode).toBe(201);
    expect(questionsOnDB.length).toBe(1);
    expect(questionsOnDB[0]).toEqual(
      expect.objectContaining({
        title: "Sair do jogo",
        content: "Olá, bom dia!\n Quer sair do jogo?",
      }),
    );
  });
});
