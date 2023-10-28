import { DomainEvents } from "@/core/events/domain-events";
import { PaginationParams } from "@/core/repositories/pagination-params";
import { IAnswerAttachmentRepository } from "@/domain/forum/application/repositories/answer-attachment-repository";
import { IAnswerRepository } from "@/domain/forum/application/repositories/answer-repository-interface";
import { Answer } from "@/domain/forum/enterprise/entities/answer";

export class InMemoryAnswerRepository implements IAnswerRepository {
  public items: Answer[] = [];

  constructor(
    private answerAttachmentRepository: IAnswerAttachmentRepository,
  ) {}

  async create(answer: Answer): Promise<void> {
    this.items.push(answer);
    DomainEvents.dispatchEventsForAggregate(answer.id);
  }

  async delete(answer: Answer): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === answer.id);
    this.items.splice(itemIndex, 1);
    this.answerAttachmentRepository.deleteManyByAnswerId(answer.id.toString());
  }

  async save(answer: Answer): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === answer.id);
    this.items[itemIndex] = answer;
  }

  async findById(id: string): Promise<Answer | null> {
    const answer = this.items.find((item) => item.id.toString() === id);

    return answer ?? null;
  }

  async findManyByQuestionId(
    questionId: string,
    { page }: PaginationParams,
  ): Promise<Answer[]> {
    const LIMIT_PER_PAGE = 20;
    const OFFSET = (page - 1) * LIMIT_PER_PAGE;

    const answers = this.items
      .filter((item) => item.questionId.toString() === questionId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(OFFSET, page * LIMIT_PER_PAGE);

    return answers;
  }
}
