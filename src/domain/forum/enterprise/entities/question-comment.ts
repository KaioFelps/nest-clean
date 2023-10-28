import { Optional } from "@/core/@types/optional";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { Comment, IComment } from "./comment";

export interface IQuestionComment extends IComment {
  questionId: UniqueEntityId;
}

export class QuestionComment extends Comment<IQuestionComment> {
  get questionId() {
    return this.props.questionId;
  }

  static create(
    props: Optional<IQuestionComment, "createdAt">,
    id?: UniqueEntityId,
  ) {
    const questioncomment = new QuestionComment(
      { ...props, createdAt: props.createdAt ?? new Date() },
      id,
    );

    return questioncomment;
  }
}
