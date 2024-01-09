import { faker } from "@faker-js/faker";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import {
  INotification,
  Notification,
} from "@/domain/notification/enterprise/entities/notification";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { Injectable } from "@nestjs/common";
import { PrismaNotificationMapper } from "@/infra/database/prisma/mappers/prisma-notification-mapper";

@Injectable()
export class MakeNotificationFactory {
  constructor(private prisma: PrismaService) {}

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

  async createAndPersist(data: Partial<INotification>): Promise<Notification> {
    const notification = MakeNotificationFactory.execute(data);

    const prismaNotification = PrismaNotificationMapper.toPrisma(notification);

    await this.prisma.notification.create({ data: prismaNotification });

    return notification;
  }
}
