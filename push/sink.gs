/* Litteraria: caixa de inscrições para notificações (Google Apps Script).
   Guarda, por aparelho: endereço de envio (da Apple/Google/Mozilla), horário, estilo, idioma e se já estudou hoje.
   NÃO guarda nome, e-mail nem progresso. Veja push/LEIA-ME.md para publicar. */
const KEY = '__SINK_KEY__';
const HEAD = ['id', 'sub', 'h', 'tz', 'st', 'ln', 'done', 'sent', 'upd'];
const HOSTS = [/^fcm\.googleapis\.com$/, /^updates\.push\.services\.mozilla\.com$/, /(^|\.)push\.apple\.com$/, /(^|\.)notify\.windows\.com$/];

function sheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName('inscricoes');
  if (!sh) { sh = ss.insertSheet('inscricoes'); sh.appendRow(HEAD); }
  return sh;
}
function ok_(sub) {
  try {
    if (!sub || typeof sub.endpoint !== 'string' || sub.endpoint.length > 600) return false;
    const m = sub.endpoint.match(/^https:\/\/([^\/:?#]+)(?::\d+)?\//);
    if (!m || !HOSTS.some(r => r.test(m[1]))) return false;
    return !!(sub.keys && sub.keys.p256dh && sub.keys.auth);
  } catch (e) { return false; }
}
function out_(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }
function find_(sh, id) {
  const v = sh.getDataRange().getValues();
  for (let i = 1; i < v.length; i++) if (String(v[i][0]) === id) return i + 1;
  return 0;
}
function doPost(e) {
  const lock = LockService.getScriptLock(); lock.waitLock(20000);
  try {
    const d = JSON.parse(e.postData.contents), sh = sheet_(), id = String(d.id || '');
    if (!/^[A-Za-z0-9_-]{8,80}$/.test(id)) return out_({ ok: false });
    if (d.a === 'del') { const r = find_(sh, id); if (r) sh.deleteRow(r); return out_({ ok: true }); }
    if (d.a !== 'sub' || !ok_(d.sub)) return out_({ ok: false });
    const h = parseInt(d.h, 10), tz = parseInt(d.tz, 10);
    if (!(h >= 0 && h <= 23) || !(tz >= -900 && tz <= 900)) return out_({ ok: false });
    const st = ['anim', 'calma', 'cartao'].indexOf(d.st) >= 0 ? d.st : 'anim';
    const ln = String(d.ln || '').slice(0, 20), done = /^\d{4}-\d{2}-\d{2}$/.test(d.done || '') ? d.done : '';
    const r = find_(sh, id), now = new Date().toISOString();
    if (r) { const old = sh.getRange(r, 8).getValue(); sh.getRange(r, 1, 1, 9).setValues([[id, JSON.stringify(d.sub), h, tz, st, ln, done, old, now]]); }
    else sh.appendRow([id, JSON.stringify(d.sub), h, tz, st, ln, done, '', now]);
    return out_({ ok: true });
  } finally { lock.releaseLock(); }
}
function doGet(e) {
  const p = e.parameter || {};
  if (p.k !== KEY) return out_({ ok: false });
  const lock = LockService.getScriptLock(); lock.waitLock(20000);
  try {
    const sh = sheet_();
    if (p.a === 'list') {
      const v = sh.getDataRange().getValues(), rows = [];
      for (let i = 1; i < v.length; i++) rows.push({ id: String(v[i][0]), sub: v[i][1], h: v[i][2], tz: v[i][3], st: v[i][4], ln: v[i][5], done: String(v[i][6]), sent: String(v[i][7]) });
      return out_({ ok: true, rows: rows });
    }
    const id = String(p.id || ''), r = find_(sh, id);
    if (!r) return out_({ ok: true });
    if (p.a === 'mark') sh.getRange(r, 8).setValue(String(p.d || ''));
    else if (p.a === 'del') sh.deleteRow(r);
    return out_({ ok: true });
  } finally { lock.releaseLock(); }
}
