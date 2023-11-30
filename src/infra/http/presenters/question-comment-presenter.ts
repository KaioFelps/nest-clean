import { QuestionComment } from "@/domain/forum/enterprise/entities/question-comment";

export class QuestionCommentPresenter {
  static toHTTP(comment: QuestionComment) {
    return {
      id: comment.id,
      content: comment.content,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
    };
  }
}
