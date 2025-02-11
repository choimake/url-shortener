import { customAlphabet } from "nanoid";

/**
 * 短縮URLを構成する識別子
 */
export class ShortId {

  // NOTE:
  // URLで使用できる文字種は、英数字と一部の記号のみであるため、URLに確実に使用可能な62進数を使用して短縮URL識別子を生成
  // 短縮URLの場合、文字列の長さが短いほど利用者にとって扱いやすいので、長すぎないようにする必要がある
  // 今回は8文字を採用、理由は以下
  //   - 8文字の場合、62進数のアルファベットを使用しているため、62^8 = 218,340,105,584,896 通りの組み合わせが可能
  //   - 1日あたり10,000件の短縮URLを発行するとしても、約21,834,010日分 = 59819年間、短縮URLの発行が可能で実用に一定耐えうる値だと判断
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

  /**
   * 短縮URL識別子の生成
   */
  static generate(): ShortId {
    return new ShortId(this.nanoid());
  }

  /**
   * 短縮URL識別子のバリデーション
   * @param {string} id 検証する短縮URL識別子
   * @returns {boolean} 有効なら true, 無効なら false
   */
  static isValid(id: string): boolean {
    return id.length === ShortId.ID_LENGTH && [...id].every((char) => ShortId.BASE62_ALPHABET.includes(char));
  }

  public toValue(): string {
    return this.value;
  }
}
