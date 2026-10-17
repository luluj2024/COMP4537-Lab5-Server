// ChatGPT (https://chat.openai.com/) assisted with this assignment.
import { MESSAGES } from '../lang/messages/en/user.js';

export class PatientApi {
  constructor(database, clientOrigin) {
    this.database = database;
    this.clientOrigin = clientOrigin;
    this.endpoint = '/lab5/api/v1/sql';
  }
  respond(res, status, body, extra = {}) {
    res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store', ...extra });
    res.end(JSON.stringify(body));
  }
  async handle(req, res) {
    res.setHeader('Vary', 'Origin');
    if (req.headers.origin && req.headers.origin !== this.clientOrigin) {
      return this.respond(res, 403, { error: MESSAGES.origin });
    }
    if (req.headers.origin) res.setHeader('Access-Control-Allow-Origin', this.clientOrigin);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    let path;
    try { path = new URL(req.url, 'http://localhost').pathname; }
    catch { return this.respond(res, 400, { error: MESSAGES.invalidUrl }); }
    if (path !== this.endpoint && !path.startsWith(this.endpoint + '/')) {
      return this.respond(res, 404, { error: MESSAGES.notFound });
    }
    if (req.method === 'OPTIONS') { res.writeHead(204); return res.end(); }
    try {
      if (req.method === 'POST' && path === this.endpoint) {
        const inserted = await this.database.insertSamples();
        return this.respond(res, 201, { message: MESSAGES.inserted, inserted });
      }
      if (req.method === 'GET') {
        let sql;
        try { sql = decodeURIComponent(path.slice(this.endpoint.length + 1)); }
        catch { return this.respond(res, 400, { error: MESSAGES.invalidUrl }); }
        if (!sql.trim()) return this.respond(res, 400, { error: MESSAGES.invalidQuery });
        return this.respond(res, 200, await this.database.select(sql));
      }
      return this.respond(res, 405, { error: MESSAGES.method }, { Allow: 'GET, POST, OPTIONS' });
    } catch {
      return this.respond(res, 400, { error: MESSAGES.failed });
    }
  }
}
