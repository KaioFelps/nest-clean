import { IHashComparer } from "@/domain/forum/application/cryptography/hash-comparor";
import { IHashGenerator } from "@/domain/forum/application/cryptography/hash-generator";

export class FakeHasher implements IHashGenerator, IHashComparer {
  async hash(plain: string): Promise<string> {
    return plain.concat("--hashed");
  }

  async compare(plain: string, hash: string): Promise<boolean> {
    return plain.concat("--hashed") === hash;
  }
}
