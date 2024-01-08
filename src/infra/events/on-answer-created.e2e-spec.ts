import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { MakeQuestionFactory } from "test/factories/make-question";
import { MakeStudentFactory } from "test/factories/make-student";
import { waitFor } from "test/util/wait-for";

describe("On answer created (E2E)", () => {
  let app: INestApplication;
  let jwt: JwtService;
  let studentFactory: MakeStudentFactory;
  let questionFactory: MakeQuestionFactory;
  let prisma: PrismaService;

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

  it("should send a notification to the question's author when an answer is created", async () => {
    const user1 = await studentFactory.createAndPersist();

    const question = await questionFactory.createAndPersist({
      authorId: user1.id,
    });

    const user2 = await studentFactory.createAndPersist();

    const accessToken = jwt.sign({ sub: user2.id.toString() });

    await request(app.getHttpServer())
      .post(`/questions/${question.id.toString()}/answer`)
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        content:
          "Olá, já experimentou apagar a pasta node_modules e reinstalar as dependências?",
        attachments: [],
      });

    await waitFor(async () => {
      const notificationOnDB = await prisma.notification.findFirst({
        where: {
          recipientId: user1.id.toString(),
        },
      });

      expect(notificationOnDB).not.toBeNull();
    });
  });
});
