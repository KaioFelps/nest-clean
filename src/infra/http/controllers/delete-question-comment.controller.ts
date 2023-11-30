import {
  Controller,
  Param,
  HttpCode,
  Delete,
  BadRequestException,
} from "@nestjs/common";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { userTokenPayload } from "@/infra/auth/jwt.strategy";
import { DeleteQuestionCommentService } from "@/domain/forum/application/services/delete-question-comment";

@Controller("/questions/comments/delete/:id")
export class DeleteQuestionCommentController {
  constructor(
    private deleteQuestionCommentService: DeleteQuestionCommentService,
  ) {}

  @Delete()
  @HttpCode(204)
  async handle(
    @Param("id") questionCommentId: string,
    @CurrentUser() user: userTokenPayload,
  ) {
    const userId = user.sub;

    const result = await this.deleteQuestionCommentService.execute({
      authorId: userId,
      questionCommentId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
