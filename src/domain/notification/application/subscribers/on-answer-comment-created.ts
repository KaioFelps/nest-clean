import { DomainEvents } from "@/core/events/domain-events";
import { EventHandler } from "@/core/events/event-handler";
import { SendNotificationService } from "../services/send-notification";
import { AnswerCommentCreatedEvent } from "@/domain/forum/enterprise/events/answer-comment-created-event";
import { IAnswerRepository } from "@/domain/forum/application/repositories/answer-repository-interface";

export class OnAnswerCommentCreated implements EventHandler {
  constructor(
    private answerRepository: IAnswerRepository,
    private sendNotification: SendNotificationService,
  ) {
    this.setupSubscriptions();
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendAnswerCommentCreatedNotification.bind(this),
      AnswerCommentCreatedEvent.name,
    );
  }

  private async sendAnswerCommentCreatedNotification({
    answerId,
    comment,
  }: AnswerCommentCreatedEvent) {
    const answer = await this.answerRepository.findById(answerId.toString());

    if (answer) {
      await this.sendNotification.execute({
        recipientId: answer.authorId.toString(),
        title: `Novo comentário em sua resposta: ${answer.content
          .substring(0, 40)
          .trimEnd()
          .concat("...")}`,
        content: comment.content.substring(0, 120).trimEnd().concat("..."),
      });
    }
  }
}
