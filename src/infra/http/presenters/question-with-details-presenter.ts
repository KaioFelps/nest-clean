import { QuestionWithDetails } from "@/domain/forum/enterprise/entities/value-objects/question-with-details";
import { AttachmentPresenter } from "./attachment-presenter";

export class QuestionWithDetailsPresenter {
  static toHTTP(question: QuestionWithDetails) {
    return {
      id: question.questionId.toString(),
      title: question.title,
      content: question.content,
      slug: question.slug.value,
      bestAnswerId: question.bestAnswerID?.toString() ?? undefined,
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
      author: question.author,
      authorId: question.authorId.toString(),
      attachments: question.attachments.map(AttachmentPresenter.toHTTP),
    };
  }
}
