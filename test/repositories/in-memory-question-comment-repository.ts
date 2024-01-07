import { DomainEvents } from "@/core/events/domain-events";
import { PaginationParams } from "@/core/repositories/pagination-params";
import { IQuestionCommentRepository } from "@/domain/forum/application/repositories/question-comment-repository";
import { QuestionComment } from "@/domain/forum/enterprise/entities/question-comment";
import { InMemoryStudentRepository } from "./in-memory-student-repository";
import { CommentWithAuthor } from "@/domain/forum/enterprise/entities/value-objects/comments-with-author";

export class InMemoryQuestionCommentRepository
  implements IQuestionCommentRepository
{
  public items: QuestionComment[] = [];

  constructor(private studentRepository: InMemoryStudentRepository) {}

  async create(questionComment: QuestionComment): Promise<void> {
    this.items.push(questionComment);
    DomainEvents.dispatchEventsForAggregate(questionComment.id);
  }

  async delete(questionComment: QuestionComment): Promise<void> {
    const itemIndex = this.items.findIndex(
      (item) => item.id === questionComment.id,
    );
    this.items.splice(itemIndex, 1);
  }

  async findById(id: string): Promise<QuestionComment | null> {
    const questionComment = this.items.find(
      (item) => item.id.toString() === id,
    );

    return questionComment ?? null;
  }

  async findManyByQuestionId(
    questionId: string,
    { page }: PaginationParams,
  ): Promise<QuestionComment[]> {
    const LIMIT_PER_PAGE = 20;
    const OFFSET = (page - 1) * LIMIT_PER_PAGE;

    const questionComments = this.items
      .filter((item) => item.questionId.toString() === questionId)
      .slice(OFFSET, page * LIMIT_PER_PAGE);

    return questionComments;
  }

  async findManyByQuestionIdWithAuthor(
    questionId: string,
    { page }: PaginationParams,
  ): Promise<CommentWithAuthor[]> {
    const LIMIT_PER_PAGE = 20;
    const OFFSET = (page - 1) * LIMIT_PER_PAGE;

    const questionComments = this.items
      .filter((item) => item.questionId.toString() === questionId)
      .slice(OFFSET, page * LIMIT_PER_PAGE)
      .map((comment) => {
        const author = this.studentRepository.items.find((item) =>
          item.id.equals(comment.authorId),
        );

        if (!author) {
          throw new Error(
            `Author with ID "${comment.authorId.toString()} doesn't existe."`,
          );
        }

        const commentWithAuthor = CommentWithAuthor.create({
          author: author.name,
          authorId: author.id,
          commentId: comment.id,
          createdAt: comment.createdAt,
          updatedAt: comment.updatedAt,
          content: comment.content,
        });

        return commentWithAuthor;
      });

    return questionComments;
  }
}
