import {
  Controller,
  Param,
  HttpCode,
  Delete,
  BadRequestException,
} from "@nestjs/common";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { userTokenPayload } from "@/infra/auth/jwt.strategy";
import { DeleteAnswerService } from "@/domain/forum/application/services/delete-answer";

@Controller("/answers/delete/:id")
export class DeleteAnswerController {
  constructor(private deleteAnswerService: DeleteAnswerService) {}

  @Delete()
  @HttpCode(204)
  async handle(
    @Param("id") answerId: string,
    @CurrentUser() user: userTokenPayload,
  ) {
    const userId = user.sub;

    const result = await this.deleteAnswerService.execute({
      authorId: userId,
      answerId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
