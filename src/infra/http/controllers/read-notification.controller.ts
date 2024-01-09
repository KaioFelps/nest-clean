import { ReadNotificationService } from "@/domain/notification/application/services/read-notification";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { userTokenPayload } from "@/infra/auth/jwt.strategy";
import { BadRequestException, Controller, Param, Patch } from "@nestjs/common";

@Controller("/notifications/read/:notificationId")
export class ReadNotificationController {
  constructor(private readNotification: ReadNotificationService) {}

  @Patch()
  async handle(
    @Param("notificationId") notificationId: string,
    @CurrentUser() user: userTokenPayload,
  ) {
    const result = await this.readNotification.execute({
      notificationId,
      recipientId: user.sub,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
