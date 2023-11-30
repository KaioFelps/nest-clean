import {
  Controller,
  Param,
  HttpCode,
  Delete,
  BadRequestException,
} from "@nestjs/common";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { userTokenPayload } from "@/infra/auth/jwt.strategy";
import { DeleteAnswerCommentService } from "@/domain/forum/application/services/delete-answer-comment";

@Controller("/answers/comments/delete/:id")
export class DeleteAnswerCommentController {
  constructor(private deleteAnswerCommentService: DeleteAnswerCommentService) {}

  @Delete()
  @HttpCode(204)
  async handle(
    @Param("id") answerCommentId: string,
    @CurrentUser() user: userTokenPayload,
  ) {
    const userId = user.sub;

    const result = await this.deleteAnswerCommentService.execute({
      authorId: userId,
      answerCommentId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
