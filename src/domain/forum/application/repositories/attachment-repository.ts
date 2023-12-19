import { Attachment } from "../../enterprise/entities/attachment";

export abstract class IAttachmentRepository {
  abstract create(attachment: Attachment): Promise<void>;
}
