import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { Notification } from "@/domain/notification/enterprise/entities/notification";
import { Prisma, Notification as PrismaNotification } from "@prisma/client";

export class PrismaNotificationMapper {
  static toPrisma(
    domainNotification: Notification,
  ): Prisma.NotificationUncheckedCreateInput {
    return {
      id: domainNotification.id.toString(),
      content: domainNotification.content,
      recipientId: domainNotification.recipientId.toString(),
      title: domainNotification.title,
      createdAt: domainNotification.createdAt,
      readAt: domainNotification.readAt,
    };
  }

  static toDomain(prismaNotification: PrismaNotification): Notification {
    const notification = Notification.create(
      {
        content: prismaNotification.content,
        recipientId: new UniqueEntityId(prismaNotification.recipientId),
        title: prismaNotification.title,
        createdAt: prismaNotification.createdAt,
        readAt: prismaNotification.readAt,
      },
      new UniqueEntityId(prismaNotification.id),
    );

    return notification;
  }
}
