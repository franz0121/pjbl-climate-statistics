import { randomUUID } from 'node:crypto';

(async ()=>{
  const url = 'https://sxnbiecxcyebzgrjuudv.supabase.co/rest/v1';
  const anon = 'sb_publishable_jSSuzzNQKAg3kyZ_vudp0Q_OVwB3UXb';
  const id = randomUUID();
  const user = { id: id, name: 'automation-test-user', email: `automation+${Date.now()}@example.com`, role: 'student' };
  try {
    let r = await fetch(url + '/users', { method: 'POST', headers: { apikey: anon, 'Authorization': 'Bearer ' + anon, 'Content-Type': 'application/json', 'Prefer': 'return=representation' }, body: JSON.stringify(user) });
    let t = await r.text();
    console.log('create user', r.status, t);
    if (r.status >= 400) throw new Error('user create failed');
    const responsePayload = { student_id: id, question_id: 'q-automation-1', choice: 'A', is_correct: false };
    r = await fetch(url + '/responses', { method: 'POST', headers: { apikey: anon, 'Authorization': 'Bearer ' + anon, 'Content-Type': 'application/json', 'Prefer': 'return=representation' }, body: JSON.stringify(responsePayload) });
    t = await r.text();
    console.log('create response', r.status, t);
  } catch (e) {
    console.error('ERROR', e);
  }
})();
