import { Optional } from "@/core/@types/optional";
import { Entity } from "@/core/entities/entity";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";

export interface INotification {
  recipientId: UniqueEntityId;
  title: string;
  content: string;
  createdAt: Date;
  readAt?: Date;
}

export class Notification extends Entity<INotification> {
  get recipientId() {
    return this.props.recipientId;
  }

  get title() {
    return this.props.title;
  }

  get content() {
    return this.props.content;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get readAt() {
    return this.props.readAt;
  }

  read() {
    this.props.readAt = new Date();
  }

  static create(
    props: Optional<INotification, "createdAt">,
    id?: UniqueEntityId,
  ) {
    const notification = new Notification(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );

    return notification;
  }
}
