import { Entity } from "@/core/entities/entity";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";

export interface IAttachment {
  title: string;
  url: string;
}

export class Attachment extends Entity<IAttachment> {
  get title() {
    return this.props.title;
  }

  get url() {
    return this.props.url;
  }

  static create(props: IAttachment, id?: UniqueEntityId) {
    const attachment = new Attachment(props, id);
    return attachment;
  }
}
