// CTRL + Faith – app.js v2

// ----- SITE DATA -----
const SITE_DATA = {
  group: {
    name: "CTRL + Faith – God in Control",
    tagline: "Gaming, Building, Serving Together",
    season: "Fall 2025",
    dates: { start: "2025-09-14", end: "2025-11-20" },
    discord_url: "#", // TODO: put your Discord invite here
    contact_email: "zacharyjones13@gmail.com",
    church: {
      name: "Church for the One",
      website: "https://churchforthe.one",
      services: [
        { day: "Sunday", time: "9:00 AM", location: "Main Campus" },
        { day: "Sunday", time: "11:00 AM", location: "Main Campus" },
        { day: "Sunday", time: "5:00 PM", location: "Evening Service" }
      ]
    }
  },
  games: [
    {
      name: "Rocket League",
      crossplay: true,
      platforms: ["PC","Xbox","PlayStation","Switch"],
      notes: "Free via Epic; full cross-play.",
      prep: ["Create/Link Epic account","Complete tutorial","Enable cross-play in settings"]
    },
    {
      name: "Among Us",
      crossplay: true,
      platforms: ["PC","Xbox","PlayStation","Switch","Mobile"],
      notes: "Low hardware needs.",
      prep: ["Install on your device","Test mic in Discord"]
    },
    {
      name: "Minecraft (Bedrock)",
      crossplay: true,
      platforms: ["PC","Xbox","PlayStation","Switch","Mobile"],
      notes: "Ensure everyone uses Bedrock Edition for cross-play.",
      prep: ["Sign into Microsoft account","Add realm/server if provided"]
    },
    {
      name: "Fortnite Creative",
      crossplay: true,
      platforms: ["PC","Xbox","PlayStation","Switch","Cloud/Mobile"],
      notes: "Creative maps for cooperative fun; non-violent options.",
      prep: ["Create/Link Epic account","Enable cross-play","Download Creative content"]
    },
    {
      name: "Fall Guys",
      crossplay: true,
      platforms: ["PC","Xbox","PlayStation","Switch"],
      notes: "Free-to-play party game.",
      prep: ["Create/Link Epic account","Test party invites"]
    }
  ],
  weeks: [
    { week:1, date:"2025-09-14", theme:"One Body, Many Parts", scripture:"1 Corinthians 12:12–27", game:"Rocket League", service:"Introduce PC Build project & donation goal." },
    { week:2, date:"2025-09-21", theme:"Encouragement Buffs", scripture:"Hebrews 3:13", game:"Among Us", service:"Collect & organize donated PC parts." },
    { week:3, date:"2025-09-28", theme:"Playing the Long Game", scripture:"Hebrews 12:1", game:"Minecraft (Bedrock)", service:"Teach basic PC troubleshooting tips." },
    { week:4, date:"2025-10-05", theme:"Full Armor Loadout", scripture:"Ephesians 6:10–18", game:"Fortnite Creative", service:"Sort parts & finalize build list." },
    { week:5, date:"2025-10-12", theme:"Daily Quests", scripture:"2 Peter 3:18", game:"Rocket League", service:"Begin PC assembly." },
    { week:6, date:"2025-10-19", theme:"Troubleshooting Faith", scripture:"Psalm 139:23–24", game:"Minecraft (Bedrock)", service:"Install OS & core software." },
    { week:7, date:"2025-10-26", theme:"Patch Notes", scripture:"Romans 12:2", game:"Fall Guys", service:"Test & troubleshoot PC build." },
    { week:8, date:"2025-11-02", theme:"Shining in the Chat", scripture:"Matthew 5:14–16", game:"Among Us", service:"Finalize donation package + encouragement letter." },
    { week:9, date:"2025-11-09", theme:"Lag & Latency", scripture:"Isaiah 40:31", game:"Rocket League", service:"Deliver PC to student (optional prayer/photo)." },
    { week:10, date:"2025-11-16", theme:"Final Boss", scripture:"Revelation 21:4–7", game:"Minecraft (or Variety Night)", service:"Thanksgiving fellowship + plan next season." }
  ]
};

// ----- Helpers -----
const $ = sel => document.querySelector(sel);
function fmtDate(iso){
  const d = new Date(iso+"T00:00:00");
  return d.toLocaleDateString(undefined,{month:"short", day:"numeric"});
}
function escapeHTML(str){ return str.replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m])); }

function makeICS(week){
  const start = new Date(week.date + "T19:00:00");
  const end = new Date(start.getTime() + 90*60000);
  const pad = n => String(n).padStart(2,'0');
  const dt = d => d.getUTCFullYear()+pad(d.getUTCMonth()+1)+pad(d.getUTCDate())+"T"+pad(d.getUTCHours())+pad(d.getUTCMinutes())+"00Z";
  const title = `CTRL + Faith – Week ${week.week}: ${week.theme}`;
  const desc = `Devotion: ${week.scripture}\nGame: ${week.game}\nService: ${week.service}\nMore: ${location.href}`;
  return ["BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//CTRL+Faith//Schedule//EN","BEGIN:VEVENT",
    "UID:"+crypto.randomUUID(),"DTSTAMP:"+dt(new Date()),"DTSTART:"+dt(start),"DTEND:"+dt(end),
    "SUMMARY:"+title.replace(/[,;]/g,""),"DESCRIPTION:"+desc.replace(/[\n,;]/g," "),"END:VEVENT","END:VCALENDAR"].join("\r\n");
}

function download(filename, content, type="text/calendar"){
  const blob = new Blob([content], {type});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = filename; a.click();
  setTimeout(()=>URL.revokeObjectURL(url), 1200);
}

// ----- Render Schedule -----
function renderSchedule(){
  const range = `${fmtDate(SITE_DATA.group.dates.start)}–${fmtDate(SITE_DATA.group.dates.end)}`;
  document.getElementById("seasonRange").textContent = range;
  const grid = document.getElementById("weekGrid"); grid.innerHTML = "";
  SITE_DATA.weeks.forEach(week => {
    const card = document.createElement("article");
    card.className = "week-card";
    card.innerHTML = `
      <h3>Week ${week.week} – ${fmtDate(week.date)} — ${escapeHTML(week.theme)}</h3>
      <div class="week-meta">
        <span class="chip">Scripture: ${escapeHTML(week.scripture)}</span>
        <span class="chip">Game: ${escapeHTML(week.game)}</span>
        <span class="chip">Invite a friend</span>
      </div>
      <div class="week-actions">
        <button class="btn" data-action="toggle">Details</button>
        <button class="btn" data-action="ics">Add to Calendar</button>
        <button class="btn" data-action="copy">Copy Invite</button>
      </div>
      <div class="details">
        <p><strong>Service Focus:</strong> ${escapeHTML(week.service)}</p>
        <p class="muted">Plan: 10m welcome • 5–10m devotion • 60–90m game • 5–10m prayer</p>
      </div>`;
    card.querySelector('[data-action="toggle"]').addEventListener('click',()=> card.classList.toggle('open'));
    card.querySelector('[data-action="ics"]').addEventListener('click',()=> download(`ctrl-faith-week-${week.week}.ics`, makeICS(week)));
    card.querySelector('[data-action="copy"]').addEventListener('click', async ()=>{
      const msg = `Join me for CTRL + Faith – Week ${week.week} (${fmtDate(week.date)}): ${week.theme}\nScripture: ${week.scripture}\nGame: ${week.game}\nService: ${week.service}\n\nDetails: ${location.href}`;
      try{ await navigator.clipboard.writeText(msg); alert("Invite copied to clipboard!"); }catch{ prompt("Copy this invite text:", msg); }
    });
    grid.appendChild(card);
  });
}

// ----- Render Game Setup -----
function renderGames(){
  const acc = document.getElementById("gameAccordions"); acc.innerHTML = "";
  SITE_DATA.games.forEach(g => {
    const det = document.createElement("details");
    det.innerHTML = `<summary>${escapeHTML(g.name)}</summary>
      <p><strong>Platforms:</strong> ${escapeHTML(g.platforms.join(", "))}</p>
      <p><strong>Cross-play:</strong> ${g.crossplay ? "Yes" : "No"}</p>
      <p class="muted">${escapeHTML(g.notes)}</p>
      <ul>${g.prep.map(p=>`<li>${escapeHTML(p)}</li>`).join("")}</ul>`;
    acc.appendChild(det);
  });
}

// ----- Render Church Section -----
function renderChurch(){
  const church = SITE_DATA.group.church || {name:"Church for the One", website:"#", services:[]};
  const nameEl = document.getElementById("churchName");
  const siteEl = document.getElementById("churchWebsite");
  const grid = document.getElementById("churchGrid");
  if(nameEl) nameEl.textContent = church.name;
  if(siteEl) siteEl.href = church.website || "#";
  grid.innerHTML = "";
  if(church.services && church.services.length){
    church.services.forEach(svc => {
      const card = document.createElement("article");
      card.className = "card feature";
      card.innerHTML = `<div class="feature-icon" aria-hidden="true">⛪</div>
        <h3>${escapeHTML(svc.day)}</h3>
        <p><strong>${escapeHTML(svc.time)}</strong><br/><span class="muted">${escapeHTML(svc.location || "")}</span></p>`;
      grid.appendChild(card);
    });
  } else {
    const p = document.createElement("p");
    p.textContent = "Service times coming soon.";
    grid.appendChild(p);
  }
}

// ----- Form mailto -----
function openMailto(form){
  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const interest = form.interest.value;
  const subject = encodeURIComponent("CTRL + Faith – Get Involved");
  const body = encodeURIComponent(`Hi CTRL + Faith team,\n\nMy name is ${name} (${email}). I'm interested in: ${interest}.\n\nBlessings,\n${name}`);
  const to = SITE_DATA.group.contact_email || "you@example.com";
  window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
  return false;
}

// ----- Init -----
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("year").textContent = new Date().getFullYear();
  const toggle = document.querySelector(".nav-toggle");
  const links = document.getElementById("nav-links");
  toggle.addEventListener("click", ()=>{
    const open = links.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open ? "true":"false");
  });
  // Discord links
  const d = SITE_DATA.group.discord_url || "#";
  document.getElementById("discordTop").href = d;
  document.getElementById("discordHero").href = d;
  document.getElementById("discordFooter").href = d;
  document.getElementById("contactEmail").href = "mailto:" + SITE_DATA.group.contact_email;

  renderSchedule();
  renderGames();
  renderChurch();
});
