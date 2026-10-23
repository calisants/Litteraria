// Edge Function «poke» do Litteraria: envia a notificação de cutucada.
// Fluxo: o app chama esta função com o login da pessoa -> o banco confere amizade/limites (friends_poke) -> aqui enviamos o Web Push.
// Segredos necessários (Edge Functions -> Secrets): VAPID_PUBLIC, VAPID_PRIVATE, VAPID_SUBJECT (mailto:...). Os outros vêm prontos do Supabase.
import { createClient } from "npm:@supabase/supabase-js@2";
import webpush from "npm:web-push@3.6.7";

const CORS = { "access-control-allow-origin": "*", "access-control-allow-headers": "authorization, apikey, content-type, x-client-info", "access-control-allow-methods": "POST, OPTIONS" };
const out = (code, obj) => new Response(JSON.stringify(obj), { status: code, headers: { ...CORS, "content-type": "application/json" } });
const MSGS = ["Bora estudar um pouquinho hoje?", "Uma lição curta agora? Eu estou indo!", "Cinco minutinhos já contam. Vamos?", "Que tal uma palavra nova hoje?"];

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: CORS });
  if (req.method !== "POST") return out(405, { error: "método" });
  try {
    const url = Deno.env.get("SUPABASE_URL");
    const service = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const anon = Deno.env.get("SUPABASE_ANON_KEY") || req.headers.get("apikey") || "";
    const token = (req.headers.get("authorization") || "").replace(/^Bearer\s+/i, "");
    if (!token) return out(401, { error: "sem login" });
    const admin = createClient(url, service, { auth: { persistSession: false } });
    const { data: u, error: ue } = await admin.auth.getUser(token);
    if (ue || !u || !u.user) return out(401, { error: "login inválido" });
    const body = await req.json().catch(() => ({}));
    const uid = String(body.uid || "");
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(uid)) return out(400, { error: "pessoa inválida" });

    // o banco confere amizade, bloqueio, preferência, limites e registra a cutucada, no nome de quem chamou
    const user = createClient(url, anon, { global: { headers: { Authorization: "Bearer " + token } }, auth: { persistSession: false } });
    const { data: r, error: re } = await user.rpc("friends_poke", { p_uid: uid });
    if (re) return out(500, { error: "banco", detail: String(re.message || "").slice(0, 120) });
    if (!r || r.status !== "ok") return out(200, { status: (r && r.status) || "nao_amigo" });

    const { data: subs } = await admin.from("push_subs").select("endpoint,p256dh,auth").eq("user_id", uid);
    webpush.setVapidDetails(Deno.env.get("VAPID_SUBJECT"), Deno.env.get("VAPID_PUBLIC"), Deno.env.get("VAPID_PRIVATE"));
    const text = MSGS[Math.floor(Math.random() * MSGS.length)];
    const payload = JSON.stringify({ t: "👋 " + r.nick + " te cutucou", b: text, go: "hoje" });
    let sent = 0;
    for (const s of subs || []) {
      try {
        await webpush.sendNotification({ endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } }, payload, { TTL: 3600, urgency: "normal" });
        sent++;
      } catch (e) {
        if (e && (e.statusCode === 404 || e.statusCode === 410)) await admin.from("push_subs").delete().eq("endpoint", s.endpoint);
      }
    }
    if (sent === 0) {
      await admin.rpc("poke_undo", { p_sender: u.user.id, p_receiver: uid });
      return out(200, { status: "falhou" });
    }
    return out(200, { status: "ok", sent });
  } catch (e) {
    return out(500, { error: "erro", detail: String((e && e.message) || e).slice(0, 120) });
  }
});
