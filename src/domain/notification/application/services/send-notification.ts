import { Either, right } from "@/core/either";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { Notification } from "../../enterprise/entities/notification";
import { INotificationRepository } from "../repositories/notification-repository";

export interface ISendNotificationService {
  recipientId: string;
  title: string;
  content: string;
}

export type ISendNotificationResponse = Either<
  null,
  { notification: Notification }
>;

export class SendNotificationService {
  constructor(private notificationRepository: INotificationRepository) {}

  async execute({
    recipientId,
    content,
    title,
  }: ISendNotificationService): Promise<ISendNotificationResponse> {
    const notification = Notification.create({
      recipientId: new UniqueEntityId(recipientId),
      content,
      title,
    });

    await this.notificationRepository.create(notification);

    return right({ notification });
  }
}
