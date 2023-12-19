import {
  UploadParams,
  Uploader,
} from "@/domain/forum/application/storage/uploader";
import { randomUUID } from "crypto";

interface FakeUploadedItem {
  fileName: string;
  url: string;
}

export class FakeUploader implements Uploader {
  public uploads: FakeUploadedItem[] = [];

  async upload({ fileName }: UploadParams): Promise<{ url: string }> {
    const url = `www.fake-url/${fileName}-${randomUUID()}`;

    this.uploads.push({
      fileName,
      url,
    });

    return { url };
  }
}
