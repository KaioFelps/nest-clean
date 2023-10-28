import { Entity } from "@/core/entities/entity";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";

interface IAttachment {
  title: string;
  link: string;
}

export class Attachment extends Entity<IAttachment> {
  get title() {
    return this.props.title;
  }

  get link() {
    return this.props.link;
  }

  static create(props: IAttachment, id?: UniqueEntityId) {
    const attachment = new Attachment(props, id);
    return attachment;
  }
}
