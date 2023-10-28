import { Slug } from "./slug";

test("create slug from text", () => {
  const slug = Slug.createFromText(
    "Adquira: Taça Bubblejuice Classy - vale 350c",
  );

  expect(slug.value).toEqual("adquira-taca-bubblejuice-classy-vale-350c");
});
