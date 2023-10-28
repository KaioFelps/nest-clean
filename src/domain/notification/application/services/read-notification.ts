import { Either, left, right } from "@/core/either";
import { Notification } from "../../enterprise/entities/notification";
import { INotificationRepository } from "../repositories/notification-repository";
import { ResourceNotFoundError } from "@/domain/forum/application/services/errors/resource-not-found-error";
import { NotAllowedError } from "@/domain/forum/application/services/errors/not-allowed-error";

interface IReadNotificationService {
  notificationId: string;
  recipientId: string;
}

type IReadNotificationResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  { notification: Notification }
>;

export class ReadNotificationService {
  constructor(private notificationRepository: INotificationRepository) {}

  async execute({
    notificationId,
    recipientId,
  }: IReadNotificationService): Promise<IReadNotificationResponse> {
    const notification =
      await this.notificationRepository.findById(notificationId);

    if (!notification) {
      return left(new ResourceNotFoundError());
    }

    if (notification.recipientId.toString() !== recipientId) {
      return left(new NotAllowedError());
    }

    notification.read();

    await this.notificationRepository.save(notification);

    return right({ notification });
  }
}
