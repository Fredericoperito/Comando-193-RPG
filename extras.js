// ==========================================================
// extras.js — carregue DEPOIS de game.js, cenas.js, audio.js e corneta.js.
// 1) Legenda "país — viaturas" sai de dentro da imagem e vai abaixo do texto.
// 2) Opções de resposta sempre em ordem aleatória.
// 3) Cerimônia de promoção com insígnias fiéis à referência (CB 2 traços,
//    Ten/Cap estrelas prateadas de 4 pontas, Maj/TC/Cel estrelas de 8 e 4 pontas).
// 4) Toques de corneta ("Em Continência à Bandeira", "Praça", "Oficial", "Comandante")
//    e música da Reserva funcionando.
// ==========================================================
(function () {
    const css = document.createElement("style");
    css.textContent = `
    .legenda-cena{font-size:12px;color:#fff;background:#111;border:1px solid #ffca28;border-radius:6px;padding:4px 8px;text-align:left;margin:4px 0 0;font-weight:700}.legenda-cena:empty{display:none}
    .cer-insignia{display:none;text-align:center;margin:0 auto;max-width:300px}
    .cer-insignia svg{width:100%;height:auto;display:block}
    .cer-insignia div{font-size:13px;color:#ffca28;font-weight:700;margin-top:2px}
    .cer-legenda-reserva{font-size:20px;font-weight:800;color:#ffca28;text-align:center}`;
    document.head.appendChild(css);

    // ---- 1) legenda fora da imagem ----
    const box = document.getElementById("ilustracao-cena-box");
    const dialogo = document.getElementById("dialogo-cena");
    if (box && dialogo) {
        const leg = document.createElement("p");
        leg.id = "legenda-cena"; leg.className = "legenda-cena";
        dialogo.insertAdjacentElement("afterend", leg);
        const reBanner = /(BRASIL|ESTADOS UNIDOS|EUA|R[ÚU]SSIA|PORTUGAL)\s*[—–-]/i;
        const tirarBanner = () => {
            const svg = box.querySelector("svg"); if (!svg) return;
            const r = svg.querySelector('rect[x="135"][y="8"]');
            if (r) {
                const t = r.nextElementSibling;
                if (t && t.tagName.toLowerCase() === "text") { leg.textContent = t.textContent.trim(); leg.style.background = r.getAttribute("fill") || "#111"; t.remove(); }
                r.remove();
            }
            svg.querySelectorAll("text").forEach(t => {
                if (!reBanner.test(t.textContent)) return;
                leg.textContent = t.textContent.trim();
                const g = t.parentElement;
                if (g && g !== svg && g.tagName.toLowerCase() === "g" && g.querySelectorAll("text").length === 1) g.remove();
                else { const ant = t.previousElementSibling; if (ant && ant.tagName.toLowerCase() === "rect") ant.remove(); t.remove(); }
            });
        };
        new MutationObserver(tirarBanner).observe(box, { childList: true, subtree: true });
        tirarBanner();
    }

    // ---- 2) opções em ordem aleatória ----
    const lista = document.getElementById("lista-escolhas");
    if (lista) {
        let ocupado = false;
        new MutationObserver(() => {
            if (ocupado) return;
            const bs = [...lista.children]; if (bs.length < 2) return;
            ocupado = true;
            for (let i = bs.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [bs[i], bs[j]] = [bs[j], bs[i]]; }
            bs.forEach(b => lista.appendChild(b));
            setTimeout(() => { ocupado = false; }, 0);
        }).observe(lista, { childList: true });
    }
})();

// ---------- INSÍGNIAS FIÉIS À REFERÊNCIA MILITAR ----------
const CER_TOQUE_FINAL = { praca: "sargento", oficial: "oficiais", superior: "cmtchefe" };
const CER_NOME_TOQUE = { praca: "PRAÇA", oficial: "OFICIAL", superior: "COMANDANTE" };

// Estrela de 5 pontas (usada para Aspirante)
function cerEstrela5Pontas(x, y, s) {
    const pts = [0, 1, 2, 3, 4].map(k => {
        const a = k * 1.2566 - 1.5708, b = a + 0.6283;
        return `${(x + Math.cos(a) * s).toFixed(1)},${(y + Math.sin(a) * s).toFixed(1)} ${(x + Math.cos(b) * s * 0.42).toFixed(1)},${(y + Math.sin(b) * s * 0.42).toFixed(1)}`;
    }).join(" ");
    return `<polygon points="${pts}" fill="#ffd600" stroke="#7a5a00" stroke-width="1.4"/>`;
}

// Estrela prateada de 4 pontas (2º Ten, 1º Ten, Cap e complemento de Maj/Ten-Cel)
function cerEstrela4PontasPrata(x, y, s) {
    const pts = [0, 1, 2, 3].map(k => {
        const a = k * (Math.PI / 2) - Math.PI / 2;
        const b = a + Math.PI / 4;
        return `${(x + Math.cos(a) * s).toFixed(1)},${(y + Math.sin(a) * s).toFixed(1)} ${(x + Math.cos(b) * s * 0.36).toFixed(1)},${(y + Math.sin(b) * s * 0.36).toFixed(1)}`;
    }).join(" ");
    return `
        <g>
            <polygon points="${pts}" fill="#d7dce2" stroke="#5c6470" stroke-width="1.3"/>
            <line x1="${x - s * 0.7}" y1="${y}" x2="${x + s * 0.7}" y2="${y}" stroke="#7f8894" stroke-width="1"/>
            <line x1="${x}" y1="${y - s * 0.7}" x2="${x}" y2="${y + s * 0.7}" stroke="#7f8894" stroke-width="1"/>
            <circle cx="${x}" cy="${y}" r="${(s * 0.24).toFixed(1)}" fill="#eceff4" stroke="#5c6470" stroke-width="1"/>
        </g>`;
}

// Estrela dourada de 8 pontas (Major, Tenente-Coronel e Coronel)
function cerEstrela8PontasOuro(x, y, s) {
    const pts = [0, 1, 2, 3, 4, 5, 6, 7].map(k => {
        const a = k * (Math.PI / 4) - Math.PI / 2;
        const b = a + Math.PI / 8;
        return `${(x + Math.cos(a) * s).toFixed(1)},${(y + Math.sin(a) * s).toFixed(1)} ${(x + Math.cos(b) * s * 0.56).toFixed(1)},${(y + Math.sin(b) * s * 0.56).toFixed(1)}`;
    }).join(" ");
    return `
        <g>
            <polygon points="${pts}" fill="#ffd600" stroke="#8c6700" stroke-width="1.3"/>
            <circle cx="${x}" cy="${y}" r="${(s * 0.28).toFixed(1)}" fill="#fff3b0" stroke="#8c6700" stroke-width="1.1"/>
        </g>`;
}

// Divisa em "V" (vértice para baixo, como na imagem de referência de SD / CB / SGT)
function cerDivisaBrancaV(cx, y) {
    return `<polygon points="${cx - 22},${y - 7} ${cx},${y + 8} ${cx + 22},${y - 7} ${cx + 22},${y - 2} ${cx},${y + 13} ${cx - 22},${y - 2}" fill="#f5f7fa" stroke="#37474f" stroke-width="1.2"/>`;
}

function cerInsignia(quadro, i, cx, cy) {
    // PRAÇAS: 0=Soldado(1 traço), 1=Cabo(2 traços), 2=3ºSgt(3), 3=2ºSgt(4), 4=1ºSgt(5), 5=Subtenente(Triângulo dourado)
    if (quadro === "praca") {
        if (i >= 5) {
            return `<polygon points="${cx},14 ${cx + 22},54 ${cx - 22},54" fill="none" stroke="#ffd600" stroke-width="5" stroke-linejoin="round"/>`;
        }
        const qtdTracos = i + 1; // Soldado=1, Cabo=2, 3ºSgt=3, 2ºSgt=4, 1ºSgt=5
        const espaco = 8.5;
        const yInicial = cy - ((qtdTracos - 1) * espaco) / 2 - 2;
        return Array.from({ length: qtdTracos }, (_, k) => cerDivisaBrancaV(cx, yInicial + k * espaco)).join("");
    }

    // OFICIAIS: 0=Aspirante (estrela 5 pontas ouro), 1=2ºTen (1 estrela 4 pontas prata), 2=1ºTen (2 prata), 3=Capitão (3 prata)
    if (quadro === "oficial") {
        if (i === 0) return cerEstrela5Pontas(cx, cy, 16);
        const qtd = i; // 1, 2 ou 3 estrelas de 4 pontas prateadas
        const espaco = 42;
        return Array.from({ length: qtd }, (_, k) => {
            const x = cx + (k - (qtd - 1) / 2) * espaco;
            return cerEstrela4PontasPrata(x, cy, 16);
        }).join("");
    }

    // OFICIAIS SUPERIORES:
    // i=0 (Major): 1 Dourada (8 pontas) + 2 Prateadas (4 pontas)
    // i=1 (Tenente-Coronel): 2 Douradas (8 pontas) + 1 Prateada (4 pontas)
    // i=2 (Coronel): 3 Douradas (8 pontas)
    const qtdOuro = Math.min(3, i + 1);
    const espaco = 44;
    return [0, 1, 2].map(k => {
        const x = cx + (k - 1) * espaco;
        return k < qtdOuro
            ? cerEstrela8PontasOuro(x, cy, 16.5)
            : cerEstrela4PontasPrata(x, cy, 15.5);
    }).join("");
}

function cerBandeira(pais, x, y) {
    const f = {
        "Brasil": `<rect width="62" height="40" fill="#1b9a4a"/><polygon points="31,4 58,20 31,36 4,20" fill="#ffd600"/><circle cx="31" cy="20" r="9" fill="#1a3a8a"/>`,
        "Estados Unidos": `<rect width="62" height="40" fill="#fff"/>${[0, 1, 2, 3].map(k => `<rect y="${k * 11.4}" width="62" height="5.7" fill="#c62828"/>`).join("")}<rect width="28" height="22" fill="#283593"/>`,
        "Rússia": `<rect width="62" height="14" fill="#fff"/><rect y="13" width="62" height="14" fill="#1e46a8"/><rect y="26" width="62" height="14" fill="#d32f2f"/>`,
        "Portugal": `<rect width="25" height="40" fill="#1b7a3a"/><rect x="25" width="37" height="40" fill="#d32f2f"/><circle cx="25" cy="20" r="7" fill="#ffd600"/>`
    }[pais] || "";
    return `<rect x="${x}" y="${y}" width="3" height="120" fill="#ccc"/><g transform="translate(${x + 3},${y + 2})" stroke="#16110a" stroke-width="1.5">${f}</g>`;
}

function carreiraCompleta() {
    return Object.keys(CARREIRAS).every(q => estadoJogo.indicesPatente[q] >= CARREIRAS[q].length - 1);
}

// ---------- CERIMÔNIA DE PROMOÇÃO ----------
function iniciarCerimonia() {
    const fila = estadoJogo.filaPromocoes || [];
    const p = fila.shift();
    if (!p) {
        Corneta.parar();
        if (carreiraCompleta() && !estadoJogo.reservaMostrada) { estadoJogo.reservaMostrada = true; return mostrarReserva(); }
        if (window.Som && Som.retomar) Som.retomar();
        mostrarTela("tela-quartel"); atualizarQuartel();
        return;
    }
    const Papel = { praca: "Jovem", oficial: "Oficial", superior: "Superior" }[p.quadro];
    const ato = { praca: "Boletim da Corporação", oficial: "Decreto do Governador", superior: "Decreto lido pelo Comandante-Geral" }[p.quadro];
    const local = p.quadro === "superior" ? "o salão nobre do Comando-Geral" : "o pátio do quartel";
    const idx = p.idxNovo !== undefined ? p.idxNovo : CARREIRAS[p.quadro].indexOf(p.para);

    const passos = [
        { t: ["🎺 Corneta", `Toques de corneta: SENTIDO, OMBRO ARMA e APRESENTAR ARMA. A tropa se alinha em ${local} e a bandeira é erguida.`],
          som: () => Corneta.sequencia(["sentido", "ombroarma", "apresentararma"]) },
        { t: ["Comandante", `“${ato}: pelo mérito e pela dedicação ao serviço, fica promovido de ${p.de} a ${p.para} o bombeiro da guarnição.”`],
          som: () => Corneta.parar() },
        { t: ["Comandante", "“Receba suas novas insígnias e a responsabilidade que vem com elas.” O comandante fixa a insígnia no ombro. Toque: EM CONTINÊNCIA À BANDEIRA."],
          som: () => Corneta.tocar("continencia"), insignia: true },
        { t: ["Guarnição", `“Vida alheia e riquezas salvar!” A tropa presta continência ao toque de ${CER_NOME_TOQUE[p.quadro]}.`],
          som: () => Corneta.tocar(CER_TOQUE_FINAL[p.quadro], { loop: true }), insignia: true }
    ];

    const cena = () => `<svg viewBox="0 0 400 240">
        <rect width="400" height="240" fill="${p.quadro === "superior" ? "#3b2f26" : "#26354d"}"/>
        <rect y="200" width="400" height="40" fill="#4a3a2c"/>
        ${cerBandeira(estadoJogo.corpoBombeiros, 18, 22)}
        ${[62, 112, 162].map(x => `<g transform="translate(${x},98) scale(.62)">${desenharBonecoBombeiro(0, "Jovem", false, true)}</g>`).join("")}
        <g transform="translate(305,72) scale(.8)">${desenharBonecoBombeiro(0, "Superior", false, true)}</g>
        <g transform="translate(212,50) scale(.95)">${desenharBonecoBombeiro(0, Papel, false, true)}</g>
    </svg>`;

    mostrarTela("tela-cerimonia");
    if (window.Som && Som.pausar) Som.pausar();
    const cenaEl = document.getElementById("cer-cena");
    let ins = document.getElementById("cer-insignia");
    if (!ins) { ins = document.createElement("div"); ins.id = "cer-insignia"; ins.className = "cer-insignia"; cenaEl.parentElement.insertBefore(ins, cenaEl); }
    document.getElementById("cer-titulo").innerText = `🎖️ Promoção: ${p.de} → ${p.para}`;
    const botoes = document.getElementById("cer-botoes");
    let i = 0;

    const mostrar = () => {
        const passo = passos[i];
        cenaEl.innerHTML = cena();
        if (passo.insignia) {
            ins.innerHTML = `<svg viewBox="0 0 220 70"><rect x="2" y="2" width="216" height="66" rx="12" fill="#1d2a44" stroke="#ffca28" stroke-width="3"/>${cerInsignia(p.quadro, idx, 110, 35)}</svg><div>Nova patente: ${p.para}</div>`;
            ins.style.display = "block";
        } else { ins.style.display = "none"; }
        document.getElementById("cer-dialogo").innerHTML = `<strong>${passo.t[0]}:</strong> ${passo.t[1]}`;
        passo.som();
        botoes.innerHTML = "";
        const b = document.createElement("button");
        b.className = "btn-principal";
        b.innerText = i < passos.length - 1 ? "Continuar Solenidade ➔" : "Escolher evolução ➔";
        b.onclick = () => { if (++i < passos.length) mostrar(); else { Corneta.parar(); cerEscolherEvolucao(p); } };
        botoes.appendChild(b);
    };
    mostrar();
}

function cerEscolherEvolucao(p) {
    const cargo = { praca: "Praça", oficial: "Oficial", superior: "Estado-Maior" }[p.quadro];
    document.getElementById("cer-insignia").style.display = "none";
    document.getElementById("cer-dialogo").innerHTML = `<strong>Nova patente: ${p.para}.</strong> Escolha o atributo de ${cargo} que ganha +1 ponto (máximo 10):`;
    const botoes = document.getElementById("cer-botoes");
    botoes.innerHTML = "";
    Object.entries(estadoJogo.atributos).filter(([, a]) => a.cargo === cargo).forEach(([nome, a]) => {
        const b = document.createElement("button");
        b.className = "btn-escolha";
        b.disabled = a.valor >= 10;
        b.innerText = `${nome}: ${a.valor} → ${Math.min(10, a.valor + 1)}`;
        b.onclick = () => { a.valor = Math.min(10, a.valor + 1); iniciarCerimonia(); };
        botoes.appendChild(b);
    });
}

// ---------- CENA FINAL: RESERVA ----------
function cenaReserva() {
    const pele = TONS_PELE[estadoJogo.corPele] || TONS_PELE["Moreno"];
    const sw = 'stroke="#16110a" stroke-width="2.2" stroke-linejoin="round"';
    const pessoas = [
        { x: 95,  cabelo: "#3a2416", bone: true,  camisa: "#e53935", copo: "cerveja" },   // Subtenente
        { x: 200, cabelo: "#3a2416", bone: false, camisa: "#fdd835", copo: "drink" },     // Capitão
        { x: 305, cabelo: "#d5dadd", bone: false, camisa: "#1e88e5", copo: "whisky" }     // Coronel
    ];
    const copo = (tipo, x) => tipo === "cerveja"
        ? `<rect x="${x + 36}" y="118" width="9" height="21" rx="2" fill="#7a4a12" ${sw}/><rect x="${x + 38.5}" y="108" width="4" height="11" fill="#7a4a12" ${sw}/><rect x="${x + 36}" y="125" width="9" height="6" fill="#ffd54f"/>`
        : tipo === "drink"
        ? `<path d="M${x + 32} 114h17l-8.5 14z" fill="#ff8a3d" ${sw}/><rect x="${x + 40}" y="128" width="2" height="10" fill="#fff"/><path d="M${x + 45} 106l-3 12" stroke="#e53935" stroke-width="2"/><path d="M${x + 37} 107q7-9 14 0z" fill="#e91e63" ${sw}/>`
        : `<rect x="${x + 34}" y="122" width="15" height="17" rx="2" fill="#c77d1a" opacity=".92" ${sw}/><rect x="${x + 37}" y="125" width="4" height="4" fill="#fff" opacity=".75"/><rect x="${x + 43}" y="130" width="4" height="4" fill="#fff" opacity=".75"/>`;
    const gente = pessoas.map(a => `
        <rect x="${a.x - 31}" y="150" width="62" height="64" rx="10" fill="#fff" ${sw}/>
        <rect x="${a.x - 31}" y="162" width="62" height="12" fill="#e53935"/><rect x="${a.x - 31}" y="186" width="62" height="12" fill="#e53935"/>
        <path d="M${a.x - 24} 214l-6 22M${a.x + 24} 214l6 22" stroke="#16110a" stroke-width="4"/>
        <path d="M${a.x - 24} 162q24-14 48 0v14h-48z" fill="${a.camisa}" ${sw}/>
        <path d="M${a.x + 22} 160L${a.x + 40} 140" stroke="${pele}" stroke-width="8" stroke-linecap="round"/>
        <circle cx="${a.x + 40}" cy="138" r="5" fill="${pele}" ${sw}/>
        ${copo(a.copo, a.x)}
        <circle cx="${a.x}" cy="136" r="16" fill="${pele}" ${sw}/>
        <path d="M${a.x - 16} 134a16 16 0 0 1 32 0q-16 8-32 0z" fill="${a.cabelo}" ${sw}/>
        ${a.bone ? `<path d="M${a.x - 17} 133q17-26 34 0z" fill="#c5a880" ${sw}/>` : ""}`).join("");
    return `<svg viewBox="0 0 400 250">
        <defs><linearGradient id="cdu" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5ec4f5"/><stop offset="1" stop-color="#ffe3a8"/></linearGradient></defs>
        <rect width="400" height="125" fill="url(#cdu)"/>
        <circle cx="300" cy="112" r="28" fill="#ffd54f"/><rect y="112" width="400" height="14" fill="url(#cdu)" opacity=".0"/>
        <rect y="125" width="400" height="55" fill="#1e88c7"/>
        <path d="M0 140q25-8 50 0t50 0 50 0 50 0 50 0 50 0 50 0 50 0M0 160q25-8 50 0t50 0 50 0 50 0 50 0 50 0 50 0 50 0" fill="none" stroke="#bfe6ff" stroke-width="2" opacity=".7"/>
        <rect y="178" width="400" height="72" fill="#f2d49b"/>
        <path d="M60 40q8-8 16 0M85 30q8-8 16 0" fill="none" stroke="#fff" stroke-width="2.5"/>
        ${gente}
    </svg>`;
}

function mostrarReserva() {
    mostrarTela("tela-cerimonia");
    if (window.Som && Som.pausar) Som.pausar();
    const ins = document.getElementById("cer-insignia"); if (ins) ins.style.display = "none";
    document.getElementById("cer-titulo").innerText = "🏖️ Reserva";
    document.getElementById("cer-cena").innerHTML = cenaReserva();
    document.getElementById("cer-dialogo").innerHTML = `<span class="cer-legenda-reserva">Parabéns! Você encerrou a sua carreira, curta a Reserva.</span>`;
    const botoes = document.getElementById("cer-botoes");
    botoes.innerHTML = "";
    const b = document.createElement("button");
    b.className = "btn-principal";
    b.innerText = "Voltar ao Quartel ➔";
    b.onclick = () => { Corneta.parar(); if (window.Som && Som.retomar) Som.retomar(); mostrarTela("tela-quartel"); atualizarQuartel(); };
    botoes.appendChild(b);
    Corneta.musica();
}