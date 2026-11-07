// "/" — the website (7 sections).
import { STORY, BIG_STAT_MIN, IS_DEPLOYED, COLORS } from "../config.js";
import { $, $$, esc, fmt, reduced, url, tween, flagged, avatar } from "../util.js";
import { previewCard } from "../ui.js";
import { getStats, getList, loadMembers, rank } from "../chain.js";

export function view() {
  return {
    title: "",
    html: `
<section class="hero wrap">
  <div class="hero__copy">
    <span class="eyebrow" data-hero-in>Waitlists that grow themselves</span>
    <h1 class="hero__h1" data-split>Get in line.</h1>
    <p class="hero__sub" data-hero-in>Make a launch waitlist in a minute. People join with their wallet, invite friends to move up, and every spot lives on BOT Chain.</p>
    <div class="row gap" data-hero-in>
      <a class="btn btn--lime btn--lg" href="${url("/app/new")}" data-link>Create a waitlist</a>
      <a class="btn btn--lilac btn--lg" href="${url("/#how")}" data-link>How it works</a>
    </div>
    <p class="hero__fine muted" data-hero-in>No emails · No backend · One transaction</p>
  </div>
  ${demoWidget()}
</section>

<section class="sec wrap" id="preview">
  <div class="split">
    <div data-reveal>
      <span class="eyebrow">See your launch page</span>
      <h2 class="h2">Type a name. Get a line.</h2>
      <p class="muted lead">This is exactly what people see when you share your link — countdown, live counter, one big button.</p>
      <form class="showme" data-showme>
        <input class="input input--lg" name="n" maxlength="40" placeholder="Your product name" aria-label="Your product name" autocomplete="off">
        <button class="btn btn--lime btn--lg" type="submit">Show me</button>
      </form>
      <div class="swatches" data-swatches aria-label="Cover colour">
        ${COLORS.map((c, i) => `<button type="button" class="swatch ${i === 0 ? "is-on" : ""}" style="--c:${c.hex}" data-c="${i}" aria-label="${c.key}"></button>`).join("")}
      </div>
    </div>
    <div class="preview-stage" data-reveal data-preview></div>
  </div>
</section>

<section class="sec wrap" id="how">
  <span class="eyebrow" data-reveal>How it works</span>
  <h2 class="h2" data-reveal>Three steps. Zero spreadsheets.</h2>
  <div class="cards3">
    <article class="card how" data-reveal>
      <span class="how__n mono">01</span><h3>Create</h3>
      <p class="muted">Name, pitch, launch date, reward. One transaction and your list is live on BOT Chain.</p>
      <div class="how__art"><span class="chip">🚀 Rocket</span><span class="chip chip--lime">tx ✓</span></div>
    </article>
    <article class="card how" data-reveal>
      <span class="how__n mono">02</span><h3>Share</h3>
      <p class="muted">You get a link, a QR code and a ready-made X post. Drop it anywhere.</p>
      <div class="how__art"><span class="chip mono">lineup/w/7</span><span class="chip chip--lilac">QR</span><span class="chip">𝕏</span></div>
    </article>
    <article class="card how" data-reveal>
      <span class="how__n mono">03</span><h3>Climb</h3>
      <p class="muted">Every friend who joins with your link moves you up 5 spots. Creators can tune the boost.</p>
      <div class="how__art"><span class="chip mono">#1,285</span><span class="arrow-up">↑</span><span class="chip chip--lime mono">#1,270</span></div>
    </article>
  </div>
</section>

<section class="sec wrap" id="story">
  <article class="story" data-reveal>
    <div class="story__media" aria-hidden="true">
      <div class="story__ticket"><span class="mono">ADMIT ONE</span><b class="mono" data-story-count>#—</b></div>
      <div class="story__glow"></div>
    </div>
    <div class="story__body">
      <div class="row gap-sm">${STORY.tags.map((t) => `<span class="tag">${esc(t)}</span>`).join("")}</div>
      <h2 class="h3" data-story-title>${esc(STORY.title)}</h2>
      <div class="story__nums">
        <div><b class="mono" data-story-n="count">—</b><span>in line</span></div>
        <div><b class="mono" data-story-n="share">—</b><span>came from invites</span></div>
        <div><b class="mono" data-story-n="top">—</b><span>top inviter's friends</span></div>
      </div>
      ${STORY.quote ? `<blockquote class="story__quote">“${esc(STORY.quote)}”<cite>— ${esc(STORY.maker)}</cite></blockquote>` : `<p class="muted">Real numbers from a real waitlist, read live from the contract — no invented customers.</p>`}
      <a class="btn btn--lilac" href="${STORY.listId != null ? url(`/w/${STORY.listId}`) : url("/app/new")}" data-link>${STORY.listId != null ? "Join this line" : "Start yours"}</a>
    </div>
  </article>
</section>

<section class="sec wrap bigstat" id="stat" data-bigstat hidden>
  <p class="bigstat__n mono"><span data-bigstat-n>0</span></p>
  <p class="bigstat__l">spots claimed on BOT Chain</p>
</section>

<section class="sec wrap" id="fair">
  <span class="eyebrow" data-reveal>Built fair</span>
  <h2 class="h2" data-reveal>Nobody cuts the line.</h2>
  <div class="cards4">
    <article class="card fair" data-reveal><span class="fair__ic">⛓</span><h3>Spots on-chain</h3><p class="muted">Every join is a transaction. Order is set by the chain, not a database.</p></article>
    <article class="card fair" data-reveal><span class="fair__ic">✉︎</span><h3>No emails needed</h3><p class="muted">Wallet only. No names, no inboxes, no personal data collected.</p></article>
    <article class="card fair" data-reveal><span class="fair__ic">⊘</span><h3>No self-referrals</h3><p class="muted">The contract ignores you as your own referrer and anyone not already in line.</p></article>
    <article class="card fair" data-reveal><span class="fair__ic">⇩</span><h3>Export your list</h3><p class="muted">Download position, wallet, join time and referrals as CSV for early access.</p></article>
  </div>
  <details class="card ranking" id="ranking" data-reveal>
    <summary><span class="ranking__plus">+</span> How ranking works</summary>
    <div class="ranking__body">
      <ol>
        <li><b>Join number</b> = the order you joined (1, 2, 3…).</li>
        <li><b>Counted referrals</b> = min(friends who joined with your link, cap). Default cap is 20.</li>
        <li><b>Position score</b> = max(1, join number − boost × counted referrals). Default boost is 5.</li>
        <li>Everyone is sorted by score; ties go to whoever joined first.</li>
      </ol>
      <p class="mono formula">score = max(1, joinNo − boost × min(refs, cap))</p>
      <p class="muted">Optional rule: creators can require joiners to hold at least 0.001 BOT, which makes throwaway wallets a bit harder. Spots are wallet-based. Lineup is for fun and early access, not money.</p>
    </div>
  </details>
  <div class="faq" id="faq">
    <h3 class="h3" data-reveal>FAQ</h3>
    ${faq("Do people need crypto to join?", "They need a wallet like MetaMask on BOT Chain and a tiny bit of BOT for gas. Some lists also require holding 0.001 BOT.")}
    ${faq("Can the creator change positions?", "No. The contract has no admin and no edit function. Creators can only close the list, which freezes everyone's final spot.")}
    ${faq("What happens on launch day?", "The creator closes the list. The page switches to “Launched 🎉 — final line” and the CSV export is the early-access list.")}
    ${faq("Is my spot worth money?", "No. Spots are wallet-based and meant for fun and early access — there are no payments or tokens in Lineup.")}
    ${faq("Where is the data stored?", "On BOT Chain. The site is a static page that reads the contract directly — there's no backend.")}
  </div>
</section>

<section class="sec wrap closing" data-reveal>
  <h2 class="closing__h">Every launch starts with a line.</h2>
  <a class="btn btn--lime btn--lg" href="${url("/app/new")}" data-link>Create a waitlist</a>
</section>`,
    mount,
  };
}

const faq = (q, a) => `<details class="faq__item" data-reveal><summary>${esc(q)}<span aria-hidden="true">+</span></summary><p class="muted">${esc(a)}</p></details>`;

function demoWidget() {
  const rows = [
    ["0x7a3f…c210", 1262], ["0x19be…04af", 1266], ["0xd4c1…9e7b", 1271], ["0x55e0…a1c3", 1278], ["you", 1285],
  ];
  return `<div class="demo" data-demo data-hero-in aria-label="Demo">
    <div class="demo__bar">
      <div class="tabs" role="tablist">
        <button class="tab is-on" role="tab" data-tab="join">Join</button>
        <button class="tab" role="tab" data-tab="invite">Invite</button>
        <button class="tab" role="tab" data-tab="climb">Climb</button>
      </div>
      <span class="demo__timer mono" data-demo-timer>02:14:09:00</span>
    </div>
    <div class="demo__stage">
      <div class="demo__pane is-on" data-pane="join">
        <div class="printer"><div class="printer__slot"></div>
          <div class="printer__paper" data-paper>
            <div class="mini-ticket">
              <span class="mono muted">ROCKET · ADMIT ONE</span>
              <b class="mono">#1,285</b>
              <div class="mini-ticket__tear"></div>
              <span class="mini-ticket__bar"></span>
            </div>
          </div>
        </div>
        <p class="demo__cap">Join with your wallet → you get a numbered ticket.</p>
      </div>
      <div class="demo__pane" data-pane="invite">
        <div class="demo-invite">
          <div class="demo-invite__field mono"><span>lineup.app/w/7?ref=0xAB…</span><b data-copied>Copy</b></div>
          <div class="demo-invite__friends">
            ${[0, 1, 2].map((i) => `<span class="demo-av" data-av>${avatar("0x" + ["a1b2c3", "77ee10", "f04d9a"][i])}</span>`).join("")}
            <span class="demo-invite__plus mono" data-av>+15 spots</span>
          </div>
        </div>
        <p class="demo__cap">Share your link. Each friend who joins moves you up 5.</p>
      </div>
      <div class="demo__pane" data-pane="climb">
        <ol class="lb lb--demo" data-lb>
          ${rows.map(([a, n]) => `<li class="lb__row ${a === "you" ? "is-you" : ""}" data-row="${a}"><span class="mono">${a === "you" ? "You" : a}</span><b class="mono" ${a === "you" ? "data-you" : ""}>#${fmt(n)}</b></li>`).join("")}
        </ol>
        <p class="demo__cap">Your spot rolls down as friends join.</p>
      </div>
    </div>
    <div class="demo__progress"><span data-progress></span></div>
  </div>`;
}

async function mount(root) {
  const stops = [];
  const R = reduced();

  // hero entrance
  if (window.gsap && !R) {
    const h1 = $("[data-split]", root);
    if (window.SplitText) {
      const st = SplitText.create(h1, { type: "chars,words" });
      gsap.from(st.chars, { yPercent: 110, opacity: 0, stagger: 0.035, duration: 0.8, ease: "power4.out" });
    }
    gsap.from($$("[data-hero-in]", root), { y: 24, opacity: 0, stagger: 0.08, duration: 0.8, delay: 0.2, ease: "power3.out" });
  }
  // section reveals
  if (window.gsap && window.ScrollTrigger && !R) {
    ScrollTrigger.batch($$("[data-reveal]", root), {
      start: "top 88%",
      once: true,
      onEnter: (els) => gsap.fromTo(els, { y: 28, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.08, duration: 0.7, ease: "power3.out" }),
    });
    gsap.set($$("[data-reveal]", root), { opacity: 0 });
  }

  stops.push(runDemo(root));

  // "Show me" preview
  let color = 0;
  const stage = $("[data-preview]", root);
  const launch = Math.floor(Date.now() / 1000) + 14 * 86400 + 3 * 3600;
  const show = (name) => {
    const n = flagged(name) ? "" : name;
    stage.innerHTML = previewCard({ name: n || "Your product", pitch: n ? `${n} is launching soon. Get in line early.` : "", icon: "🚀", color, launchAt: launch, reward: "First 100 get early access" }, { count: 0 });
    if (window.gsap && !R) gsap.from(stage.firstElementChild, { y: 20, opacity: 0, scale: 0.98, duration: 0.5, ease: "power3.out" });
  };
  show("");
  $("[data-showme]", root).addEventListener("submit", (e) => { e.preventDefault(); show(e.target.n.value.trim()); });
  $$("[data-swatches] .swatch", root).forEach((b) =>
    b.addEventListener("click", () => {
      $$("[data-swatches] .swatch", root).forEach((x) => x.classList.toggle("is-on", x === b));
      color = Number(b.dataset.c);
      show($("[data-showme] input", root).value.trim());
    })
  );

  // big stat + story (real numbers only)
  if (IS_DEPLOYED) {
    getStats().then((s) => {
      if (s.spots < BIG_STAT_MIN) return;
      const sec = $("[data-bigstat]", root);
      sec.hidden = false;
      const n = $("[data-bigstat-n]", sec);
      if (window.ScrollTrigger && !R) ScrollTrigger.create({ trigger: sec, start: "top 80%", once: true, onEnter: () => tween(n, s.spots, { duration: 2 }) });
      else n.textContent = fmt(s.spots);
      window.ScrollTrigger?.refresh();
    }).catch(() => {});
    if (STORY.listId != null) {
      getList(STORY.listId).then(async (l) => {
        const m = await loadMembers(l.id, l.count);
        const r = rank(l, m);
        const fromInvites = r.rows.filter((x) => x.referrer && !/^0x0{40}$/i.test(x.referrer)).length;
        $("[data-story-title]", root).textContent = `${l.icon} ${l.name}`;
        $('[data-story-n="count"]', root).textContent = fmt(l.count);
        $('[data-story-n="share"]', root).textContent = l.count ? `${Math.round((fromInvites / l.count) * 100)}%` : "0%";
        $('[data-story-n="top"]', root).textContent = fmt(r.inviters[0]?.refs || 0);
        $("[data-story-count]", root).textContent = `#${fmt(l.count)}`;
      }).catch(() => {});
    }
  }

  return () => stops.forEach((f) => f && f());
}

// ── hero demo: Join · Invite · Climb ──
function runDemo(root) {
  const demo = $("[data-demo]", root);
  if (!demo) return;
  const tabs = $$(".tab", demo), panes = $$(".demo__pane", demo);
  const order = ["join", "invite", "climb"];
  let idx = 0, tl, cycle, alive = true;
  const R = reduced();

  // running countdown
  let left = 2 * 86400 + 14 * 3600 + 9 * 60;
  const timerEl = $("[data-demo-timer]", demo);
  const p2 = (n) => String(n).padStart(2, "0");
  const tick = () => { left = Math.max(0, left - 1); timerEl.textContent = `${p2(Math.floor(left / 86400))}:${p2(Math.floor((left % 86400) / 3600))}:${p2(Math.floor((left % 3600) / 60))}:${p2(left % 60)}`; };
  const timer = setInterval(tick, 1000); tick();

  const play = (name) => {
    tl?.kill();
    tabs.forEach((t) => t.classList.toggle("is-on", t.dataset.tab === name));
    panes.forEach((p) => p.classList.toggle("is-on", p.dataset.pane === name));
    const pane = $(`[data-pane="${name}"]`, demo);
    if (!window.gsap) return;
    tl = gsap.timeline();
    const prog = $("[data-progress]", demo);
    tl.fromTo(prog, { scaleX: 0 }, { scaleX: 1, duration: R ? 0.01 : 4.6, ease: "none" }, 0);
    if (R) return;
    if (name === "join") {
      tl.fromTo($("[data-paper]", pane), { yPercent: -102 }, { yPercent: 0, duration: 1.4, ease: "steps(14)" }, 0.2)
        .fromTo($(".mini-ticket b", pane), { scale: 0.6, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(2.5)" }, 1.5);
    } else if (name === "invite") {
      const copied = $("[data-copied]", pane);
      copied.textContent = "Copy";
      tl.fromTo($(".demo-invite__field", pane), { scale: 1 }, { scale: 0.97, duration: 0.12, yoyo: true, repeat: 1 }, 0.4)
        .add(() => (copied.textContent = "Copied ✓"), 0.5)
        .fromTo($$("[data-av]", pane), { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, stagger: 0.3, duration: 0.45, ease: "back.out(3)" }, 0.9);
    } else if (name === "climb") {
      const lb = $("[data-lb]", pane), you = $('[data-row="you"]', lb), num = $("[data-you]", lb);
      // reset order
      lb.append(you); num.textContent = "#1,285";
      const o = { v: 1285 };
      tl.to(o, { v: 1270, duration: 1.2, ease: "power2.inOut", onUpdate: () => (num.textContent = `#${fmt(Math.round(o.v))}`) }, 0.5)
        .add(() => {
          if (!window.Flip) { lb.insertBefore(you, lb.children[2]); return; }
          const state = Flip.getState($$(".lb__row", lb));
          lb.insertBefore(you, lb.children[2]);
          Flip.from(state, { duration: 0.7, ease: "power3.inOut" });
        }, 1.8);
    }
  };
  const next = () => { if (!alive) return; idx = (idx + 1) % order.length; play(order[idx]); };
  tabs.forEach((t) => t.addEventListener("click", () => { idx = order.indexOf(t.dataset.tab); play(t.dataset.tab); restart(); }));
  const restart = () => { clearInterval(cycle); cycle = setInterval(next, 5000); };
  play("join"); restart();
  return () => { alive = false; clearInterval(cycle); clearInterval(timer); tl?.kill(); };
}
