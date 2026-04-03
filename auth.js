// ══════════════════════════════════════════════
//  TIPA FINTECH — Auth Logic (Supabase)
// ══════════════════════════════════════════════

const SUPA_URL = 'https://ebioqgjyzrhjxxlugzcz.supabase.co';
const SUPA_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImViaW9xZ2p5enJoanh4bHVnemN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI1NTEzMDQsImV4cCI6MjA4ODEyNzMwNH0._Hi_sSMqp3rKWoI1yqlZ2kzRiK_mIysaVA5vklGE1A8';

// Load Supabase dynamically
async function loadSupabase() {
  return new Promise((resolve, reject) => {
    if (window.supabase) { resolve(window.supabase.createClient(SUPA_URL, SUPA_KEY)); return; }
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.js';
    s.onload = () => resolve(window.supabase.createClient(SUPA_URL, SUPA_KEY));
    s.onerror = reject;
    document.head.appendChild(s);
  });
}

// ── UI Helpers ──────────────────────────────
function showMsg(type, text) {
  const err = document.getElementById('auth-err');
  const ok  = document.getElementById('auth-ok');
  if (!err || !ok) return;
  err.style.display = 'none'; ok.style.display = 'none';
  if (type === 'err') { err.textContent = text; err.style.display = 'block'; }
  if (type === 'ok')  { ok.textContent  = text; ok.style.display  = 'block'; }
}

function setLoading(btn, loading) {
  btn.disabled = loading;
  btn.innerHTML = loading
    ? '<div class="spin"></div> Chargement...'
    : btn.dataset.label || btn.innerHTML;
}

// ── APP URL — redirect after auth ──────────
// Change this to your deployed app URL
const APP_URL = '../tipa-app.html';

// ══════════════════════════════════════════════
//  SIGN IN
// ══════════════════════════════════════════════
async function initSignIn() {
  const form = document.getElementById('signin-form');
  if (!form) return;
  const btn = document.getElementById('signin-btn');
  btn.dataset.label = 'Se connecter →';

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('si-email').value.trim();
    const pass  = document.getElementById('si-pass').value;
    if (!email || !pass) { showMsg('err', 'Veuillez remplir tous les champs.'); return; }

    setLoading(btn, true);
    showMsg('', '');

    try {
      const sb = await loadSupabase();
      const { data, error } = await sb.auth.signInWithPassword({ email, password: pass });

      if (error) {
        showMsg('err',
          error.message.includes('Invalid') || error.message.includes('credentials')
            ? 'Email ou mot de passe incorrect.'
            : error.message
        );
        setLoading(btn, false);
        return;
      }

      // Verify agent exists
      const { data: agent, error: agErr } = await sb
        .from('agents').select('id,name,role,status').eq('id', data.user.id).single();

      if (agErr || !agent) {
        showMsg('err', 'Compte non associé à un agent. Contactez l\'administrateur.');
        await sb.auth.signOut();
        setLoading(btn, false);
        return;
      }

      if (agent.status === 'suspended') {
        showMsg('err', 'Votre compte a été suspendu. Contactez l\'administrateur.');
        await sb.auth.signOut();
        setLoading(btn, false);
        return;
      }

      showMsg('ok', `Bienvenue, ${agent.name} ! Redirection...`);
      setTimeout(() => { window.location.href = APP_URL; }, 900);

    } catch (err) {
      showMsg('err', 'Erreur réseau : ' + err.message);
      setLoading(btn, false);
    }
  });
}

// ══════════════════════════════════════════════
//  SIGN UP
// ══════════════════════════════════════════════
async function initSignUp() {
  const form = document.getElementById('signup-form');
  if (!form) return;
  const btn = document.getElementById('signup-btn');
  btn.dataset.label = 'Créer mon compte →';

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name  = document.getElementById('su-name').value.trim();
    const email = document.getElementById('su-email').value.trim();
    const pass  = document.getElementById('su-pass').value;
    const pass2 = document.getElementById('su-pass2').value;
    const role  = document.getElementById('su-role').value;

    if (!name || !email || !pass || !pass2 || !role) {
      showMsg('err', 'Veuillez remplir tous les champs.'); return;
    }
    if (pass.length < 8) {
      showMsg('err', 'Le mot de passe doit contenir au moins 8 caractères.'); return;
    }
    if (pass !== pass2) {
      showMsg('err', 'Les mots de passe ne correspondent pas.'); return;
    }

    setLoading(btn, true);
    showMsg('', '');

    try {
      const sb = await loadSupabase();

      // 1. Create auth user
      const { data: signUpData, error: signUpErr } = await sb.auth.signUp({
        email, password: pass,
        options: { data: { full_name: name } }
      });

      if (signUpErr) {
        showMsg('err',
          signUpErr.message.includes('already registered')
            ? 'Cet email est déjà utilisé. <a href="signin.html">Connectez-vous</a>'
            : signUpErr.message
        );
        setLoading(btn, false);
        return;
      }

      const userId = signUpData?.user?.id;
      if (!userId) {
        showMsg('err', 'Erreur de création du compte. Réessayez.');
        setLoading(btn, false);
        return;
      }

      // 2. Create agent record
      const coopId = 'aaaaaaaa-0000-0000-0000-000000000001'; // Coopérative Bosal
      const { error: agentErr } = await sb.from('agents').insert({
        id: userId,
        cooperative_id: coopId,
        name: name,
        email: email,
        role: role,
        status: 'active'
      });

      if (agentErr) {
        showMsg('err', 'Compte créé mais erreur agent : ' + agentErr.message);
        setLoading(btn, false);
        return;
      }

      showMsg('ok', '✅ Compte créé avec succès ! Redirection vers l\'application...');
      setTimeout(() => { window.location.href = APP_URL; }, 1400);

    } catch (err) {
      showMsg('err', 'Erreur : ' + err.message);
      setLoading(btn, false);
    }
  });
}

// ── Init on load ──
document.addEventListener('DOMContentLoaded', () => {
  initSignIn();
  initSignUp();
});
