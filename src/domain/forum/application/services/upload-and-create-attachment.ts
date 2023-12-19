import { Either, left, right } from "@/core/either";
import { Injectable } from "@nestjs/common";
import { InvalidAttachmentType } from "./errors/invalid-attachment-type";
import { Attachment } from "../../enterprise/entities/attachment";
import { IAttachmentRepository } from "../repositories/attachment-repository";
import { Uploader } from "../storage/uploader";

interface IUploadAndCreateAttachmentService {
  fileName: string;
  fileType: string;
  body: Buffer;
}

type IUploadAndCreateAttachmentResponse = Either<
  InvalidAttachmentType,
  {
    attachment: Attachment;
  }
>;

@Injectable()
export class UploadAndCreateAttachmentService {
  constructor(
    private attachmentRepository: IAttachmentRepository,
    private uploader: Uploader,
  ) {}

  async execute({
    body,
    fileName,
    fileType,
  }: IUploadAndCreateAttachmentService): Promise<IUploadAndCreateAttachmentResponse> {
    if (!/^(image\/(jpe?g|png)|application\/pdf)$/.test(fileType)) {
      return left(new InvalidAttachmentType(fileType));
    }

    const { url } = await this.uploader.upload({ body, fileName, fileType });

    const attachment = Attachment.create({
      title: fileName,
      url,
    });

    await this.attachmentRepository.create(attachment);

    return right({
      attachment,
    });
  }
}
