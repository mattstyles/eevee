import { str, obj } from "./index";

test("Should be a string", () => {
  expect(typeof str).toBe("string");
});

test("Obj should have stuff in it", () => {
  expect(obj.foo).toBe(str);
  expect(obj.bar).toBe(23);
});
