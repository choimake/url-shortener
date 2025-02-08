import { test, expect } from 'vitest';
import { ShortId } from "./ShortId";

const BASE62_ALPHABET = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

// ShortIdの生成テスト
test("ShortId.generate() should generate a valid ShortId", () => {
  const shortId = ShortId.generate();

  // 以下の条件を満たす文字列は有効な短縮URL識別子
  // - 長さが8文字であること
  // - 文字列の内容がBASE62で使用可能な文字だけで構成されていること

  expect(shortId.toValue().length).toBe(8);
  expect([...shortId.toValue()].every((char) => BASE62_ALPHABET.includes(char))).toBe(true);
});

// ShortIdのバリデーションテスト
test("ShortId.isValid() should return true for valid ShortId", () => {

  // 以下の条件を満たす文字列は有効な短縮URL識別子
  // - 長さが8文字であること
  // - 文字列の内容がBASE62で使用可能な文字だけで構成されていること
  const validId = "A1B2C3D4";
  expect(ShortId.isValid(validId)).toBe(true);
})

test("ShortId.isValid() should return false for invalid ShortId", () => {

  // 長さが8文字でない短縮URL識別子は無効
  const invalidId = "A1B2C3D"; // 長さが足りない
  expect(ShortId.isValid(invalidId)).toBe(false);
});

test("ShortId.isValid() should return false for ShortId with invalid characters", () => {

  // BASE62で使用可能な文字以外の文字が含まれている短縮URL識別子は無効
  const invalidId = "A1B2C3D@"; // @ はBASE62で使用不可
  expect(ShortId.isValid(invalidId)).toBe(false);
});
