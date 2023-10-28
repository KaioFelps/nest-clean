import { DomainEvents } from "@/core/events/domain-events";
import { PaginationParams } from "@/core/repositories/pagination-params";
import { IQuestionAttachmentRepository } from "@/domain/forum/application/repositories/question-attachment-repository";
import { IQuestionRepository } from "@/domain/forum/application/repositories/question-repository-interface";
import { Question } from "@/domain/forum/enterprise/entities/question";

export class InMemoryQuestionRepository implements IQuestionRepository {
  public items: Question[] = [];

  constructor(
    private questionAttachmentRepository: IQuestionAttachmentRepository,
  ) {}

  async create(question: Question): Promise<void> {
    this.items.push(question);

    DomainEvents.dispatchEventsForAggregate(question.id);
  }

  async delete(question: Question): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === question.id);
    this.items.splice(itemIndex, 1);
    this.questionAttachmentRepository.deleteManyByQuestionId(
      question.id.toString(),
    );
  }

  async save(question: Question): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === question.id);

    this.items[itemIndex] = question;

    DomainEvents.dispatchEventsForAggregate(question.id);
  }

  async findBySlug(slug: string): Promise<Question | null> {
    const question = this.items.find((item) => item.slug?.value === slug);

    return question ?? null;
  }

  async findById(id: string): Promise<Question | null> {
    const question = this.items.find((item) => item.id.toString() === id);

    return question ?? null;
  }

  async findManyLatest({ page }: PaginationParams): Promise<Question[]> {
    const LIMIT_PER_PAGE = 20;
    const OFFSET = (page - 1) * LIMIT_PER_PAGE;

    const questions = this.items
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(OFFSET, page * LIMIT_PER_PAGE);

    return questions;
  }
}
