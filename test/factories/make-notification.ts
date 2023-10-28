import { faker } from "@faker-js/faker";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import {
  INotification,
  Notification,
} from "@/domain/notification/enterprise/entities/notification";

export class MakeNotificationFactory {
  static execute(override: Partial<INotification> = {}, id?: UniqueEntityId) {
    const notification = Notification.create(
      {
        recipientId: new UniqueEntityId(),
        title: faker.lorem.sentence(),
        content: faker.lorem.paragraph(),
        ...override, // escreve qualquer coisa do override tenha enviado. As propriedades substituem as que já existem, se enviadas
      },
      id,
    );

    return notification;
  }
}
