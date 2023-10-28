import { DomainEvents } from "@/core/events/domain-events";
import { EventHandler } from "@/core/events/event-handler";
import { IQuestionRepository } from "@/domain/forum/application/repositories/question-repository-interface";
import { AnswerCreatedEvent } from "@/domain/forum/enterprise/events/answer-created-event";
import { SendNotificationService } from "../services/send-notification";

export class OnAnswerCreated implements EventHandler {
  constructor(
    private questionRepository: IQuestionRepository,
    private sendNotification: SendNotificationService,
  ) {
    this.setupSubscriptions();
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendNewAnswerNotification.bind(this),
      AnswerCreatedEvent.name,
    );
  }

  private async sendNewAnswerNotification({ answer }: AnswerCreatedEvent) {
    const question = await this.questionRepository.findById(
      answer.questionId.toString(),
    );

    if (question) {
      await this.sendNotification.execute({
        recipientId: question.authorId.toString(),
        title: `Nova resposta em ${question.title
          .substring(0, 40)
          .trimEnd()
          .concat("...")}`,
        content: answer.content.substring(0, 120).trimEnd().concat("..."),
      });
    }
  }
}
