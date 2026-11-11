"use client";

import { useMemo, useState } from "react";

type Match = { time: string; category: string; round: string; pairA: string; pairB: string; court: string; score?: string; status: "Próximo" | "Finalizado" };

const categories = ["Todas", "7ma Caballeros", "6ta Caballeros", "5ta Caballeros", "4ta Damas"];
const matches: Match[] = [
  { time: "18:30", category: "7ma Caballeros", round: "Zona A · Fecha 3", pairA: "Gómez / Silva", pairB: "Ríos / Acosta", court: "Cancha 2", status: "Próximo" },
  { time: "19:30", category: "6ta Caballeros", round: "Zona B · Fecha 2", pairA: "López / Sosa", pairB: "Pérez / Díaz", court: "Cancha 1", status: "Próximo" },
  { time: "20:30", category: "4ta Damas", round: "Semifinal", pairA: "Molina / Vera", pairB: "Luna / Castro", court: "Cancha 3", status: "Próximo" },
  { time: "Final", category: "7ma Caballeros", round: "Zona A · Fecha 2", pairA: "Gómez / Silva", pairB: "Méndez / Ávila", court: "Ayer", score: "6-4 · 3-6 · 6-2", status: "Finalizado" },
];

const standings = [
  { pos: 1, pair: "Gómez / Silva", p: 3, w: 3, sets: "+5", pts: 9 },
  { pos: 2, pair: "Ríos / Acosta", p: 3, w: 2, sets: "+2", pts: 7 },
  { pos: 3, pair: "Méndez / Ávila", p: 3, w: 1, sets: "−1", pts: 4 },
  { pos: 4, pair: "Paz / Herrera", p: 3, w: 0, sets: "−6", pts: 0 },
];

const navItems = ["Competencia", "Torneos", "Ranking", "Jugadores"];

export default function Home() {
  const [active, setActive] = useState("Competencia");
  const [category, setCategory] = useState("Todas");
  const visibleMatches = useMemo(() => matches.filter((match) => category === "Todas" || match.category === category), [category]);

  function jumpTo(id: string, label: string) {
    setActive(label);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <main className="min-h-screen">
      <div className="bg-tour-navy text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-2 text-xs sm:px-8">
          <span className="tracking-wide text-white/75">CATAMARCA · ARGENTINA</span>
          <span className="hidden text-white/75 sm:inline">Pasión por el pádel, competencia todo el año</span>
          <a className="font-bold text-tour-orange hover:text-orange-300" href="#torneos">Inscripciones abiertas ↗</a>
        </div>
      </div>

      <header className="sticky top-0 z-30 border-b border-black/5 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 sm:px-8">
          <a href="#inicio" className="flex items-center gap-3" aria-label="Catamarca Pádel Tour, inicio">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-tour-orange text-xl font-black text-white">C</div>
            <div className="leading-tight"><div className="text-[11px] font-bold tracking-[.22em] text-tour-orange">CATAMARCA</div><div className="text-lg font-black tracking-tight text-tour-navy">PÁDEL TOUR</div></div>
          </a>
          <nav className="hidden items-center gap-7 md:flex" aria-label="Navegación principal">
            {navItems.map((item) => <button key={item} onClick={() => jumpTo(item === "Competencia" ? "competencia" : item.toLowerCase(), item)} className={`text-sm font-bold transition hover:text-tour-orange ${active === item ? "text-tour-orange" : "text-tour-navy"}`}>{item}</button>)}
          </nav>
          <button onClick={() => jumpTo("acceso", "Ingresar")} className="rounded-full bg-tour-navy px-4 py-2.5 text-sm font-bold text-white transition hover:bg-tour-orange">Ingresar</button>
        </div>
      </header>

      <section id="inicio" className="relative overflow-hidden bg-tour-navy text-white">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 78% 45%, #f36b32 0, transparent 34%), linear-gradient(135deg, transparent 55%, #ffffff12 55%, transparent 56%)" }} />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-[1.2fr_.8fr] lg:items-center">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 px-3 py-1.5 text-xs font-bold uppercase tracking-[.15em] text-white/80"><span className="h-2 w-2 rounded-full bg-tour-orange" /> Temporada 2026</div>
            <h1 className="max-w-3xl text-4xl font-black leading-[1.05] sm:text-6xl">La competencia<br /><span className="text-tour-orange">se juega en equipo.</span></h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-white/75 sm:text-lg">Seguí el Catamarca Pádel Tour: torneos, parejas, resultados y posiciones en un solo lugar.</p>
            <div className="mt-8 flex flex-wrap gap-3"><button onClick={() => jumpTo("torneos", "Torneos")} className="rounded-full bg-tour-orange px-6 py-3 text-sm font-black text-white shadow-lg shadow-black/20 hover:bg-orange-500">Ver torneos <span aria-hidden="true">→</span></button><button onClick={() => jumpTo("competencia", "Competencia")} className="rounded-full border border-white/30 px-6 py-3 text-sm font-bold text-white hover:bg-white/10">Seguir la competencia</button></div>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {[{ value: "91", label: "parejas en competencia" }, { value: "8", label: "categorías" }, { value: "12", label: "zonas activas" }, { value: "2026", label: "temporada" }].map((stat) => <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/[.07] p-5 backdrop-blur sm:p-6"><div className="text-3xl font-black text-tour-orange sm:text-4xl">{stat.value}</div><div className="mt-2 text-sm text-white/70">{stat.label}</div></div>)}
          </div>
        </div>
      </section>

      <section className="border-b border-black/5 bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-y divide-black/5 px-5 sm:grid-cols-4 sm:divide-y-0 sm:px-8">
          {[{ n: "01", t: "Torneos" }, { n: "02", t: "Parejas" }, { n: "03", t: "Resultados" }, { n: "04", t: "Ranking" }].map((item) => <div className="flex items-center gap-3 py-4 sm:justify-center" key={item.n}><span className="text-xs font-black text-tour-orange">{item.n}</span><span className="text-sm font-bold text-tour-navy">{item.t}</span></div>)}
        </div>
      </section>

      <section id="torneos" className="scroll-mt-24 mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-20">
        <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-black uppercase tracking-[.2em] text-tour-orange">Temporada 2026</p><h2 className="mt-2 text-3xl font-black text-tour-navy sm:text-4xl">Torneos</h2><p className="mt-2 text-sm text-slate-600">Toda la acción de la temporada, categoría por categoría.</p></div><button className="rounded-full border border-tour-navy/20 px-4 py-2.5 text-sm font-bold text-tour-navy hover:border-tour-orange hover:text-tour-orange">Ver calendario ↗</button></div>
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {[{ name: "Copa Competencia", tag: "EN JUEGO", date: "Octubre · 2026", info: "91 parejas · 8 categorías", color: "bg-tour-orange" }, { name: "Catamarca Pádel Tour", tag: "PRÓXIMAMENTE", date: "Temporada 2026", info: "Inscripciones por pareja", color: "bg-tour-navy" }].map((tournament) => <article key={tournament.name} className="group overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5 transition hover:-translate-y-1 hover:shadow-lg"><div className={`${tournament.color} relative h-3`} /><div className="p-6 sm:p-7"><div className="flex items-center justify-between gap-3"><span className="rounded-full bg-tour-sand px-3 py-1 text-[10px] font-black tracking-[.14em] text-tour-navy">{tournament.tag}</span><span className="text-xs font-semibold text-slate-500">{tournament.date}</span></div><h3 className="mt-5 text-2xl font-black text-tour-navy">{tournament.name}</h3><p className="mt-2 text-sm text-slate-600">{tournament.info}</p><button onClick={() => jumpTo("competencia", "Competencia")} className="mt-6 text-sm font-black text-tour-orange">Ver competencia <span aria-hidden="true">→</span></button></div></article>)}
        </div>
      </section>

      <section id="competencia" className="scroll-mt-24 bg-white py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="flex flex-wrap items-end justify-between gap-5"><div><p className="text-xs font-black uppercase tracking-[.2em] text-tour-orange">En vivo · Copa Competencia</p><h2 className="mt-2 text-3xl font-black text-tour-navy sm:text-4xl">Seguí cada partido</h2></div><label className="text-sm font-bold text-tour-navy">Categoría <select value={category} onChange={(event) => setCategory(event.target.value)} className="ml-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold outline-none focus:border-tour-orange">{categories.map((item) => <option key={item}>{item}</option>)}</select></label></div>
          <div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_.9fr]">
            <div><div className="mb-3 flex items-center justify-between"><h3 className="font-black text-tour-navy">Partidos</h3><span className="text-xs text-slate-500">Agenda y últimos resultados</span></div><div className="space-y-3">{visibleMatches.map((match, index) => <article key={`${match.time}-${match.category}-${index}`} className="rounded-xl border border-slate-100 bg-tour-sand/50 p-4 sm:p-5"><div className="flex flex-wrap items-center justify-between gap-2"><div className="flex items-center gap-2"><span className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wide ${match.status === "Próximo" ? "bg-orange-100 text-orange-700" : "bg-emerald-100 text-emerald-700"}`}>{match.status}</span><span className="text-xs font-bold text-slate-500">{match.category} · {match.round}</span></div><span className="text-xs font-bold text-tour-navy">{match.time}</span></div><div className="mt-4 grid grid-cols-[1fr_auto_1fr] items-center gap-2"><span className="text-sm font-bold text-tour-navy">{match.pairA}</span><span className="text-xs font-black text-tour-orange">{match.score ?? "VS"}</span><span className="text-right text-sm font-bold text-tour-navy">{match.pairB}</span></div><div className="mt-3 text-[11px] text-slate-500">{match.court}</div></article>)}{visibleMatches.length === 0 && <p className="rounded-xl bg-tour-sand p-6 text-sm text-slate-600">No hay partidos para esta categoría.</p>}</div></div>
            <div><div className="mb-3 flex items-center justify-between"><h3 className="font-black text-tour-navy">Posiciones · Zona A</h3><span className="text-xs text-slate-500">7ma Caballeros</span></div><div className="overflow-hidden rounded-xl border border-slate-100"><div className="grid grid-cols-[38px_1fr_42px_42px_48px] bg-tour-navy px-3 py-3 text-[10px] font-black uppercase tracking-wide text-white/80 sm:grid-cols-[44px_1fr_50px_50px_60px]"><span>#</span><span>Pareja</span><span className="text-center">PJ</span><span className="text-center">PG</span><span className="text-right">Pts</span></div>{standings.map((row, i) => <div key={row.pos} className={`grid grid-cols-[38px_1fr_42px_42px_48px] items-center border-t border-slate-100 px-3 py-4 text-xs sm:grid-cols-[44px_1fr_50px_50px_60px] ${i === 0 ? "bg-orange-50/60" : "bg-white"}`}><span className={`font-black ${i < 2 ? "text-tour-orange" : "text-slate-500"}`}>{String(row.pos).padStart(2, "0")}</span><span className="font-bold text-tour-navy">{row.pair}<small className="mt-1 block font-normal text-slate-500">Sets {row.sets}</small></span><span className="text-center text-slate-600">{row.p}</span><span className="text-center text-slate-600">{row.w}</span><span className="text-right font-black text-tour-navy">{row.pts}</span></div>)}</div><p className="mt-3 text-[11px] leading-5 text-slate-500">La tabla se actualizará automáticamente al cargar los resultados oficiales.</p></div>
          </div>
        </div>
      </section>

      <section id="ranking" className="scroll-mt-24 mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-20"><div className="grid gap-8 rounded-3xl bg-tour-navy p-7 text-white sm:p-10 lg:grid-cols-[1fr_auto] lg:items-center"><div><p className="text-xs font-black uppercase tracking-[.2em] text-tour-orange">Tu temporada, a tu ritmo</p><h2 className="mt-3 text-3xl font-black sm:text-4xl">Un perfil para cada jugador.</h2><p className="mt-3 max-w-2xl text-sm leading-6 text-white/70">Creá tu perfil individual, encontrá a tu compañero y anotate en pareja. Seguí tu historial, tus partidos y tu posición en el ranking.</p></div><button id="acceso" className="scroll-mt-28 rounded-full bg-tour-orange px-6 py-3 text-sm font-black text-white hover:bg-orange-500">Crear perfil de jugador →</button></div></section>

      <section id="jugadores" className="scroll-mt-24 border-t border-black/5 bg-white"><div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-8"><div><h2 className="text-xl font-black text-tour-navy">¿Jugás el próximo torneo?</h2><p className="mt-1 text-sm text-slate-600">Registrate, vinculá tu pareja y recibí novedades de la competencia.</p></div><button onClick={() => jumpTo("acceso", "Ingresar")} className="w-fit rounded-full border border-tour-navy px-5 py-2.5 text-sm font-bold text-tour-navy hover:bg-tour-navy hover:text-white">Acceso jugadores</button></div></section>

      <footer className="bg-tour-navy text-white"><div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-8"><div className="font-black tracking-wide">CATAMARCA <span className="text-tour-orange">PÁDEL TOUR</span><p className="mt-1 text-xs font-normal text-white/50">Competencia, comunidad y pasión por el pádel.</p></div><div className="text-xs text-white/50">© 2026 Catamarca Pádel Tour</div></div></footer>
      <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 border-t border-black/10 bg-white/95 px-2 py-2 backdrop-blur md:hidden" aria-label="Navegación móvil">{[{ label: "Inicio", id: "inicio" }, { label: "Torneos", id: "torneos" }, { label: "Partidos", id: "competencia" }, { label: "Ranking", id: "ranking" }].map((item) => <button key={item.id} onClick={() => jumpTo(item.id, item.label)} className="py-1 text-center text-[11px] font-bold text-tour-navy"><span className="mb-1 block text-base">{item.id === "inicio" ? "⌂" : item.id === "torneos" ? "◉" : item.id === "competencia" ? "▣" : "↗"}</span>{item.label}</button>)}</nav>
    </main>
  );
}
