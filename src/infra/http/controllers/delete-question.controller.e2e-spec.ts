import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { MakeQuestionFactory } from "test/factories/make-question";
import { MakeStudentFactory } from "test/factories/make-student";

describe("Delete question (E2E)", () => {
  let app: INestApplication;
  let jwt: JwtService;
  let prisma: PrismaService;
  let studentFactory: MakeStudentFactory;
  let questionFactory: MakeQuestionFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [MakeStudentFactory, MakeQuestionFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    jwt = moduleRef.get(JwtService);
    prisma = moduleRef.get(PrismaService);
    studentFactory = moduleRef.get(MakeStudentFactory);
    questionFactory = moduleRef.get(MakeQuestionFactory);

    await app.init();
  });

  test("[DELETE] /questions/delete/:id", async () => {
    const user = await studentFactory.createAndPersist();
    const accessToken = jwt.sign({ sub: user.id.toString() });

    const question = await questionFactory.createAndPersist({
      authorId: user.id,
    });

    const response = await request(app.getHttpServer())
      .delete(`/questions/delete/${question.id.toString()}`)
      .set({ Authorization: `Bearer ${accessToken}` })
      .send();

    const questionsOnDB = await prisma.question.findMany();

    expect(response.statusCode).toBe(204);

    expect(questionsOnDB.length).toBe(0);
  });
});
