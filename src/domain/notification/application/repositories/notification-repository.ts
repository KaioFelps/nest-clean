import { Notification } from "../../enterprise/entities/notification";

export interface INotificationRepository {
  create(notification: Notification): Promise<void>;
  save(notification: Notification): Promise<void>;
  findById(id: string): Promise<Notification | null>;
}
