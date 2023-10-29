export abstract class IHasheGenerator {
  abstract hash(plain: string): Promise<string>;
}
