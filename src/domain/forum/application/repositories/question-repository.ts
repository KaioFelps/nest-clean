import { PaginationParams } from "@/core/repositories/pagination-params";
import { Question } from "../../enterprise/entities/question";
import { QuestionWithDetails } from "../../enterprise/entities/value-objects/question-with-details";

export abstract class IQuestionRepository {
  abstract create(question: Question): Promise<void>;
  abstract delete(question: Question): Promise<void>;
  abstract save(question: Question): Promise<void>;
  abstract findBySlug(slug: string): Promise<Question | null>;
  abstract findBySlugWithDetails(
    slug: string,
  ): Promise<QuestionWithDetails | null>;

  abstract findById(id: string): Promise<Question | null>;
  abstract findManyLatest(params: PaginationParams): Promise<Question[]>;
}
