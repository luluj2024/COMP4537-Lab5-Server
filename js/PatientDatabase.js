// ChatGPT (https://chat.openai.com/) assisted with this assignment.
import mysql from 'mysql2/promise';
import { readFileSync } from 'node:fs';

export class PatientDatabase {
  constructor(env) {
    this.name = env.DB_NAME;
    const shared = {
      host: env.DB_HOST, port: Number(env.DB_PORT || 3306),
      connectionLimit: 3, multipleStatements: false, dateStrings: true,
      ssl: env.DB_SSL === 'true' ? { ca: readFileSync(new URL('../ca.pem', import.meta.url)), rejectUnauthorized: true } : undefined
    };
    this.writer = mysql.createPool({ ...shared,
      user: env.DB_WRITER_USER, password: env.DB_WRITER_PASSWORD });
    this.reader = mysql.createPool({ ...shared, database: this.name,
      user: env.DB_READER_USER, password: env.DB_READER_PASSWORD });
    this.patients = [ ['Sara Brown', '1901-01-01'], ['John Smith', '1941-01-01'],
      ['Jack Ma', '1961-01-30'], ['Elon Musk', '1999-01-01'] ];
  }
  async insertSamples() {
    await this.writer.query('CREATE DATABASE IF NOT EXISTS ' + mysql.escapeId(this.name));
    await this.writer.query(`CREATE TABLE IF NOT EXISTS ${mysql.escapeId(this.name)}.patient (
      patientid INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      dateOfBirth DATETIME NOT NULL
    ) ENGINE=InnoDB`);
    const [result] = await this.writer.execute(
      `INSERT INTO ${mysql.escapeId(this.name)}.patient (name, dateOfBirth) VALUES (?, ?), (?, ?), (?, ?), (?, ?)`,
      this.patients.flat());
    return result.affectedRows;
  }
  async select(sql) {
    const [rows, fields] = await this.reader.query(sql);
    return { columns: fields?.map(field => field.name) || [], rows };
  }
}
