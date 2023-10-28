import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { DomainEvent } from "@/core/events/domain-event";
import { QuestionComment } from "../entities/question-comment";

export class QuestionCommentCreatedEvent implements DomainEvent {
  public ocurredAt: Date;
  public questionId: UniqueEntityId;
  public comment: QuestionComment;

  constructor(questionId: UniqueEntityId, comment: QuestionComment) {
    this.ocurredAt = new Date();
    this.questionId = questionId;
    this.comment = comment;
  }

  public getAggregateId(): UniqueEntityId {
    return this.comment.id;
  }
}
