// ChatGPT (https://chat.openai.com/) assisted with this assignment.
import http from 'node:http';
import { PatientDatabase } from './PatientDatabase.js';
import { PatientApi } from './PatientApi.js';

export class Application {
  constructor(env) {
    this.port = Number(env.PORT || 3000);
    this.database = new PatientDatabase(env);
    this.api = new PatientApi(this.database, new URL(env.CLIENT_ORIGIN).origin);
    this.server = http.createServer((req, res) => this.api.handle(req, res));
  }
  start() {
    this.server.listen(this.port, '0.0.0.0');
  }
}
