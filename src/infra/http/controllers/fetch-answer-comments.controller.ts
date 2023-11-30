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
import { AnswerCommentPresenter } from "../presenters/answer-comment-presenter";

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

    const { answerComments } = response.value;

    for (let i = 0; i < answerComments.length; i++) {
      mappedComments.push(AnswerCommentPresenter.toHTTP(answerComments[i]));
    }

    return { comments: mappedComments };
  }
}
