// ==========================================================
// cenas.js — Caricaturas temáticas de cada socorro, bonecos
// personalizados por país/pele/sexo, dado D10 e promoção.
// ==========================================================
const DADO_MS = 1800;

// ---------- 1. BONECO CARICATO PERSONALIZADO (PELE, SEXO E FARDA DO PAÍS) ----------
function desenharBonecoVetorial(Papel, epi) {
    const E = ESTILOS_PAISES[estadoJogo.corpoBombeiros] || ESTILOS_PAISES["Brasil"];
    const pele = TONS_PELE[estadoJogo.corPele] || TONS_PELE["Moreno"];
    const fem = estadoJogo.genero === "Feminino";
    const cab = Papel === "Superior" ? "#cfd8dc" : "#2d1b0e";
    const roupa = epi ? E.trajeFogo : E.fardaQuartel;
    const ombro = epi ? E.detalheOmbro : E.fardaBorda;
    const sw = 'stroke="#16110a" stroke-width="2.5" stroke-linejoin="round"';

    const boca = Papel === "Jovem"
        ? `<path d="M37 54q8 7 16 0z" fill="#fff" ${sw}/>`
        : Papel === "Oficial"
        ? `<path d="M38 55q8 4 15-1" fill="none" ${sw}/>`
        : `<path d="M38 56q7-3 14 0" fill="none" ${sw}/>`;

    const sobr = Papel === "Jovem"
        ? `<path d="M32 28q6-4 12 0M46 28q6-4 12 0" fill="none" ${sw}/>`
        : `<path d="M32 30l12-2M46 28l12 2" fill="none" ${sw}/>`;

    const estrelas = Papel === "Jovem"
        ? ""
        : `<circle cx="29" cy="68" r="1.8" fill="#ffd54f"/><circle cx="35" cy="67" r="1.8" fill="#ffd54f"/><circle cx="55" cy="67" r="1.8" fill="#ffd54f"/><circle cx="61" cy="68" r="1.8" fill="#ffd54f"/>`;

    const acess = Papel === "Jovem"
        ? `<rect x="68" y="92" width="14" height="19" rx="2" fill="#f4efe0" ${sw}/><rect x="66" y="108" width="14" height="6" rx="2" fill="#ffd600" ${sw}/>`
        : Papel === "Superior"
        ? `<rect x="69" y="86" width="9" height="16" rx="2" fill="#222" ${sw}/><path d="M75 86l3-14" stroke="#16110a" stroke-width="2.4"/>`
        : "";

    const rosto = `<ellipse cx="38" cy="36" rx="4.8" ry="5.8" fill="#fff" ${sw}/><ellipse cx="52" cy="36" rx="4.8" ry="5.8" fill="#fff" ${sw}/><circle cx="39" cy="37" r="2.5" fill="#111"/><circle cx="51" cy="37" r="2.5" fill="#111"/>${sobr}<path d="M45 40q3 4 0 6" fill="none" ${sw}/>${boca}`;

    const topo = epi
        ? `<path d="M24 30q21-25 42 0z" fill="${E.capaceteCor}" ${sw}/><rect x="20" y="28" width="50" height="6" rx="3" fill="${E.capaceteCor}" ${sw}/><rect x="38" y="14" width="14" height="11" rx="2" fill="#ffd600" ${sw}/><text x="45" y="22.5" font-size="6.5" font-weight="bold" text-anchor="middle" fill="#000">${E.InsigniaTexto}</text>`
        : `<path d="M26 29q19-23 38 0z" fill="${E.fardaQuartel}" ${sw}/><path d="M24 29q21 7 46 2l4 3q-24 7-50 0z" fill="${E.fardaBorda}" ${sw}/><circle cx="45" cy="19" r="4.5" fill="#d32f2f" stroke="#ffd600" stroke-width="1.5"/>`;

    return `
    <ellipse cx="45" cy="162" rx="30" ry="5" fill="rgba(0,0,0,.35)"/>
    <rect x="21" y="141" width="24" height="18" rx="6" fill="#171717" ${sw}/><rect x="45" y="141" width="24" height="18" rx="6" fill="#171717" ${sw}/>
    <path d="M26 104h18l-1 38H25z M46 104h18l1 38H47z" fill="${roupa}" ${sw}/>
    ${epi
        ? `<rect x="25.5" y="122" width="17.5" height="5" fill="${E.faixaRefletiva}"/><rect x="47" y="122" width="17.5" height="5" fill="${E.faixaRefletiva}"/>`
        : `<rect x="21" y="116" width="9" height="13" rx="2" fill="${roupa}" ${sw}/>`}
    <path d="M22 64q23-6 46 0l3 44H19z" fill="${roupa}" ${sw}/>
    <path d="M22 64q23-6 46 0l1 9H21z" fill="${ombro}" ${sw}/>${estrelas}
    ${epi
        ? `<rect x="20" y="80" width="50" height="6" fill="${E.faixaRefletiva}"/><rect x="20" y="93" width="50" height="5" fill="${E.faixaRefletiva}"/><path d="M45 64v44" stroke="#111" stroke-width="3"/>`
        : `<rect x="27" y="76" width="13" height="13" rx="2" fill="${roupa}" ${sw}/><rect x="50" y="76" width="13" height="13" rx="2" fill="${roupa}" ${sw}/><path d="M38 64l7 12 7-12" fill="#f4efe0" ${sw}/>`}
    <rect x="19" y="100" width="52" height="8" fill="#1b1b1b" ${sw}/><rect x="41" y="99" width="8" height="10" rx="1" fill="#9a9a9a" ${sw}/>
    <path d="M13 68q-5 2-5 9l2 24h13l1-31z" fill="${roupa}" ${sw}/><path d="M77 68q5 2 5 9l-2 24H67l-1-31z" fill="${roupa}" ${sw}/>
    <rect x="9" y="84" width="14" height="5" fill="${ombro}"/><rect x="67" y="84" width="14" height="5" fill="${ombro}"/>
    <circle cx="15" cy="104" r="6.5" fill="${epi ? "#1b1b1b" : pele}" ${sw}/><circle cx="75" cy="104" r="6.5" fill="${epi ? "#1b1b1b" : pele}" ${sw}/>
    ${acess}
    ${fem ? `<circle cx="24" cy="36" r="8" fill="${cab}" ${sw}/><path d="M26 24q19-12 38 0" fill="${cab}"/>` : ""}
    <rect x="39" y="52" width="12" height="14" fill="${pele}" ${sw}/>
    <circle cx="26" cy="40" r="4.5" fill="${pele}" ${sw}/><circle cx="64" cy="40" r="4.5" fill="${pele}" ${sw}/>
    <circle cx="45" cy="38" r="19" fill="${pele}" ${sw}/>
    ${rosto}${topo}`;
}

function desenharBonecoBombeiro(x, Papel, modoEPI, semRotulo) {
    const corpo = desenharBonecoVetorial(Papel, modoEPI);
    const rotulo = semRotulo ? "" : `<rect x="12" y="164" width="66" height="15" rx="4" fill="#111"/><text x="45" y="174.5" font-size="9" font-weight="bold" fill="#ffca28" text-anchor="middle">${Papel.toUpperCase()}</text>`;
    return `<g transform="translate(${x}, 6)">${corpo}${rotulo}</g>`;
}

// ---------- 2. CARICATURA TEMÁTICA SIMPLES DE CADA SOCORRO ----------
function desenharCenarioTematicoSVG(categoria) {
    const sw = 'stroke="#16110a" stroke-width="2.5" stroke-linejoin="round"';
    const cenarios = {
        animal: `
            <rect width="400" height="145" fill="#1f3347"/>
            <rect y="122" width="400" height="23" fill="#2e472d"/>
            <rect x="275" y="15" width="14" height="110" fill="#6d4c41" ${sw}/>
            <rect x="235" y="28" width="94" height="10" fill="#5d4037" ${sw}/>
            <rect x="262" y="42" width="40" height="34" rx="4" fill="#78909c" ${sw}/>
            <path d="M140 32 Q210 50 245 32 M318 32 Q360 48 395 30" fill="none" stroke="#222" stroke-width="2.5"/>
            <path d="M245 32 q12-16 24 0 t24 0" fill="none" stroke="#4caf50" stroke-width="7" stroke-linecap="round"/>
            <circle cx="296" cy="30" r="6" fill="#4caf50" ${sw}/><circle cx="298" cy="29" r="1.8" fill="#ffeb3b"/>
            <polygon points="315,18 305,30 314,31 306,44 322,28 313,27" fill="#ffd600"/>`,

        predial: `
            <rect width="400" height="145" fill="#2c1614"/>
            <rect y="122" width="400" height="23" fill="#26292e"/>
            <rect x="225" y="10" width="145" height="115" fill="#455a64" ${sw}/>
            <rect x="242" y="24" width="32" height="28" fill="#ff6f00" ${sw}/>
            <path d="M245 50 q12-28 24 0 q-8-34 8-22 q6 18 0 22z" fill="#ffeb3b"/>
            <path d="M265 20 q20-18 42-6 q18-10 32 8 q-18 16-74-2z" fill="#37474f" opacity="0.85"/>
            <rect x="295" y="24" width="32" height="28" fill="#ff8f00" ${sw}/>
            <rect x="242" y="66" width="32" height="28" fill="#263238" ${sw}/>
            <rect x="295" y="66" width="32" height="28" fill="#263238" ${sw}/>
            <path d="M135 95 Q190 75 248 38" fill="none" stroke="#4fc3f7" stroke-width="5" stroke-dasharray="6,3"/>`,

        florestal: `
            <rect width="400" height="145" fill="#3e2215"/>
            <polygon points="150,125 245,45 340,125" fill="#2e4c2f" ${sw}/>
            <polygon points="230,125 325,35 400,125" fill="#1b331c" ${sw}/>
            <path d="M220 122 q15-55 32 0 q18-70 36 0 q18-50 30 0z" fill="#ff6d00"/>
            <path d="M235 122 q12-35 24 0 q14-45 26 0z" fill="#ffd600"/>
            <rect y="122" width="400" height="23" fill="#33261a"/>`,

        busca: `
            <rect width="400" height="145" fill="#162621"/>
            <polygon points="170,125 250,35 330,125" fill="#1e382d" ${sw}/>
            <polygon points="260,125 335,45 400,125" fill="#152920" ${sw}/>
            <polygon points="105,82 285,45 285,115" fill="rgba(255,241,118,0.28)"/>
            <circle cx="315" cy="98" r="14" fill="#ffca28" opacity="0.25"/>
            <text x="315" y="104" font-size="18" text-anchor="middle">🐾</text>
            <rect y="122" width="400" height="23" fill="#253324"/>`,

        especial: `
            <rect width="400" height="145" fill="#1d2230"/>
            <rect y="122" width="400" height="23" fill="#2b2f36"/>
            <rect x="235" y="38" width="125" height="84" rx="6" fill="#546e7a" ${sw}/>
            <line x1="255" y1="20" x2="255" y2="38" stroke="#90a4ae" stroke-width="6"/>
            <line x1="295" y1="20" x2="295" y2="38" stroke="#90a4ae" stroke-width="6"/>
            <line x1="335" y1="20" x2="335" y2="38" stroke="#90a4ae" stroke-width="6"/>
            <polygon points="295,48 272,88 318,88" fill="#ffd600" ${sw}/>
            <text x="295" y="83" font-size="22" font-weight="bold" text-anchor="middle" fill="#000">⚡</text>`,

        hazmat: `
            <rect width="400" height="145" fill="#1f2e1b"/>
            <rect y="122" width="400" height="23" fill="#2d3329"/>
            <g transform="translate(230,62) rotate(14)">
                <rect x="0" y="0" width="125" height="46" rx="22" fill="#cfd8dc" ${sw}/>
                <rect x="45" y="10" width="26" height="26" fill="#ff6f00" ${sw}/>
            </g>
            <circle cx="235" cy="70" r="24" fill="#76ff03" opacity="0.45"/>
            <circle cx="205" cy="52" r="30" fill="#64dd17" opacity="0.35"/>
            <text x="215" y="62" font-size="24" text-anchor="middle">☣️</text>`,

        crise: `
            <rect width="400" height="145" fill="#151d2e"/>
            <rect y="122" width="400" height="23" fill="#262930"/>
            <rect x="255" y="8" width="115" height="114" fill="#37474f" ${sw}/>
            <rect x="245" y="8" width="125" height="8" fill="#78909c" ${sw}/>
            <circle cx="255" cy="2" r="5" fill="#ffca28"/><rect x="251" y="7" width="8" height="12" fill="#e53935"/>
            <rect x="215" y="104" width="60" height="18" rx="6" fill="#ff9800" ${sw}/>`,

        pericia: `
            <rect width="400" height="145" fill="#231f20"/>
            <rect y="122" width="400" height="23" fill="#181516"/>
            <rect x="220" y="22" width="150" height="100" fill="#424242" ${sw}/>
            <polygon points="295,118 250,35 340,35" fill="#1b1b1b" opacity="0.85"/>
            <rect x="195" y="96" width="190" height="9" fill="#ffd600"/>
            <circle cx="305" cy="72" r="20" fill="rgba(128,222,234,0.3)" stroke="#ffd54f" stroke-width="4"/>
            <line x1="319" y1="86" x2="336" y2="103" stroke="#ffd54f" stroke-width="5" stroke-linecap="round"/>`,

        veicular: `
            <rect width="400" height="145" fill="#1e242b"/>
            <rect y="122" width="400" height="23" fill="#333"/>
            <path d="M215 112 l18-28 h75 l18 14 v14 z" fill="#e53935" ${sw}/>
            <circle cx="242" cy="115" r="11" fill="#111" ${sw}/><circle cx="302" cy="115" r="11" fill="#111" ${sw}/>
            <polygon points="188,122 198,96 208,122" fill="#ff6d00" ${sw}/>
            <path d="M225 78 q12-22 25 0" fill="#ff9800"/>`,

        colapso: `
            <rect width="400" height="145" fill="#2b231d"/>
            <rect y="122" width="400" height="23" fill="#3d312a"/>
            <polygon points="205,122 260,55 375,92 385,122" fill="#795548" ${sw}/>
            <line x1="215" y1="122" x2="255" y2="62" stroke="#ffb300" stroke-width="6"/>
            <line x1="245" y1="122" x2="255" y2="62" stroke="#ffb300" stroke-width="5"/>
            <text x="315" y="108" font-size="20">🆘</text>`,

        aquatico: `
            <rect width="400" height="145" fill="#15314b"/>
            <path d="M0 95 q35-14 70 0 t70 0 t70 0 t70 0 t70 0 t70 0 v50 H0z" fill="#0277bd"/>
            <path d="M0 112 q35-12 70 0 t70 0 t70 0 t70 0 t70 0 t70 0 v33 H0z" fill="#01579b"/>
            <circle cx="295" cy="84" r="8" fill="#f5cba7" ${sw}/>
            <path d="M282 78 l-8-14 M308 78 l8-14" stroke="#f5cba7" stroke-width="4" stroke-linecap="round"/>
            <circle cx="245" cy="96" r="11" fill="none" stroke="#ff3d00" stroke-width="6"/>`,

        altura: `
            <rect width="400" height="145" fill="#182838"/>
            <polygon points="255,135 285,12 315,135" fill="none" stroke="#90a4ae" stroke-width="4"/>
            <line x1="265" y1="45" x2="305" y2="45" stroke="#90a4ae" stroke-width="3"/>
            <line x1="260" y1="80" x2="310" y2="80" stroke="#90a4ae" stroke-width="3"/>
            <line x1="285" y1="15" x2="230" y2="85" stroke="#ffd600" stroke-width="2.5"/>
            <circle cx="230" cy="88" r="9" fill="#ff5722" ${sw}/>`
    };
    return cenarios[categoria] || cenarios.predial;
}

// ---------- 2. CARICATURA TEMÁTICA SIMPLES DE CADA SOCORRO ----------
// (Mantenha o desenharCenarioTematicoSVG como está e substitua apenas a função abaixo)

function gerarIlustracaoCenaSVG(categoria, etapaIdx, estadoAcao, missaoId) {
    const papel = ["Jovem", "Oficial", "Superior"][etapaIdx] || "Jovem";
    const usaEPI = etapaIdx === 0;

    const corTag = estadoAcao === "correta" ? "#2e7d32"
        : estadoAcao === "parcial" ? "#ef6c00"
        : estadoAcao === "errada" ? "#c62828" : "#111";
        
    const txtTag = estadoAcao === "correta" ? "✔ MANOBRA PADRÃO"
        : estadoAcao === "parcial" ? "⚠️ IMPROVISO (D10)"
        : estadoAcao === "errada" ? "🚨 ALTO RISCO (D10)"
        : `🚨 ${estadoJogo.corpoBombeiros.toUpperCase()} — ${estadoJogo.viaturasSelecionadas.join(", ")}`;

    const idNum = missaoId || (estadoJogo.ocorrenciaAtual ? estadoJogo.ocorrenciaAtual.id : 1);
    const posY = etapaIdx === 0 ? "0%" : etapaIdx === 1 ? "50%" : "100%";

    // Tenta carregar o tríptico correspondente à missão (ex: imagens/missao_1.png, imagens/missao_2.png...)
    // Se a imagem ainda não existir na pasta, o código cai no vetor padrão abaixo para não dar erro na tela.
    return `  
    <div style="width:100%; height:100%; background-image: url('imagens/missao_${idNum}.png'), url('imagens/Resgate da Serpente no Poste.png'); background-size: 100% 300%; background-position: 0 ${posY}; background-repeat: no-repeat; position: relative; background-color: #1a1d24;">  
        <div style="position: absolute; top: 8px; left: 50%; transform: translateX(-50%); background: ${corTag}; opacity: 0.92; border: 1.2px solid #ffca28; padding: 2px 10px; border-radius: 5px; color: #fff; font-size: 10.5px; font-weight: bold; text-align: center; z-index: 5;">  
            ${txtTag}  
        </div>  
    </div>`;
}
// ---------- 3. PROCESSAMENTO DAS ESCOLHAS E DADO D10 ----------
function processarEscolha(escolha) {
    clearInterval(estadoJogo.intervaloTimer);
    document.querySelectorAll(".btn-escolha").forEach(b => b.disabled = true);
    const oc = estadoJogo.ocorrenciaAtual;
    document.getElementById("ilustracao-cena-box").innerHTML = gerarIlustracaoCenaSVG(oc.categoria, estadoJogo.etapaAtual, escolha.tipo);

    if (escolha.tipo === "correta") {
        if (typeof Som !== "undefined") Som.efeito("vitoria");
        document.getElementById("lista-escolhas").innerHTML = "";
        const caixa = document.getElementById("caixa-dado");
        caixa.style.display = "flex";
        caixa.innerHTML = `
            <h4 style="color:#4caf50;">✔ Decisão Técnica Ideal!</h4>
            <p>${escolha.consequencia}</p>
            <button class="btn-principal" style="margin-top:4px; width:100%;" onclick="avancarEtapaOuConcluir(true)">Prosseguir para Próximo Desdobramento ➔</button>`;
        return;
    }
    rolarDadoTelaCheia(escolha);
}

function rolarDadoTelaCheia(escolha) {
    const ov = document.getElementById("overlay-dado");
    const numero = document.getElementById("d10-numero");
    const wrap = document.getElementById("d10-wrap");
    const barra = document.getElementById("dado-barra-preench");
    const btn = document.getElementById("dado-continuar");
    const texto = document.getElementById("dado-texto");

    const attrObj = estadoJogo.atributos[escolha.atributoTeste] || { valor: 5 };
    const base = attrObj.valor;
    const mod = escolha.bonusParcial || 0;
    const alvo = Math.max(1, Math.min(9, base + estadoJogo.bonusDadoAtivo + mod));
    const rotulo = escolha.tipo === "parcial" ? "⚠️ Improviso Tático (D10)" : "🚨 Conduta de Alto Risco (D10)";

    ov.style.display = "flex";
    wrap.classList.remove("parado");
    numero.style.color = "#fff";
    btn.style.display = "none";
    texto.innerText = "";
    document.getElementById("dado-titulo").innerText = rotulo;
    document.getElementById("dado-alvo").innerHTML = `Teste de <strong>${escolha.atributoTeste}</strong>: precisa rolar <strong>${alvo} ou menos</strong> no D10`;
    barra.style.transition = "none";
    barra.style.width = "0%";
    void barra.offsetWidth;
    barra.style.transition = `width ${DADO_MS}ms linear`;
    barra.style.width = "100%";
    if (typeof Som !== "undefined") Som.efeito("dado");

    const t0 = performance.now();
    const girar = () => {
        const dec = performance.now() - t0;
        if (dec >= DADO_MS) return revelar();
        numero.innerText = Math.floor(Math.random() * 10) + 1;
        setTimeout(girar, 75);
    };
    girar();

    function revelar() {
        const rolagem = Math.floor(Math.random() * 10) + 1;
        const ok = rolagem <= alvo;
        wrap.classList.add("parado");
        numero.innerText = rolagem;
        numero.style.color = ok ? "#a5d6a7" : "#ef9a9a";
        document.getElementById("dado-titulo").innerText = ok ? `✔ PASSOU NO D10! (Rolou ${rolagem})` : `✖ FALHOU NO D10! (Rolou ${rolagem})`;
        if (typeof Som !== "undefined") Som.efeito(ok ? "vitoria" : "fracasso");

        if (ok) {
            texto.innerText = "Apesar do risco, a guarnição compensou na técnica e evitou efeitos colaterais!";
        } else {
            estadoJogo.falhasNaMissao++;
            texto.innerText = escolha.consequenciaFalha;
        }
        btn.style.display = "block";
        btn.onclick = () => {
            ov.style.display = "none";
            if (typeof Som !== "undefined") Som.retomar();
            avancarEtapaOuConcluir(ok);
        };
    }
}

// ---------- 4. CERIMÔNIA DE PROMOÇÃO ----------
function desenharInsignia(quadro, i, cx, cy) {
    const estrela = (x, y, s) => `<polygon points="${[0, 1, 2, 3, 4].map(k => { const a = k * 1.2566 - 1.5708, b = a + .6283; return `${(x + Math.cos(a) * s).toFixed(1)},${(y + Math.sin(a) * s).toFixed(1)} ${(x + Math.cos(b) * s * .4).toFixed(1)},${(y + Math.sin(b) * s * .4).toFixed(1)}`; }).join(" ")}" fill="#ffd54f" stroke="#7a5a00" stroke-width="1.5"/>`;
    if (quadro === "praca") return Array.from({ length: Math.min(i, 4) }, (_, k) => `<path d="M${cx - 18} ${cy + k * 9 - 10}l18 -9l18 9" fill="none" stroke="#ffd54f" stroke-width="5"/>`).join("") + (i > 4 ? estrela(cx, cy - 22, 9) : "");
    if (quadro === "oficial") return i === 0 ? `<rect x="${cx - 14}" y="${cy - 3}" width="28" height="6" fill="#ffd54f"/>` : Array.from({ length: i }, (_, k) => estrela(cx + (k - (i - 1) / 2) * 26, cy, 11)).join("");
    return Array.from({ length: i + 1 }, (_, k) => estrela(cx + (k - i / 2) * 30, cy, 14)).join("");
}

function desenharBandeira(pais, x, y) {
    const f = {
        "Brasil": `<rect width="62" height="40" fill="#1b9a4a"/><polygon points="31,4 58,20 31,36 4,20" fill="#ffd600"/><circle cx="31" cy="20" r="9" fill="#1a3a8a"/>`,
        "Estados Unidos": `<rect width="62" height="40" fill="#fff"/>${[0, 1, 2, 3].map(k => `<rect y="${k * 11.4}" width="62" height="5.7" fill="#c62828"/>`).join("")}<rect width="28" height="22" fill="#283593"/>`,
        "Rússia": `<rect width="62" height="14" fill="#fff"/><rect y="13" width="62" height="14" fill="#1e46a8"/><rect y="26" width="62" height="14" fill="#d32f2f"/>`,
        "Portugal": `<rect width="25" height="40" fill="#1b7a3a"/><rect x="25" width="37" height="40" fill="#d32f2f"/><circle cx="25" cy="20" r="7" fill="#ffd600"/>`
    }[pais] || "";
    return `<rect x="${x}" y="${y}" width="3" height="120" fill="#ccc"/><g transform="translate(${x + 3},${y + 2})" stroke="#16110a" stroke-width="1.5">${f}</g>`;
}

function iniciarCerimonia() {
    const p = estadoJogo.filaPromocoes.shift();
    if (!p) {
        if (typeof Som !== "undefined") Som.retomar();
        mostrarTela("tela-quartel");
        abrirAbaQuartel("carreira");
        return;
    }
    const Papel = { praca: "Jovem", oficial: "Oficial", superior: "Superior" }[p.quadro];
    const ato = { praca: "Boletim da Corporação", oficial: "Decreto do Governador", superior: "Decreto lido pelo Comandante-Geral" }[p.quadro];
    const passos = [
        ["🎺 Corneta", `Toque de formatura! A tropa se alinha no pátio do quartel para a solenidade.`],
        ["Comandante", `“${ato}: pelo mérito operacional, fica promovido de ${p.de} a ${p.para}!”`],
        ["Comandante", "“Receba suas novas insígnias e a responsabilidade que vem com elas.”"],
        ["Guarnição", "“Vida alheia e riquezas salvar!” Escolha agora o atributo que será aprimorado."]
    ];

    const cena = etapa => `<svg viewBox="0 0 400 210">
        <rect width="400" height="210" fill="#26354d"/>
        <rect y="175" width="400" height="35" fill="#3a2e24"/>
        ${desenharBandeira(estadoJogo.corpoBombeiros, 18, 18)}
        ${desenharBonecoBombeiro(115, Papel, false, true)}
        ${etapa >= 1 ? desenharBonecoBombeiro(220, "Superior", false, true) : ""}
        ${etapa >= 2 ? `<rect x="245" y="10" width="135" height="50" rx="8" fill="#1d2a44" stroke="#ffca28" stroke-width="2.5"/>${desenharInsignia(p.quadro, p.idxNovo, 312, 36)}` : ""}
    </svg>`;

    mostrarTela("tela-cerimonia");
    document.getElementById("cer-titulo").innerText = `🎖️ Promoção: ${p.de} → ${p.para}`;
    const botoes = document.getElementById("cer-botoes");
    let i = 0;

    const mostrar = () => {
        document.getElementById("cer-cena").innerHTML = cena(i);
        document.getElementById("cer-dialogo").innerHTML = `<strong>${passos[i][0]}:</strong> ${passos[i][1]}`;
        if (i === 2 && typeof Som !== "undefined") Som.efeito("vitoria");
        botoes.innerHTML = "";
        const b = document.createElement("button");
        b.className = "btn-principal";
        b.innerText = i < passos.length - 1 ? "Continuar Solenidade ➔" : "Escolher Evolução de Atributo ➔";
        b.onclick = () => { if (++i < passos.length) mostrar(); else escolherEvolucao(p); };
        botoes.appendChild(b);
    };
    mostrar();
}

function escolherEvolucao(p) {
    const cargo = { praca: "Praça", oficial: "Oficial", superior: "Estado-Maior" }[p.quadro];
    document.getElementById("cer-dialogo").innerHTML = `<strong>Nova patente: ${p.para}.</strong> Escolha o atributo de ${cargo} que recebe +1 ponto:`;
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
