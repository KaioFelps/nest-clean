import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
} from "@nestjs/common";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import { z } from "zod";
import { FetchQuestionAnswersService } from "@/domain/forum/application/services/fetch-question-answers";
import { AnswerPresenter } from "../presenters/answer-presenter";

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

@Controller("/answers/:questionId/")
export class FetchQuestionAnswersController {
  constructor(
    private fetchQuestionAnswersService: FetchQuestionAnswersService,
  ) {}

  @Get()
  async handle(
    @Query("page", queryValidationPipe) page: PageQueryParam,
    @Param("questionId", questionIdParamValidationPipe)
    questionId: QuestionIdParam,
  ) {
    const response = await this.fetchQuestionAnswersService.execute({
      page,
      questionId,
    });

    const mappedAnswers: unknown[] = [];

    if (response.isLeft()) {
      throw new BadRequestException();
    }

    const { answers } = response.value;

    for (let i = 0; i < answers.length; i++) {
      mappedAnswers.push(AnswerPresenter.toHTTP(answers[i]));
    }

    return { answers: mappedAnswers };
  }
}
