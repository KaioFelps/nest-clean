import { InMemoryNotificationRepository } from "test/repositories/in-memory-notification-repository";
import { SendNotificationService } from "./send-notification";

let inMemoryNotificationRepository: InMemoryNotificationRepository;
let sut: SendNotificationService;

describe("Create notification service", () => {
  beforeEach(() => {
    inMemoryNotificationRepository = new InMemoryNotificationRepository();
    sut = new SendNotificationService(inMemoryNotificationRepository);
  });

  test("if it's possible to create a notification", async () => {
    const response = await sut.execute({
      recipientId: "1",
      content: "Sample notification content here",
      title: "Sample notification title",
    });

    expect(response.isRight()).toBe(true);
    expect(inMemoryNotificationRepository.items[0].id).toEqual(
      response.value?.notification.id,
    );
  });
});
