import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { MakeQuestionFactory } from "test/factories/make-question";
import { MakeQuestionCommentFactory } from "test/factories/make-question-comment";
import { MakeStudentFactory } from "test/factories/make-student";

describe("Delete question comment (E2E)", () => {
  let app: INestApplication;
  let jwt: JwtService;
  let prisma: PrismaService;
  let studentFactory: MakeStudentFactory;
  let commentFactory: MakeQuestionCommentFactory;
  let questionFactory: MakeQuestionFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        MakeStudentFactory,
        MakeQuestionCommentFactory,
        MakeQuestionFactory,
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    jwt = moduleRef.get(JwtService);
    prisma = moduleRef.get(PrismaService);
    studentFactory = moduleRef.get(MakeStudentFactory);
    questionFactory = moduleRef.get(MakeQuestionFactory);
    commentFactory = moduleRef.get(MakeQuestionCommentFactory);

    await app.init();
  });

  test("[DELETE] /question/comments/delete/:id", async () => {
    const user = await studentFactory.createAndPersist();
    const accessToken = jwt.sign({ sub: user.id.toString() });

    const question = await questionFactory.createAndPersist({
      authorId: user.id,
    });

    const comment = await commentFactory.createAndPersist({
      authorId: user.id,
      questionId: question.id,
    });

    const response = await request(app.getHttpServer())
      .delete(`/questions/comments/delete/${comment.id.toString()}`)
      .set({ Authorization: `Bearer ${accessToken}` })
      .send();

    const commentsOnDB = await prisma.comment.findMany();

    expect(response.statusCode).toBe(204);

    expect(commentsOnDB.length).toBe(0);
  });
});
