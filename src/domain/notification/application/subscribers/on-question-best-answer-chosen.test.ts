import { MakeAnswerFactory } from "test/factories/make-answer";
import { OnAnswerCreated } from "./on-answer-created";
import { InMemoryAnswerRepository } from "test/repositories/in-memory-answer-repository";
import { InMemoryAnswerAttachmentRepository } from "test/repositories/in-memory-answer-attachment-repository";
import { InMemoryQuestionRepository } from "test/repositories/in-memory-question-repository";
import { InMemoryQuestionAttachmentRepository } from "test/repositories/in-memory-question-attachment-repository";
import {
  SendNotificationService,
  ISendNotificationResponse,
  ISendNotificationService,
} from "../services/send-notification";
import { InMemoryNotificationRepository } from "test/repositories/in-memory-notification-repository";
import { MakeQuestionFactory } from "test/factories/make-question";
import { SpyInstance } from "vitest";
import { waitFor } from "test/util/wait-for";

let inMemoryAnswerRepository: InMemoryAnswerRepository;
let inMemoryAnswerAttachmentRepository: InMemoryAnswerAttachmentRepository;
let inMemoryQuestionAttachmentRepository: InMemoryQuestionAttachmentRepository;
let inMemoryQuestionRepository: InMemoryQuestionRepository;
let inMemoryNotificationRepository: InMemoryNotificationRepository;
let sendNotificationService: SendNotificationService;

// os generics recebem 2 parâmetros: um array com os parâmetros da função e, em seguida, o tipo da resposta da função
let sendNotificationExecuteSpy: SpyInstance<
  [ISendNotificationService],
  Promise<ISendNotificationResponse>
>;

describe("On question best answer chosen", () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentRepository =
      new InMemoryAnswerAttachmentRepository();

    inMemoryAnswerRepository = new InMemoryAnswerRepository(
      inMemoryAnswerAttachmentRepository,
    );

    inMemoryQuestionAttachmentRepository =
      new InMemoryQuestionAttachmentRepository();

    inMemoryQuestionRepository = new InMemoryQuestionRepository(
      inMemoryQuestionAttachmentRepository,
    );

    inMemoryNotificationRepository = new InMemoryNotificationRepository();

    sendNotificationService = new SendNotificationService(
      inMemoryNotificationRepository,
    );

    sendNotificationExecuteSpy = vi.spyOn(sendNotificationService, "execute");

    new OnAnswerCreated(inMemoryQuestionRepository, sendNotificationService);
  });

  test("if it sends a notification to the answer author when it's answer is chosen as best-answer for the question", async () => {
    const question = MakeQuestionFactory.execute();
    const answer = MakeAnswerFactory.execute({
      questionId: question.id,
    });

    await inMemoryQuestionRepository.create(question);
    await inMemoryAnswerRepository.create(answer);

    question.bestAnswerId = answer.id;

    await inMemoryQuestionRepository.save(question);

    await waitFor(() => {
      expect(sendNotificationExecuteSpy).toHaveBeenCalled();
    });
  });
});
