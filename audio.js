// ==========================================================  
// audio.js — trilhas e efeitos específicos por tipo de socorro.  
// ==========================================================  
const Som = (() => {  
    // Mapeamento dos arquivos de áudio na pasta 'audio/'
    const ARQ = { 
        abertura: "audio/abertura.mp3", 
        socorro: "audio/socorro.mp3", 
        dado: "audio/dado.mp3", 
        vitoria: "audio/vitoria.mp3", 
        fracasso: "audio/fracasso.mp3",
        // Sons específicos por categoria de ocorrência:
        animal: "audio/tema_animal.mp3",
        predial: "audio/tema_predial.mp3",
        florestal: "audio/tema_florestal.mp3",
        hazmat: "audio/tema_quimica.mp3",
        aquatico: "audio/tema_busca.mp3",
        colapso: "audio/tema_colapso.mp3",
        veicular: "audio/tema_veicular.mp3",
        pericia: "audio/tema_altura.mp3",
        crise: "audio/tema_crise.mp3",
        especial: "audio/tema_carro_eletrico.mp3"
    };  

    const LOOP = { 
        tema_abertura: true, 
        tema_socorro: true, 
        tema_animal: true, 
        tema_predial: true, 
        tema_florestal: true, 
        tema_hazmat: true, 
        tema_aquatico: true, 
        tema_colapso: true, 
        tema_veicular: true, 
        tema_pericia: true, 
        tema_crise: true, 
        tema_especial: true 
    };  

    const TELA = { 
        "tela-abertura": "abertura", 
        "tela-criacao": "abertura", 
        "tela-cerimonia": "abertura", 
        "tela-quartel": "socorro", 
        "tela-despacho": "socorro", 
        "tela-ocorrencia": "socorro" 
    };  

    const SFX = {  
        vitoria: [[523, 0, .14], [659, .14, .14], [784, .28, .14], [1047, .42, .8]],  
        fracasso: [[392, 0, .28], [311, .3, .28], [247, .6, .28], [185, .9, 1]]  
    };  

    const LOOPS = {  
        abertura: { ms: 230, f: (i, t) => {  
            if (i % 8 === 0) nota([110, 110, 87.3, 98][(i >> 3) & 3], t, 1.6, "sawtooth", .045);  
            nota([220, 262, 330, 440, 330, 262, 220, 196][i % 8], t, .5, "triangle", .06);  
        } },  
        socorro: { ms: 125, f: (i, t) => {  
            if (i % 4 === 0) nota(55, t, .2, "square", .05);  
            if (i % 2 === 1) nota([196, 233, 262, 233][(i >> 2) & 3], t, .1, "sawtooth", .03);  
            if (i % 16 === 15) nota(880, t, .08, "square", .025);  
        } }  
    };  

    let ctx = null, ligado = false, fundo = null, tocando = null, el = null, tim = null, gen = 0;  
    const semArquivo = {};  
  
    const AC = () => ctx || (ctx = new (window.AudioContext || window.webkitAudioContext)());  
  
    function nota(f, t, d, tipo = "triangle", v = .07) {  
        const c = AC(), o = c.createOscillator(), g = c.createGain();  
        o.type = tipo; o.frequency.value = f;  
        g.gain.setValueAtTime(.0001, t);  
        g.gain.linearRampToValueAtTime(v, t + .02);  
        g.gain.exponentialRampToValueAtTime(.0001, t + d);  
        o.connect(g); g.connect(c.destination);  
        o.start(t); o.stop(t + d + .05);  
    }  
  
    function sintDado() {  
        const c = AC(), t0 = c.currentTime;  
        let t = 0, gap = .85;  
        while (t < 5) { nota(60, t0 + t, .18, "sine", .22); nota(48, t0 + t + .16, .16, "sine", .15); t += gap; gap = Math.max(.28, gap * .86); }  
        const o = c.createOscillator(), g = c.createGain();  
        o.type = "sawtooth";  
        o.frequency.setValueAtTime(70, t0); o.frequency.exponentialRampToValueAtTime(700, t0 + 5);  
        g.gain.setValueAtTime(.0001, t0); g.gain.exponentialRampToValueAtTime(.05, t0 + 4.9); g.gain.exponentialRampToValueAtTime(.0001, t0 + 5.2);  
        o.connect(g); g.connect(c.destination); o.start(t0); o.stop(t0 + 5.3);  
    }  
  
    function parar() {  
        clearInterval(tim); gen++; tocando = null;  
        if (el) { el.pause(); el = null; }  
    }  
  
    function sintetizar(nome) {  
        const meu = ++gen;  
        if (nome === "dado") return sintDado();  
        if (SFX[nome]) { const t0 = AC().currentTime; SFX[nome].forEach(([f, a, d]) => nota(f, t0 + a, d, "triangle", .09)); return; }  
        const L = LOOPS[nome] || LOOPS["socorro"]; 
        let i = 0;  
        tim = setInterval(() => { if (meu === gen) L.f(i++, AC().currentTime + .02); }, L.ms);  
    }  
  
    function tocar(nome) {  
        if (!ligado) return;  
        parar(); tocando = nome;  
        const arquivoSom = ARQ[nome] || ARQ["socorro"];
        if (semArquivo[nome]) return sintetizar(nome);  
        
        const a = new Audio(arquivoSom);  
        a.loop = !!LOOP[nome]; a.volume = .6; el = a;  
        const falhou = () => { if (el === a) { semArquivo[nome] = true; el = null; sintetizar(nome); } };  
        a.addEventListener("error", falhou);  
        const p = a.play();  
        if (p && p.catch) p.catch(e => { if (e.name !== "NotAllowedError") falhou(); });  
    }  
  
    return {  
        alternar() {  
            ligado = !ligado;  
            if (ligado) { AC().resume && AC().resume(); tocar(fundo || "abertura"); } else parar();  
            return ligado;  
        },  
        fundo(tela) {  
            const n = TELA[tela]; if (!n) return;  
            fundo = n;  
            if (ligado && tocando !== n) tocar(n);  
        },  
        // 🚨 NOVO: Permite chamar a trilha específica da categoria do socorro!
        tocarSocorro(categoria) {
            if (ARQ[categoria]) {
                fundo = categoria;
                if (ligado) tocar(categoria);
            }
        },
        efeito(nome) { tocar(nome); },  
        retomar() { if (ligado && fundo) tocar(fundo); },  
        pausar() { parar(); }  
    };  
})();  
  
function alternarMusica() {  
    const on = Som.alternar();  
    document.getElementById("btn-musica").innerText = "🎵 Trilha Instrumental: " + (on ? "ON" : "OFF");  
}