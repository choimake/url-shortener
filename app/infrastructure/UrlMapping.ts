import sqlite3 from "sqlite3";
import { UrlMapping, UrlMappingRepository } from "~/domain/shorten_url/UrlMapping";

const { Database } = sqlite3;

export class SQLiteUrlMappingRepository implements UrlMappingRepository {
  private db: sqlite3.Database;

  constructor(databaseFilePath: string) {
    this.db = new Database(databaseFilePath);
    this.initialize();
  }

  private initialize() {
    this.db.run(`
      CREATE TABLE IF NOT EXISTS url_mappings (
        shortId TEXT PRIMARY KEY,
        originalUrl TEXT NOT NULL UNIQUE
      )
    `);
  }

  save(shortId: string, originalUrl: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.run(
        `INSERT INTO url_mappings (shortId, originalUrl) VALUES (?, ?)`,
        [shortId, originalUrl],
        (err) => {
          if (err) {
            reject(new Error("Failed to save URL mapping: " + err.message));
            return;
          }
          resolve();
        }
      );
    });
  }

  async findByOriginalUrl(originalUrl: string): Promise<UrlMapping | null> {
    return new Promise((resolve, reject) => {
      this.db.get(
        `SELECT * FROM url_mappings WHERE originalUrl = ?`,
        [originalUrl],
        (err, row) => {
          if (err) {
            reject(new Error("Failed to find URL mapping: " + err.message));
            return;
          }
          resolve(row ? (row as UrlMapping) : null);
        }
      );
    });
  }

  async findByShortId(shortId: string): Promise<UrlMapping | null> {
    return new Promise((resolve, reject) => {
      this.db.get(
        `SELECT * FROM url_mappings WHERE shortId = ?`,
        [shortId],
        (err, row) => {
          if (err) {
            reject(new Error("Failed to find URL mapping: " + err.message));
            return;
          }
          resolve(row ? (row as UrlMapping) : null);
        }
      );
    });
  }

}
