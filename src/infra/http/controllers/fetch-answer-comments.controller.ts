import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
} from "@nestjs/common";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import { z } from "zod";
import { FetchAnswerCommentService } from "@/domain/forum/application/services/fetch-answer-comments";
import { CommentWithAuthorPresenter } from "../presenters/comment-with-author-presenter";

const pageQueryParamSchema = z
  .string()
  .optional()
  .default("1")
  .transform(Number)
  .pipe(z.number().min(1));

const answerIdParamSchema = z.string().uuid();

type AnswerIdParam = z.infer<typeof answerIdParamSchema>;
type PageQueryParam = z.infer<typeof pageQueryParamSchema>;

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema);

const answerIdParamValidationPipe = new ZodValidationPipe(answerIdParamSchema);

@Controller("/answers/comments/:answerId/")
export class FetchAnswerCommentsController {
  constructor(private fetchAnswerCommentsService: FetchAnswerCommentService) {}

  @Get()
  async handle(
    @Query("page", queryValidationPipe) page: PageQueryParam,
    @Param("answerId", answerIdParamValidationPipe)
    answerId: AnswerIdParam,
  ) {
    const response = await this.fetchAnswerCommentsService.execute({
      page,
      answerId,
    });

    const mappedComments: unknown[] = [];

    if (response.isLeft()) {
      throw new BadRequestException();
    }

    const { comments } = response.value;

    for (let i = 0; i < comments.length; i++) {
      mappedComments.push(CommentWithAuthorPresenter.toHTTP(comments[i]));
    }

    return { comments: mappedComments };
  }
}
