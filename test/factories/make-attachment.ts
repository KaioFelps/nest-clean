import { faker } from "@faker-js/faker";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import {
  Attachment,
  IAttachment,
} from "@/domain/forum/enterprise/entities/attachment";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { PrismaAttachmentMapper } from "@/infra/database/prisma/mappers/prisma-attachment-mapper";

@Injectable()
export class MakeAttachmentFactory {
  constructor(private prisma: PrismaService) {}

  static execute(override: Partial<IAttachment> = {}, id?: UniqueEntityId) {
    const attachment = Attachment.create(
      {
        title: faker.lorem.sentence(4),
        url: faker.image.url(),
        ...override, // escreve qualquer coisa do override tenha enviado. As propriedades substituem as que já existem, se enviadas
      },
      id,
    );

    return attachment;
  }

  async createAndPersist(data: Partial<IAttachment> = {}): Promise<Attachment> {
    const attachment = MakeAttachmentFactory.execute(data);

    await this.prisma.attachment.create({
      data: PrismaAttachmentMapper.toPrisma(attachment),
    });

    return attachment;
  }
}
