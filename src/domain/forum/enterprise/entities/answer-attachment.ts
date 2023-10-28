import { Entity } from "@/core/entities/entity";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";

export interface IAnswerAttachment {
  answerId: UniqueEntityId;
  attachmentId: UniqueEntityId;
}

export class AnswerAttachment extends Entity<IAnswerAttachment> {
  get answerId() {
    return this.props.answerId;
  }

  get attachmentId() {
    return this.props.attachmentId;
  }

  static create(props: IAnswerAttachment, id?: UniqueEntityId) {
    const attachment = new AnswerAttachment(props, id);
    return attachment;
  }
}
