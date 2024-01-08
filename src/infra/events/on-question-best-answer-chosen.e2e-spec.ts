import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { MakeAnswerFactory } from "test/factories/make-answer";
import { MakeQuestionFactory } from "test/factories/make-question";
import { MakeStudentFactory } from "test/factories/make-student";
import { waitFor } from "test/util/wait-for";

describe("On question's best answer chosen (E2E)", () => {
  let app: INestApplication;
  let jwt: JwtService;
  let prisma: PrismaService;
  let studentFactory: MakeStudentFactory;
  let questionFactory: MakeQuestionFactory;
  let answerFactory: MakeAnswerFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [MakeStudentFactory, MakeAnswerFactory, MakeQuestionFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    jwt = moduleRef.get(JwtService);
    prisma = moduleRef.get(PrismaService);
    studentFactory = moduleRef.get(MakeStudentFactory);
    questionFactory = moduleRef.get(MakeQuestionFactory);
    answerFactory = moduleRef.get(MakeAnswerFactory);

    await app.init();
  });

  it("should send a notification to the answer's writter when it's answer is chosen as best answer for a question", async () => {
    const user1 = await studentFactory.createAndPersist();

    const user2 = await studentFactory.createAndPersist();
    const user1AccessToken = jwt.sign({ sub: user1.id.toString() });

    const question = await questionFactory.createAndPersist({
      authorId: user1.id,
    });

    const answer = await answerFactory.createAndPersist({
      authorId: user2.id,
      questionId: question.id,
    });

    await request(app.getHttpServer())
      .patch(`/answers/set-as-best/${answer.id.toString()}`)
      .set({ Authorization: `Bearer ${user1AccessToken}` })
      .send();

    await waitFor(async () => {
      const notificationOnDb = await prisma.notification.findFirst({
        where: {
          recipientId: user2.id.toString(),
        },
      });

      expect(notificationOnDb).not.toBeNull();
    });
  });
});
