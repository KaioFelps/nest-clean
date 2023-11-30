import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
} from "@nestjs/common";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import { z } from "zod";
import { FetchQuestionCommentService } from "@/domain/forum/application/services/fetch-question-comments";
import { QuestionCommentPresenter } from "../presenters/question-comment-presenter";

const pageQueryParamSchema = z
  .string()
  .optional()
  .default("1")
  .transform(Number)
  .pipe(z.number().min(1));

const questionIdParamSchema = z.string().uuid();

type QuestionIdParam = z.infer<typeof questionIdParamSchema>;
type PageQueryParam = z.infer<typeof pageQueryParamSchema>;

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema);

const questionIdParamValidationPipe = new ZodValidationPipe(
  questionIdParamSchema,
);

@Controller("/questions/comments/:questionId/")
export class FetchQuestionCommentsController {
  constructor(
    private fetchQuestionCommentsService: FetchQuestionCommentService,
  ) {}

  @Get()
  async handle(
    @Query("page", queryValidationPipe) page: PageQueryParam,
    @Param("questionId", questionIdParamValidationPipe)
    questionId: QuestionIdParam,
  ) {
    const response = await this.fetchQuestionCommentsService.execute({
      page,
      questionId,
    });

    const mappedComments: unknown[] = [];

    if (response.isLeft()) {
      throw new BadRequestException();
    }

    const { questionComments } = response.value;

    for (let i = 0; i < questionComments.length; i++) {
      mappedComments.push(QuestionCommentPresenter.toHTTP(questionComments[i]));
    }

    return { comments: mappedComments };
  }
}
