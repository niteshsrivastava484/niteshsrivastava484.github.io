// Nitesh Srivastava — Portfolio interactions
(function () {
  const root = document.documentElement;

  // ---- Theme (persisted; falls back to OS preference) ----
  const stored = localStorage.getItem("theme");
  const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
  root.setAttribute("data-theme", stored || (prefersLight ? "light" : "dark"));

  document.querySelector(".theme-toggle").addEventListener("click", () => {
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  });

  // ---- Mobile menu ----
  const toggle = document.querySelector(".nav-toggle");
  const links = document.getElementById("nav-links");
  toggle.addEventListener("click", () => {
    const open = links.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
  });
  links.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      links.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    })
  );

  // ---- Scroll reveal ----
  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("visible"));
  }

  // ---- Active nav link ----
  const sections = document.querySelectorAll("main section[id]");
  const navMap = {};
  links.querySelectorAll('a[href^="#"]').forEach((a) => (navMap[a.getAttribute("href").slice(1)] = a));
  if ("IntersectionObserver" in window) {
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          const link = navMap[e.target.id];
          if (link && e.isIntersecting) {
            Object.values(navMap).forEach((l) => l.classList.remove("active"));
            link.classList.add("active");
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach((s) => spy.observe(s));
  }

  // ---- Stat counters ----
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const counters = document.querySelectorAll(".stat-num[data-count]");
  if (!reduceMotion && "IntersectionObserver" in window) {
    const cio = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const el = e.target;
        const target = +el.dataset.count;
        const decimals = +(el.dataset.decimals || 0);
        const start = performance.now();
        const dur = 1200;
        const tick = (now) => {
          const p = Math.min((now - start) / dur, 1);
          el.textContent = (target * (1 - Math.pow(1 - p, 3))).toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        cio.unobserve(el);
      });
    }, { threshold: 0.6 });
    counters.forEach((c) => cio.observe(c));
  }

  // ---- Footer year ----
  document.getElementById("year").textContent = new Date().getFullYear();
})();
