import { Either, left, right } from "./either";

function doSth(x: boolean): Either<string, number> {
  if (x) {
    return right(10);
  } else {
    return left("error");
  }
}

test("success result", () => {
  const successResult = doSth(true);

  if (successResult.isRight()) {
    console.log(successResult.value);
  }

  expect(successResult.isRight()).toBe(true);
  expect(successResult.isLeft()).toBe(false);
});

test("error result", () => {
  const errorResult = doSth(false);

  expect(errorResult.isLeft()).toBe(true);
  expect(errorResult.isRight()).toBe(false);
});
