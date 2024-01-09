import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { MakeNotificationFactory } from "test/factories/make-notification";
import { MakeStudentFactory } from "test/factories/make-student";

describe("Read notification (E2E)", () => {
  let app: INestApplication;
  let jwt: JwtService;
  let studentFactory: MakeStudentFactory;
  let prisma: PrismaService;
  let notificationFactory: MakeNotificationFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [MakeStudentFactory, MakeNotificationFactory, PrismaService],
    }).compile();

    app = moduleRef.createNestApplication();

    jwt = moduleRef.get(JwtService);
    studentFactory = moduleRef.get(MakeStudentFactory);
    prisma = moduleRef.get(PrismaService);
    notificationFactory = moduleRef.get(MakeNotificationFactory);

    await app.init();
  });

  test("[PATCH] /notifications/read/:notificationId", async () => {
    const user = await studentFactory.createAndPersist({ name: "John Doe" });

    const notification = await notificationFactory.createAndPersist({
      recipientId: user.id,
    });

    expect(notification.readAt).toBeFalsy();

    const accessToken = await jwt.signAsync({ sub: user.id.toString() });

    const response = await request(app.getHttpServer())
      .patch(`/notifications/read/${notification.id.toString()}`)
      .set({ Authorization: `Bearer ${accessToken}` });

    const notificationOnDb = await prisma.notification.findFirst({
      where: {
        recipientId: user.id.toString(),
      },
    });

    expect(response.statusCode).toBe(200);

    expect(notificationOnDb?.readAt).toBeTruthy();
  });
});
