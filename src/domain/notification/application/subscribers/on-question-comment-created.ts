import { DomainEvents } from "@/core/events/domain-events";
import { EventHandler } from "@/core/events/event-handler";
import { SendNotificationService } from "../services/send-notification";
import { QuestionCommentCreatedEvent } from "@/domain/forum/enterprise/events/question-comment-created-event";
import { IQuestionRepository } from "@/domain/forum/application/repositories/question-repository-interface";

export class OnQuestionCommentCreated implements EventHandler {
  constructor(
    private questionRepository: IQuestionRepository,
    private sendNotification: SendNotificationService,
  ) {
    this.setupSubscriptions();
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendQuestionCommentCreatedNotification.bind(this),
      QuestionCommentCreatedEvent.name,
    );
  }

  private async sendQuestionCommentCreatedNotification({
    questionId,
    comment,
  }: QuestionCommentCreatedEvent) {
    const question = await this.questionRepository.findById(
      questionId.toString(),
    );

    if (question) {
      await this.sendNotification.execute({
        recipientId: question.authorId.toString(),
        title: `Novo comentário em sua resposta: ${question.content
          .substring(0, 40)
          .trimEnd()
          .concat("...")}`,
        content: comment.content.substring(0, 120).trimEnd().concat("..."),
      });
    }
  }
}
