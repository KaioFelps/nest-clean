import { Optional } from "@/core/@types/optional";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { Comment, IComment } from "./comment";

export interface IAnswerComment extends IComment {
  answerId: UniqueEntityId;
}

export class AnswerComment extends Comment<IAnswerComment> {
  get answerId() {
    return this.props.answerId;
  }

  static create(
    props: Optional<IAnswerComment, "createdAt">,
    id?: UniqueEntityId,
  ) {
    const answercomment = new AnswerComment(
      { ...props, createdAt: props.createdAt ?? new Date() },
      id,
    );

    return answercomment;
  }
}
