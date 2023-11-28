import {
  Controller,
  Param,
  HttpCode,
  Delete,
  BadRequestException,
} from "@nestjs/common";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { userTokenPayload } from "@/infra/auth/jwt.strategy";
import { DeleteQuestionService } from "@/domain/forum/application/services/delete-question";

@Controller("/questions/delete/:id")
export class DeleteQuestionController {
  constructor(private deleteQuestionService: DeleteQuestionService) {}

  @Delete()
  @HttpCode(204)
  async handle(
    @Param("id") questionId: string,
    @CurrentUser() user: userTokenPayload,
  ) {
    const userId = user.sub;

    const result = await this.deleteQuestionService.execute({
      authorId: userId,
      questionId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
