import { InMemoryNotificationRepository } from "test/repositories/in-memory-notification-repository";
import { ReadNotificationService } from "./read-notification";
import { MakeNotificationFactory } from "test/factories/make-notification";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { NotAllowedError } from "@/domain/forum/application/services/errors/not-allowed-error";

let inMemoryNotificationRepository: InMemoryNotificationRepository;
let sut: ReadNotificationService;

describe("Read notification service", () => {
  beforeEach(() => {
    inMemoryNotificationRepository = new InMemoryNotificationRepository();
    sut = new ReadNotificationService(inMemoryNotificationRepository);
  });

  test("if it's possible to read a notification", async () => {
    const notification = MakeNotificationFactory.execute(
      {
        recipientId: new UniqueEntityId("1"),
      },
      new UniqueEntityId("1"),
    );

    await inMemoryNotificationRepository.create(notification);

    const response = await sut.execute({
      recipientId: "1",
      notificationId: "1",
    });

    expect(response.isRight()).toBe(true);
    expect(inMemoryNotificationRepository.items[0].readAt).toEqual(
      expect.any(Date),
    );
  });

  test("if it is impossible to read other user's notification", async () => {
    const notification = MakeNotificationFactory.execute();

    await inMemoryNotificationRepository.create(notification);

    const response = await sut.execute({
      notificationId: notification.id.toString(),
      recipientId: "not-the-correct-id",
    });

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toBeInstanceOf(NotAllowedError);
  });
});
