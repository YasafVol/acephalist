/* PM Superpowers chart
   Replace the DATA block below with your actual roles, contributions and evidence.
   No libraries required. */

"use strict";

// ======== DATA: EDIT THIS ========
const MAX = 10;
const powers = ["Craft","Growth","Domain","Market","Organizational","Team"];

// roles ordered from earliest to latest
const roles = [
  { id:"hapoalim", label:"Bank Hapoalim" },
  { id:"eldritch", label:"Eldritch Foundry" },
  { id:"wix",      label:"Wix" }
];

// contribution deltas by role and power (values 0..MAX)
const contributions = {
  hapoalim: { Craft:2.0, Growth:1.0, Domain:3.0, Market:0.8, Organizational:2.2, Team:1.0 },
  eldritch: { Craft:1.5, Growth:2.5, Domain:1.0, Market:1.3, Organizational:1.2, Team:1.5 },
  wix:      { Craft:2.0, Growth:3.0, Domain:0.5, Market:2.0, Organizational:2.0, Team:2.5 }
};

// optional evidence for tooltips
const evidence = {
  hapoalim: {
    Growth: "Launched onboarding flow; +12% activation at p90 CI.",
    Organizational: "Coordinated 5 teams across compliance, data, mobile.",
    Domain: "Payments & KYC constraints; led AML change."
  },
  eldritch: {
    Craft: "Prototyped creator editor; cut TTFHW by 40%.",
    Growth: "Built referral loop; 1.6x WAU in 90 days.",
    Market: "Positioning pivot to ‘tabletop creators’ segment."
  },
  wix: {
    Growth: "Pricing test: +6.3% ARPPU with guardrails intact.",
    Market: "Competitive teardown → feature kill list shipped.",
    Team: "Mentored 3 PMs; two promoted within 12 months."
  }
};
// ======== END DATA ========

const controls = document.querySelector(".controls");
const legend   = document.querySelector(".legend");
const chart    = document.getElementById("chart");
const tip      = document.getElementById("tip");

const views = [{id:"overall", label:"My Super Powers"}, ...roles];

const colorVars = ["--r1","--r2","--r3","--r4","--r5","--r6"];
const colorForIndex = idx =>
  getComputedStyle(document.documentElement)
    .getPropertyValue(colorVars[idx % colorVars.length])
    .trim();

function clamp(v, min, max){ return Math.max(min, Math.min(max, v)); }
const pct = v => `${(clamp(v,0,MAX) / MAX) * 100}%`;

function totalsForAllRoles(){
  const totals = Object.fromEntries(powers.map(p => [p,0]));
  roles.forEach(r => {
    powers.forEach(p => { totals[p] += (contributions[r.id]?.[p] || 0); });
  });
  powers.forEach(p => totals[p] = clamp(totals[p], 0, MAX));
  return totals;
}

function buildControls(){
  views.forEach((v, i) => {
    const id = `opt-${v.id}`;
    const wrap = document.createElement("label");
    wrap.innerHTML = `<input type="radio" name="view" id="${id}" value="${v.id}" ${i===0?"checked":""} />
                      <span>${v.label}</span>`;
    controls.appendChild(wrap);
  });
  controls.addEventListener("change", e => {
    const id = e.target?.value;
    if(!id) return;
    hideTip();
    render(id);
  });
}

function buildLegend(){
  roles.forEach((r, i) => {
    const el = document.createElement("span");
    el.className = "key";
    el.innerHTML = `<span class="swatch" style="background:${colorForIndex(i)}"></span>${r.label}`;
    legend.appendChild(el);
  });
}

function addTicks(track){
  const t = document.createElement("div");
  t.className = "ticks";
  for(let i=1;i<MAX;i++){
    const mark = document.createElement("i");
    mark.style.left = `${(i/MAX)*100}%`;
    t.appendChild(mark);
  }
  track.appendChild(t);
}

// tooltip helpers
function showTip(html, x, y){
  if(!html) return;
  tip.innerHTML = html;
  tip.style.left = (x + 12) + "px";
  tip.style.top  = (y + 12) + "px";
  tip.style.display = "block";
  tip.setAttribute("aria-hidden","false");
}
function hideTip(){
  tip.style.display = "none";
  tip.setAttribute("aria-hidden","true");
}

function render(viewId){
  chart.innerHTML = "";
  const totals = totalsForAllRoles();

  powers.forEach(power => {
    // left label
    const label = document.createElement("div");
    label.className = "label";
    label.textContent = power.toLowerCase();
    chart.appendChild(label);

    // right track
    const track = document.createElement("div");
    track.className = "track";
    track.setAttribute("role","img");
    track.setAttribute("aria-label", `${power} bar`);
    addTicks(track);

    if(viewId === "overall"){
      let running = 0;

      // stacked segments per role
      roles.forEach((r, i) => {
        const val = contributions[r.id]?.[power] || 0;
        if(val <= 0) return;
        const seg = document.createElement("div");
        seg.className = "segment has-tip";
        seg.dataset.role = r.id;
        seg.style.left = pct(running);
        seg.style.width = pct(val);
        seg.style.background = colorForIndex(i);

        const ev = evidence[r.id]?.[power];
        const html = `<h4>${r.label} → ${power}</h4><p>${ev ? ev : "No notes yet."}</p><p>Δ +${val.toFixed(1)} (of ${MAX})</p>`;
        seg.addEventListener("mouseenter", e => showTip(html, e.clientX, e.clientY));
        seg.addEventListener("mousemove",  e => showTip(html, e.clientX, e.clientY));
        seg.addEventListener("mouseleave", hideTip);

        track.appendChild(seg);
        running += val;
      });

      const num = document.createElement("div");
      num.className = "num";
      num.textContent = totals[power].toFixed(1);
      track.appendChild(num);

    } else {
      // single role’s contribution view
      const roleIdx = roles.findIndex(r => r.id === viewId);
      const val = contributions[viewId]?.[power] || 0;

      if(val > 0){
        const seg = document.createElement("div");
        seg.className = "segment has-tip";
        seg.dataset.role = viewId;
        seg.style.left = 0;
        seg.style.width = pct(val);
        seg.style.background = colorForIndex(roleIdx);

        const ev = evidence[viewId]?.[power];
        const html = `<h4>${roles[roleIdx].label} → ${power}</h4><p>${ev ? ev : "No notes yet."}</p><p>Δ +${val.toFixed(1)} (of ${MAX})</p>`;
        seg.addEventListener("mouseenter", e => showTip(html, e.clientX, e.clientY));
        seg.addEventListener("mousemove",  e => showTip(html, e.clientX, e.clientY));
        seg.addEventListener("mouseleave", hideTip);

        track.appendChild(seg);
      }

      // cap indicator for context
      const cap = document.createElement("div");
      cap.className = "cap";
      track.appendChild(cap);

      const num = document.createElement("div");
      num.className = "num";
      num.textContent = `+${val.toFixed(1)}`;
      track.appendChild(num);
    }

    chart.appendChild(track);
  });
}

// init
buildControls();
buildLegend();
render("overall");
