import { ChooseBestAnswerService } from "@/domain/forum/application/services/choose-best-answer";
import {
  BadRequestException,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
} from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "../pipes/zod-validation-pipe";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { userTokenPayload } from "@/infra/auth/jwt.strategy";

const chooseBestAnswerParamSchema = z.string().uuid();

const paramValidationPipe = new ZodValidationPipe(chooseBestAnswerParamSchema);

@Controller("/answers/set-as-best/:id")
export class ChooseBestAnswerController {
  constructor(private chooseBestAnswerService: ChooseBestAnswerService) {}

  @Patch()
  @HttpCode(HttpStatus.NO_CONTENT)
  async handle(
    @Param("id", paramValidationPipe) id: string,
    @CurrentUser() user: userTokenPayload,
  ) {
    const response = await this.chooseBestAnswerService.execute({
      answerId: id,
      authorId: user.sub,
    });

    if (response.isLeft()) {
      throw new BadRequestException();
    }
  }
}
