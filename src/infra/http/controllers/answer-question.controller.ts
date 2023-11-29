import { Body, Controller, Param, Post } from "@nestjs/common";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { userTokenPayload } from "@/infra/auth/jwt.strategy";
import { z } from "zod";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import { AnswerQuestionService } from "@/domain/forum/application/services/answer-question";

const answerQuestionBodySchema = z.object({
  content: z.string(),
});

type AnswerQuestionBody = z.infer<typeof answerQuestionBodySchema>;

const bodyValidationPipe = new ZodValidationPipe(answerQuestionBodySchema);

// @UseGuards(JwtAuthGuard)
// não é mais necessário, pois um guard global foi setado no auth module
// para tornar público, use o decorator public-route.
@Controller("/questions/:questionId/answer")
export class AnswerQuestionController {
  constructor(private answerQuestion: AnswerQuestionService) {}

  @Post()
  async handle(
    @Body(bodyValidationPipe) body: AnswerQuestionBody,
    @Param("questionId") questionId: string,
    @CurrentUser() user: userTokenPayload,
  ) {
    const { content } = body;

    await this.answerQuestion.execute({
      attachmentsIds: [],
      content,
      authorId: user.sub,
      questionId,
    });
  }
}
