import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { DomainEvent } from "@/core/events/domain-event";
import { AnswerComment } from "../entities/answer-comment";

export class AnswerCommentCreatedEvent implements DomainEvent {
  public ocurredAt: Date;
  public answerId: UniqueEntityId;
  public comment: AnswerComment;

  constructor(answerId: UniqueEntityId, comment: AnswerComment) {
    this.ocurredAt = new Date();
    this.answerId = answerId;
    this.comment = comment;
  }

  public getAggregateId(): UniqueEntityId {
    return this.comment.id;
  }
}
