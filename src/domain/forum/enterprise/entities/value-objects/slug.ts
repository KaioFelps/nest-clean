export class Slug {
  public value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static create(slug: string) {
    return new Slug(slug);
  }

  /**
   * Receives a string and normalize it as a Slug
   *
   * Example: "An example title" => "an-example-title"
   *
   * @param text {string}
   */

  // funções estáticas são funções utilitárias. Elas são como o constructor, são acessadas sem inicializar a classe
  static createFromText(text: string) {
    // utiliza uma convenção de normalização do unicode e padroniza a string convertendo caracteres que não estejam dentro dos caracteres aceitos para caracteres aceitos pelo unicode
    // em outras palavras, remove as acentuações da string
    const slugText = text
      .normalize("NFKD")
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      // \s significa whitespace
      // g significa global
      .replace(/[^\w-]+/g, "")
      // \w pega todas as palavras
      // ^ diz o oposto, ou seja, pega tudo que NÃO são palavras
      // isso remove os símbolos
      .replace(/_/g, "-")
      .replace(/--+/g, "-")
      .replace(/-$/, "");

    return new Slug(slugText);
  }
}
