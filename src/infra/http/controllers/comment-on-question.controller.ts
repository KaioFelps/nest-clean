import { Body, Controller, Param, Post } from "@nestjs/common";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { userTokenPayload } from "@/infra/auth/jwt.strategy";
import { z } from "zod";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import { CommentOnQuestionService } from "@/domain/forum/application/services/comment-on-question";

const commentonQuestionBodySchema = z.object({
  content: z.string(),
});

type CommentOnQuestionBody = z.infer<typeof commentonQuestionBodySchema>;

const bodyValidationPipe = new ZodValidationPipe(commentonQuestionBodySchema);

// @UseGuards(JwtAuthGuard)
// não é mais necessário, pois um guard global foi setado no auth module
// para tornar público, use o decorator public-route.
@Controller("/questions/:questionId/comment")
export class CommentOnQuestionController {
  constructor(private commentonQuestion: CommentOnQuestionService) {}

  @Post()
  async handle(
    @Body(bodyValidationPipe) body: CommentOnQuestionBody,
    @Param("questionId") questionId: string,
    @CurrentUser() user: userTokenPayload,
  ) {
    const { content } = body;

    await this.commentonQuestion.execute({
      content,
      authorId: user.sub,
      questionId,
    });
  }
}
