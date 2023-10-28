import { MakeQuestionFactory } from "test/factories/make-question";
import { InMemoryQuestionRepository } from "test/repositories/in-memory-question-repository";
import { InMemoryQuestionAttachmentRepository } from "test/repositories/in-memory-question-attachment-repository";
import {
  SendNotificationService,
  ISendNotificationResponse,
  ISendNotificationService,
} from "../services/send-notification";
import { InMemoryNotificationRepository } from "test/repositories/in-memory-notification-repository";
import { SpyInstance } from "vitest";
import { waitFor } from "test/util/wait-for";
import { MakeQuestionCommentFactory } from "test/factories/make-question-comment";
import { InMemoryQuestionCommentRepository } from "test/repositories/in-memory-question-comment-repository";
import { OnQuestionCommentCreated } from "./on-question-comment-created";

let inMemoryQuestionRepository: InMemoryQuestionRepository;
let inMemoryQuestionAttachmentRepository: InMemoryQuestionAttachmentRepository;
let inMemoryQuestionCommentRepository: InMemoryQuestionCommentRepository;
let inMemoryNotificationRepository: InMemoryNotificationRepository;
let sendNotificationService: SendNotificationService;

// os generics recebem 2 parâmetros: um array com os parâmetros da função e, em seguida, o tipo da resposta da função
let sendNotificationExecuteSpy: SpyInstance<
  [ISendNotificationService],
  Promise<ISendNotificationResponse>
>;

describe("On question comment created", () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentRepository =
      new InMemoryQuestionAttachmentRepository();
    inMemoryQuestionRepository = new InMemoryQuestionRepository(
      inMemoryQuestionAttachmentRepository,
    );

    inMemoryQuestionCommentRepository = new InMemoryQuestionCommentRepository();

    inMemoryNotificationRepository = new InMemoryNotificationRepository();

    sendNotificationService = new SendNotificationService(
      inMemoryNotificationRepository,
    );

    sendNotificationExecuteSpy = vi.spyOn(sendNotificationService, "execute");

    new OnQuestionCommentCreated(
      inMemoryQuestionRepository,
      sendNotificationService,
    );
  });

  test("if it sends a notification when an question comment is created", () => {
    const question = MakeQuestionFactory.execute();
    const comment = MakeQuestionCommentFactory.execute({
      questionId: question.id,
    });

    inMemoryQuestionRepository.create(question);
    inMemoryQuestionCommentRepository.create(comment);

    waitFor(() => {
      expect(sendNotificationExecuteSpy).toHaveBeenCalled();
    });
  });
});
