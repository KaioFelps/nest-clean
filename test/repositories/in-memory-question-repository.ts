import { DomainEvents } from "@/core/events/domain-events";
import { PaginationParams } from "@/core/repositories/pagination-params";
import { IQuestionRepository } from "@/domain/forum/application/repositories/question-repository";
import { Question } from "@/domain/forum/enterprise/entities/question";
import { QuestionWithDetails } from "@/domain/forum/enterprise/entities/value-objects/question-with-details";
import { InMemoryStudentRepository } from "./in-memory-student-repository";
import { InMemoryAttachmentRepository } from "./in-memory-attachment-repository";
import { InMemoryQuestionAttachmentRepository } from "./in-memory-question-attachment-repository";

export class InMemoryQuestionRepository implements IQuestionRepository {
  public items: Question[] = [];

  constructor(
    private questionAttachmentRepository: InMemoryQuestionAttachmentRepository,
    private studentRepository: InMemoryStudentRepository,
    private attachmentRepository: InMemoryAttachmentRepository,
  ) {}

  async create(question: Question): Promise<void> {
    this.items.push(question);

    this.questionAttachmentRepository.createMany(
      question.attachments.getItems(),
    );

    DomainEvents.dispatchEventsForAggregate(question.id);
  }

  async delete(question: Question): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === question.id);
    this.items.splice(itemIndex, 1);
    this.questionAttachmentRepository.deleteManyByQuestionId(
      question.id.toString(),
    );
  }

  async save(question: Question) {
    const itemIndex = this.items.findIndex((item) => item.id === question.id);

    this.items[itemIndex] = question;

    await this.questionAttachmentRepository.createMany(
      question.attachments.getNewItems(),
    );

    await this.questionAttachmentRepository.deleteMany(
      question.attachments.getRemovedItems(),
    );

    DomainEvents.dispatchEventsForAggregate(question.id);
  }

  async findBySlug(slug: string): Promise<Question | null> {
    const question = this.items.find((item) => item.slug?.value === slug);

    return question ?? null;
  }

  async findBySlugWithDetails(
    slug: string,
  ): Promise<QuestionWithDetails | null> {
    const question = this.items.find((item) => item.slug?.value === slug);

    if (!question) {
      return null;
    }

    const author = this.studentRepository.items.find((item) =>
      item.id.equals(question?.authorId),
    );

    if (!author) {
      throw new Error(`Author Id "${question?.authorId}" doesn't exist.`);
    }

    const questionAttachments = this.questionAttachmentRepository.items.filter(
      (item) => item.questionId.equals(question.id),
    );

    const attachments = questionAttachments.map((questionAttachment) => {
      const attachment = this.attachmentRepository.items.find((item) =>
        item.id.equals(questionAttachment.attachmentId),
      );

      if (!attachment) {
        throw new Error(
          `Attachment with ID "${questionAttachment.attachmentId.toString()}" does not exist.`,
        );
      }

      return attachment;
    });

    return QuestionWithDetails.create({
      attachments,
      author: author.name,
      authorId: author.id,
      content: question.content,
      createdAt: question.createdAt ?? undefined,
      updatedAt: question.updatedAt ?? undefined,
      questionId: question.id,
      slug: question.slug.value,
      title: question.title,
      bestAnswerID: question.bestAnswerId ?? undefined,
    });
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
