import { AnswerComment } from "@/domain/forum/enterprise/entities/answer-comment";

export class AnswerCommentPresenter {
  static toHTTP(comment: AnswerComment) {
    return {
      id: comment.id,
      content: comment.content,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
    };
  }
}
