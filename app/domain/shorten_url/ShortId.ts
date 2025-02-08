import { customAlphabet } from "nanoid";

/**
 * 短縮URLを構成する識別子
 */
export class ShortId {
  private static readonly ID_LENGTH = 8; // 値の長さ
  private static readonly BASE62_ALPHABET = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  private static readonly nanoid = customAlphabet(ShortId.BASE62_ALPHABET, ShortId.ID_LENGTH);

  private readonly value: string;

  private constructor(id: string) {
    if (!ShortId.isValid(id)) {
      throw new Error(`Invalid ShortId: "${id}"`);
    }
    this.value = id;
  }

  static generate(): ShortId {
    return new ShortId(this.nanoid());
  }

  /**
   * 短縮IDのバリデーション
   * @param {string} id 検証する短縮ID
   * @returns {boolean} 有効なら true, 無効なら false
   */
  static isValid(id: string): boolean {
    return id.length === ShortId.ID_LENGTH && [...id].every((char) => ShortId.BASE62_ALPHABET.includes(char));
  }

  public toValue(): string {
    return this.value;
  }
}
