/* =========================================================
   OCEAN OVERSEAS — site scripts
   ========================================================= */
const WA_NUMBER = "918295754197"; // WhatsApp number (with country code, no +)

/* ---- Sticky header shadow ---- */
const header = document.querySelector("header.nav");
window.addEventListener("scroll", () => {
  if (header) header.classList.toggle("scrolled", window.scrollY > 20);
});

/* ---- Mobile drawer ---- */
const hamburger = document.querySelector(".hamburger");
const drawer = document.querySelector(".drawer");
const overlay = document.querySelector(".overlay");
function openDrawer(){ drawer?.classList.add("open"); overlay?.classList.add("show"); document.body.style.overflow="hidden"; }
function closeDrawer(){ drawer?.classList.remove("open"); overlay?.classList.remove("show"); document.body.style.overflow=""; }
hamburger?.addEventListener("click", openDrawer);
overlay?.addEventListener("click", closeDrawer);
document.querySelector(".drawer .close")?.addEventListener("click", closeDrawer);

/* ---- Scroll reveal ---- */
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => { if (e.isIntersecting){ e.target.classList.add("in"); io.unobserve(e.target); } });
}, { threshold: 0.12 });
document.querySelectorAll(".reveal").forEach((el, i) => {
  el.style.transitionDelay = (i % 4) * 0.08 + "s";
  io.observe(el);
});

/* ---- Animated counters ---- */
function animateCount(el){
  const target = parseFloat(el.dataset.count);
  const suffix = el.dataset.suffix || "";
  const dur = 1600; const start = performance.now();
  function tick(now){
    const p = Math.min((now - start) / dur, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    const val = Math.floor(eased * target);
    el.textContent = val.toLocaleString("en-IN") + suffix;
    if (p < 1) requestAnimationFrame(tick);
    else el.textContent = target.toLocaleString("en-IN") + suffix;
  }
  requestAnimationFrame(tick);
}
const counterIO = new IntersectionObserver((entries) => {
  entries.forEach((e) => { if (e.isIntersecting){ animateCount(e.target); counterIO.unobserve(e.target); } });
}, { threshold: 0.5 });
document.querySelectorAll("[data-count]").forEach((el) => counterIO.observe(el));

/* ---- WhatsApp enquiry form ----
   On submit we build a clean message and open WhatsApp chat
   to the business number so the lead lands directly on WhatsApp. */
function buildWAMessage(data){
  let m = "*New Enquiry — Ocean Overseas Website*%0A%0A";
  if (data.name)    m += "👤 *Name:* " + encodeURIComponent(data.name) + "%0A";
  if (data.phone)   m += "📞 *Phone:* " + encodeURIComponent(data.phone) + "%0A";
  if (data.email)   m += "✉️ *Email:* " + encodeURIComponent(data.email) + "%0A";
  if (data.country) m += "🌍 *Country:* " + encodeURIComponent(data.country) + "%0A";
  if (data.visa)    m += "🛂 *Visa Type:* " + encodeURIComponent(data.visa) + "%0A";
  if (data.message) m += "📝 *Message:* " + encodeURIComponent(data.message) + "%0A";
  return m;
}
document.querySelectorAll("form[data-wa-form]").forEach((form) => {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const data = Object.fromEntries(fd.entries());
    const msg = buildWAMessage(data);
    const url = "https://wa.me/" + WA_NUMBER + "?text=" + msg;
    window.open(url, "_blank");
    const btn = form.querySelector("button[type=submit]");
    if (btn){ const t = btn.innerHTML; btn.innerHTML = "✓ Opening WhatsApp…"; setTimeout(()=>btn.innerHTML=t, 3000); }
    form.reset();
  });
});

/* ---- Active nav link based on current page ---- */
const path = location.pathname.split("/").pop() || "index.html";
document.querySelectorAll(".nav-links a[data-page]").forEach((a) => {
  if (a.dataset.page === path) a.classList.add("active");
});

/* ---- Footer year ---- */
const y = document.getElementById("year");
if (y) y.textContent = new Date().getFullYear();
