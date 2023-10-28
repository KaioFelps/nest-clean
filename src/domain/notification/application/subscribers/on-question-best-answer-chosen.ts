import { EventHandler } from "@/core/events/event-handler";
import { IAnswerRepository } from "@/domain/forum/application/repositories/answer-repository-interface";
import { SendNotificationService } from "../services/send-notification";
import { DomainEvents } from "@/core/events/domain-events";
import { QuestionBestAnswerChosenEvent } from "@/domain/forum/enterprise/events/question-best-answer-chosen-event";

export class OnQuestionBestAnswerChosen implements EventHandler {
  constructor(
    private answerRepository: IAnswerRepository,
    private sendNotification: SendNotificationService,
  ) {
    this.setupSubscriptions();
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendQuestionBestAnswerNotification.bind(this),
      QuestionBestAnswerChosenEvent.name,
    );
  }

  private async sendQuestionBestAnswerNotification({
    question,
    bestAnswerId,
  }: QuestionBestAnswerChosenEvent) {
    const answer = await this.answerRepository.findById(
      bestAnswerId.toString(),
    );

    if (answer) {
      await this.sendNotification.execute({
        recipientId: answer.id.toString(),
        title: "Sua resposta foi escolhida!",
        content: `A resposta que você enviou em "${question.title
          .substring(30)
          .trimEnd()
          .concat("...")}" foi escolhida como a melhor resposta da pergunta.`,
      });
    }
  }
}
