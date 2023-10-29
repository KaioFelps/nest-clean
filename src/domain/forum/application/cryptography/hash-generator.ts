export abstract class IHashGenerator {
  abstract hash(plain: string): Promise<string>;
}
