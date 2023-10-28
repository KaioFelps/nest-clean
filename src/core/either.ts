/**
 * Failure
 * ui -> <- controller
 */
export class Left<L, R> {
  readonly value: L;

  constructor(value: L) {
    this.value = value;
  }

  /**
   * indica que quando essa função for chamada, o retorno deverá ser o indicado
   */
  isRight(): this is Right<L, R> {
    return false;
  }

  /**
   * indica que quando essa função for chamada, o retorno deverá ser o indicado
   */
  isLeft(): this is Left<L, R> {
    return true;
  }
}

/**
 * Success
 * ui -> controller -> service -> entity -> repository -> db
 */
export class Right<L, R> {
  readonly value: R;

  constructor(value: R) {
    this.value = value;
  }

  /**
   * indica que quando essa função for chamada, o retorno deverá ser o indicado
   */
  isRight(): this is Right<L, R> {
    return true;
  }

  /**
   * indica que quando essa função for chamada, o retorno deverá ser o indicado
   */
  isLeft(): this is Left<L, R> {
    return false;
  }
}

export type Either<L, R> = Left<L, R> | Right<L, R>;

// não usamos métodos na classes porque fazendo funções separadas não precisamos importar a classe inteira nos outros arquivos, ou seja, menos código final
export const left = <L, R>(value: L): Either<L, R> => {
  return new Left(value);
};

export const right = <L, R>(value: R): Either<L, R> => {
  return new Right(value);
};
