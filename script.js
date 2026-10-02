/* Potes · Método Potes — interações da landing.
   Sem dependências. Tudo degrada bem sem JavaScript. */

(() => {
  "use strict";

  const movimentoReduzido = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ── Revelar ao rolar ───────────────────────────────────────────────── */

  const alvos = document.querySelectorAll("[data-reveal], [data-meses]");

  if (movimentoReduzido || !("IntersectionObserver" in window)) {
    alvos.forEach((el) => el.classList.add("on"));
  } else {
    const observador = new IntersectionObserver(
      (entradas) => {
        for (const entrada of entradas) {
          if (!entrada.isIntersecting) continue;
          entrada.target.classList.add("on");
          observador.unobserve(entrada.target);
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.15 },
    );
    alvos.forEach((el) => observador.observe(el));
  }

  /* ── Barra de progresso de leitura ──────────────────────────────────── */

  const progresso = document.querySelector("[data-progresso]");
  const topo = document.querySelector("[data-topo]");
  const hero = document.querySelector(".hero");

  function aoRolar() {
    const altura = document.documentElement.scrollHeight - innerHeight;
    if (progresso) progresso.style.width = `${altura > 0 ? (scrollY / altura) * 100 : 0}%`;

    if (topo && hero) {
      topo.classList.toggle("on", scrollY > hero.offsetHeight * 0.8);
    }
  }

  addEventListener("scroll", aoRolar, { passive: true });
  addEventListener("resize", aoRolar, { passive: true });
  aoRolar();

  /* ── Datas relativas: "daqui a 12 meses" nunca fica desatualizado ───── */

  const daquiA12Meses = new Date();
  daquiA12Meses.setMonth(daquiA12Meses.getMonth() + 12);

  const porExtenso = new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric" }).format(daquiA12Meses);
  const mesCurto = new Intl.DateTimeFormat("pt-BR", { month: "short" }).format(daquiA12Meses).replace(".", "");
  const curto = `${mesCurto}/${daquiA12Meses.getFullYear()}`;

  document.querySelectorAll("[data-vencimento]").forEach((el) => {
    el.textContent = porExtenso;
  });
  document.querySelectorAll("[data-vencimento-curto]").forEach((el) => {
    el.textContent = curto;
  });

  /* ── Botões de checkout ainda sem link real ─────────────────────────── */

  document.querySelectorAll("[data-checkout]").forEach((botao) => {
    botao.addEventListener("click", (evento) => {
      if (botao.getAttribute("href") !== "#" ) return;
      evento.preventDefault();
      botao.animate(
        [{ transform: "scale(1)" }, { transform: "scale(0.96)" }, { transform: "scale(1)" }],
        { duration: 260, easing: "ease-out" },
      );
      botao.textContent = "Falta o link de checkout";
      setTimeout(() => {
        botao.textContent = "Quero o e-book + 1 ano do app";
      }, 1600);
    });
  });
})();
