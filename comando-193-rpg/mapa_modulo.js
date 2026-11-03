/**
 * ==========================================
 * MÓDULO DO MAPA TÁTICO (CBMERJ Tactical RPG)
 * Isolado para ativação/desativação posterior.
 * ==========================================
 */

const COORDENADAS_MAPA_CATEGORIA = {
    aquatico:  { x: 15, y: 72, icone: "🌊" },
    florestal: { x: 80, y: 22, icone: "🌲" },
    busca:     { x: 85, y: 42, icone: "🐕" },
    altura:    { x: 65, y: 28, icone: "🧗" },
    predial:   { x: 45, y: 48, icone: "🏢" },
    crise:     { x: 55, y: 36, icone: "🚨" },
    animal:    { x: 35, y: 30, icone: "🐍" },
    veicular:  { x: 60, y: 74, icone: "🚗" },
    hazmat:    { x: 75, y: 68, icone: "☣️" },
    especial:  { x: 40, y: 62, icone: "⚡" },
    colapso:   { x: 50, y: 64, icone: "🧱" },
    pericia:   { x: 30, y: 48, icone: "🔍" }
};

function renderizarMapaTaticoQuartel() {
    const containerSocorros = document.getElementById("aba-quartel-socorros");
    if (!containerSocorros) return;

    let pinosHTML = "";
    
    if (typeof estadoJogo !== "undefined" && estadoJogo.missoesAtivasIds.length > 0) {
        estadoJogo.missoesAtivasIds.forEach((idOc, idx) => {
            const oc = CATALOGO_100_MISSOES.find(o => o.id === idOc);
            if (!oc) return;
            
            const isLeft = idx < 3; 
            const baseCoord = COORDENADAS_MAPA_CATEGORIA[oc.categoria] || { x: 50, y: 50 };
            let finalX = isLeft ? (baseCoord.x % 40) + 5 : (baseCoord.x % 40) + 55;
            let finalY = Math.max(15, Math.min(85, baseCoord.y + ((idx % 3) - 1) * 22));
            const catClass = oc.ehCatastrofe ? "catastrofe" : "";
            const icone = oc.ehCatastrofe ? "🌋" : (baseCoord.icone || "🚨");

            pinosHTML += `<button class="pino-ocorrencia ${catClass}" style="left:${finalX}%; top:${finalY}%;" onclick="abrirDetalheMissao(${oc.id}, this)">${icone}</button>`;
        });
    }
    
    if (!document.getElementById("mapa-tatico-box-principal")) {
        containerSocorros.innerHTML = `
            <div id="mapa-tatico-box-principal" class="mapa-tatico-box">
                <div class="mapa-tatico-viewport">
                    <div class="mapa-tatico-canvas">
                        <svg class="fundo-mapa" viewBox="0 0 400 195" preserveAspectRatio="none">
                            <rect width="400" height="195" fill="#1b2d24"/>
                            <path d="M0 0 H125 Q140 65 110 115 Q95 155 150 195 H0 Z" fill="#0d3b66"/>
                            <path d="M118 0 Q135 65 105 115 Q90 155 145 195" fill="none" stroke="#e0c097" stroke-width="5"/>
                            <path d="M235 0 H400 V95 Q310 85 265 45 Z" fill="#14361d"/>
                            <path d="M125 95 H400 M215 0 V195 M135 40 L370 175" stroke="#37474f" stroke-width="6" fill="none"/>
                            <path d="M125 95 H400 M215 0 V195" stroke="#ffca28" stroke-width="1" stroke-dasharray="5,5" fill="none"/>
                            <line x1="0" y1="65" x2="400" y2="65" stroke="rgba(100,255,218,0.1)" stroke-width="1"/>
                            <line x1="0" y1="130" x2="400" y2="130" stroke="rgba(100,255,218,0.1)" stroke-width="1"/>
                            <line x1="133" y1="0" x2="133" y2="195" stroke="rgba(100,255,218,0.1)" stroke-width="1"/>
                            <line x1="266" y1="0" x2="266" y2="195" stroke="rgba(100,255,218,0.1)" stroke-width="1"/>
                        </svg>
                        <span class="rotulo-mapa" style="left:6%; top:80%; color:#64b5f6;">BAÍA / Orla</span>
                        <span class="rotulo-mapa" style="left:44%; top:41%; color:#cfd8dc;">CENTRO URBANO</span>
                        <span class="rotulo-mapa" style="left:80%; top:10%; color:#81c784;">SERRA / FLORESTA</span>
                        <span class="rotulo-mapa" style="left:74%; top:84%; color:#ffb74d;">POLO IND / BR</span>
                        
                        <div id="container-pinos" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none;">
                            ${pinosHTML}
                        </div>
                    </div>
                </div>
            </div>
            <div id="detalhe-chamado-mapa" class="detalhe-chamado-mapa"></div>
        `;
    } else {
        const containerPinos = document.getElementById("container-pinos");
        if (containerPinos) containerPinos.innerHTML = pinosHTML;
    }
}

function abrirDetalheMissao(idOc, elementoBtn) {
    if (typeof estadoJogo !== "undefined") estadoJogo.missaoSelecionadaMapaId = idOc;
    
    document.querySelectorAll('.pino-ocorrencia').forEach(p => p.classList.remove('selecionado'));
    if (elementoBtn) elementoBtn.classList.add('selecionado');

    const ocSel = CATALOGO_100_MISSOES.find(o => o.id === idOc);
    const detalheBox = document.getElementById("detalhe-chamado-mapa");

    if (ocSel && detalheBox) {
        const thumbSVG = typeof desenharCenarioTematicoSVG === "function"
            ? `<svg viewBox="170 0 230 145" preserveAspectRatio="xMidYMid slice">${desenharCenarioTematicoSVG(ocSel.categoria)}</svg>`
            : "";
        
        detalheBox.className = "detalhe-chamado-mapa ativo" + (ocSel.ehCatastrofe ? " catastrofe-card" : "");
        detalheBox.innerHTML = `
            <div class="card-chamado-topo">
                <div class="thumb-missao">${thumbSVG}</div>
                <div style="flex:1;">
                    <h4 style="color:${ocSel.ehCatastrofe ? '#ffeb3b' : '#ffca28'}; font-size:12.5px;">${ocSel.titulo}</h4>
                    <p style="font-size:11px; color:#ddd; margin:2px 0;">${ocSel.resumo}</p>
                    <p style="font-size:10.5px; color:#90caf9;">🎓 Curso: <strong>${ocSel.cursoRecomendado}</strong> | XP: <strong>+${Math.floor(ocSel.xpRecompensa / ocSel.etapas.length)} por etapa</strong> (${ocSel.etapas.length} etapas)</p>
                </div>
            </div>
            <div class="botoes-card-mapa" style="display:flex; gap:6px; margin-top:6px;">
                <button class="btn-cancelar" onclick="fecharDetalheMissao()" style="padding:8px; background:#333; color:#fff; border:none; border-radius:6px; cursor:pointer;">❌ Cancelar</button>
                <button class="btn-principal" style="flex:1; padding:8px; font-size:12px;" onclick="iniciarDespacho(${ocSel.id})">
                    ${ocSel.ehCatastrofe ? "🌋 ATENDER CATÁSTROFE" : "🚨 INICIAR MISSÃO"}
                </button>
            </div>
        `;
    }
}

function fecharDetalheMissao() {
    const detalheBox = document.getElementById("detalhe-chamado-mapa");
    if (detalheBox) detalheBox.classList.remove("ativo");
    document.querySelectorAll('.pino-ocorrencia').forEach(p => p.classList.remove('selecionado'));
}