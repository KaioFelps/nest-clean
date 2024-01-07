import { DomainEvents } from "@/core/events/domain-events";
import { PaginationParams } from "@/core/repositories/pagination-params";
import { IAnswerCommentRepository } from "@/domain/forum/application/repositories/answer-comment-repository";
import { AnswerComment } from "@/domain/forum/enterprise/entities/answer-comment";
import { CommentWithAuthor } from "@/domain/forum/enterprise/entities/value-objects/comments-with-author";
import { InMemoryStudentRepository } from "./in-memory-student-repository";

export class InMemoryAnswerCommentRepository
  implements IAnswerCommentRepository
{
  public items: AnswerComment[] = [];

  constructor(private inMemoryStudentRepository: InMemoryStudentRepository) {}

  async create(answerComment: AnswerComment): Promise<void> {
    this.items.push(answerComment);

    DomainEvents.dispatchEventsForAggregate(answerComment.id);
  }

  async delete(answerComment: AnswerComment): Promise<void> {
    const itemIndex = this.items.findIndex(
      (item) => item.id === answerComment.id,
    );
    this.items.splice(itemIndex, 1);
  }

  async findById(id: string): Promise<AnswerComment | null> {
    const answerComment = this.items.find((item) => item.id.toString() === id);

    return answerComment ?? null;
  }

  async findManyByAnswerId(
    answerId: string,
    { page }: PaginationParams,
  ): Promise<AnswerComment[]> {
    const LIMIT_PER_PAGE = 20;
    const OFFSET = (page - 1) * LIMIT_PER_PAGE;

    const answerComments = this.items
      .filter((item) => item.answerId.toString() === answerId)
      .slice(OFFSET, page * LIMIT_PER_PAGE);

    return answerComments;
  }

  async findManyByAnswerIdWithAuthor(
    answerId: string,
    { page }: PaginationParams,
  ): Promise<CommentWithAuthor[]> {
    const LIMIT_PER_PAGE = 20;
    const OFFSET = (page - 1) * LIMIT_PER_PAGE;

    const answerComments = this.items
      .filter((item) => item.answerId.toString() === answerId)
      .slice(OFFSET, page * LIMIT_PER_PAGE)
      .map((comment) => {
        const author = this.inMemoryStudentRepository.items.find((item) =>
          item.id.equals(comment.authorId),
        );

        if (!author) {
          throw new Error(`Author ID "${comment.authorId}" doesn't exist`);
        }

        const commentWithAuthor = CommentWithAuthor.create({
          author: author.name,
          authorId: author.id,
          commentId: comment.id,
          content: comment.content,
          createdAt: comment.createdAt,
          updatedAt: comment.updatedAt,
        });

        return commentWithAuthor;
      });

    return answerComments;
  }
}
