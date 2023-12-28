import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { MakeQuestionFactory } from "test/factories/make-question";
import { MakeStudentFactory } from "test/factories/make-student";

describe("Post attachment (E2E)", () => {
  let app: INestApplication;
  let jwt: JwtService;
  let studentFactory: MakeStudentFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [MakeStudentFactory, MakeQuestionFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    jwt = moduleRef.get(JwtService);
    studentFactory = moduleRef.get(MakeStudentFactory);

    await app.init();
  });

  test(
    "[POST] /attachments",
    async () => {
      const user = await studentFactory.createAndPersist();

      const accessToken = await jwt.signAsync({ sub: user.id.toString() });

      const response = await request(app.getHttpServer())
        .post("/attachments")
        .set({ Authorization: `Bearer ${accessToken}` })
        .attach("file", "./test/e2e/sample-upload.png");

      expect(response.statusCode).toBe(201);
      expect(response.body).toEqual({
        attachmentId: expect.any(String),
      });
    },
    { timeout: 10000 },
  );
});
