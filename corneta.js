// ==========================================================
// corneta.js — toques de corneta e música da Reserva.
// Usa o player oficial (Widget API) do SoundCloud com fallback
// imediato em Web Audio para nunca deixar a solenidade muda.
// ==========================================================
const Corneta = (() => {
    const SET = "https://soundcloud.com/user-724804090/sets/toques-de-corneta";
    const RESERVA = "https://soundcloud.com/jcrap-sc/herois-entre-as-chamas";

    // Palavras-chave (sem acento, minúsculas) testadas na ordem contra os títulos da playlist
    const BUSCA = {
        sentido:        [["sentido"]],
        ombroarma:      [["ombro", "arma"], ["ombro"]],
        apresentararma: [["apresentar", "arma"], ["apresentar"]],
        continencia:    [["continencia", "bandeira"], ["em", "continencia"], ["bandeira"], ["continencia"]],
        sargento:       [["sargento"], ["praca"], ["graduado"], ["subtenente"], ["cabo"]],
        oficiais:       [["oficiais"], ["oficial"], ["tenente"], ["capitao"]],
        cmtchefe:       [["comandante"], ["cmt"], ["chefe"], ["diretor"], ["coronel"], ["superior"]]
    };

    // Toques de corneta em harmônicos naturais (Dó4=262, Sol4=392, Dó5=523, Mi5=659, Sol5=784)
    const SINT = {
        sentido: [
            [392, .18], [392, .18], [523, .65]
        ],
        ombroarma: [
            [262, .18], [392, .18], [523, .65]
        ],
        apresentararma: [
            [392, .20], [523, .20], [659, .70]
        ],
        continencia: [
            [262, .30], [392, .30], [523, .45], [659, .45],
            [523, .30], [392, .30], [523, .75],
            [659, .30], [784, .55], [659, .35], [523, .95]
        ],
        sargento: [
            [392, .22], [523, .22], [392, .22], [523, .45],
            [659, .25], [523, .75]
        ],
        oficiais: [
            [392, .20], [523, .20], [659, .35], [523, .20],
            [659, .35], [784, .85]
        ],
        cmtchefe: [
            [523, .22], [659, .22], [784, .38], [659, .22],
            [784, .38], [659, .22], [523, .22], [784, .95]
        ],
        reserva: [
            [392, .32], [494, .32], [587, .32], [784, .65],
            [659, .32], [587, .32], [523, .32], [494, .65],
            [440, .32], [523, .32], [659, .32], [784, .65],
            [587, .32], [494, .32], [392, .85]
        ]
    };

    let w = null, sons = null, pronto = false, falhou = false;
    let atual = null, ctx = null, timSint = null, timWatch = null;

    const norm = s => (s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9 ]/g, " ");

    function achar(chave) {
        if (!sons || !sons.length) return null;
        for (const palavras of (BUSCA[chave] || [])) {
            const f = sons.find(s => palavras.every(p => norm(s.titulo).includes(p)));
            if (f) return f.url;
        }
        return null;
    }

    function pararSint() {
        clearTimeout(timSint);
        clearTimeout(timWatch);
        timSint = null;
        timWatch = null;
    }

    function sintetizar(it) {
        pararSint();
        const frase = SINT[it.chave];
        if (!frase) return;
        ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
        if (ctx.state === "suspended" && ctx.resume) ctx.resume();

        let t = ctx.currentTime + 0.04;
        frase.forEach(([f, d]) => {
            const o = ctx.createOscillator();
            const g = ctx.createGain();
            const lp = ctx.createBiquadFilter();
            o.type = "sawtooth";
            o.frequency.value = f;
            lp.type = "lowpass";
            lp.frequency.value = 1950;

            g.gain.setValueAtTime(0.0001, t);
            g.gain.linearRampToValueAtTime(0.14, t + 0.025);
            g.gain.setValueAtTime(0.14, t + d * 0.82);
            g.gain.exponentialRampToValueAtTime(0.0001, t + d);

            o.connect(lp);
            lp.connect(g);
            g.connect(ctx.destination);
            o.start(t);
            o.stop(t + d + 0.04);
            t += d + 0.045;
        });

        const totalMs = (t - ctx.currentTime) * 1000;
        timSint = setTimeout(() => aoAcabar(it), totalMs + (it.loop ? 350 : 60));
    }

    function aoAcabar(it) {
        if (it !== atual) return;
        if (it.loop) {
            sintetizar(it);
            return;
        }
        atual = null;
        if (it.aoFim) it.aoFim();
    }

    function executar(it) {
        if (it !== atual) return;

        // Se o SoundCloud ainda não carregou ou falhou, toca o sintetizador imediatamente
        // para que nenhum toque ("Em Continência à Bandeira", "Praça", "Oficial", "Comandante" ou "Reserva") fique mudo
        if (falhou || !pronto) {
            return sintetizar(it);
        }

        const url = it.url || achar(it.chave);
        if (!url) {
            return sintetizar(it);
        }

        let tocouSC = false;
        pararSint();

        // Se o SoundCloud não iniciar o áudio em 1.2s (ex.: bloqueio de autoplay ou faixa indisponível), entra o sintetizador
        timWatch = setTimeout(() => {
            if (!tocouSC && it === atual) {
                sintetizar(it);
            }
        }, 1200);

        try {
            w.load(url, {
                auto_play: true,
                show_comments: false,
                visual: false,
                hide_related: true,
                callback: () => {
                    if (it !== atual) return;
                    w.setVolume(85);
                    w.play();
                }
            });
            w.bind(SC.Widget.Events.PLAY, () => {
                tocouSC = true;
                clearTimeout(timWatch);
            });
            w.bind(SC.Widget.Events.ERROR, () => {
                if (it === atual) sintetizar(it);
            });
        } catch (e) {
            sintetizar(it);
        }
    }

    function iniciar() {
        if (w || falhou) return;
        const montar = () => {
            try {
                const f = document.createElement("iframe");
                f.allow = "autoplay";
                f.style.cssText = "position:fixed;right:0;bottom:0;width:120px;height:120px;opacity:.01;pointer-events:none;border:0;";
                f.src = "https://w.soundcloud.com/player/?url=" + encodeURIComponent(SET) + "&auto_play=false&hide_related=true&show_comments=false&visual=false";
                document.body.appendChild(f);
                w = SC.Widget(f);
                w.bind(SC.Widget.Events.READY, () => {
                    if (sons) return;
                    w.getSounds(l => {
                        sons = (l || []).map(s => ({ titulo: s.title || "", url: s.permalink_url }));
                        pronto = true;
                        console.info("[Corneta] Faixas carregadas:", sons.map(s => s.titulo));
                    });
                });
                w.bind(SC.Widget.Events.FINISH, () => {
                    if (atual && !timSint) aoAcabar(atual);
                });
            } catch (e) {
                falhou = true;
            }
        };

        if (window.SC && window.SC.Widget) {
            montar();
        } else {
            const s = document.createElement("script");
            s.src = "https://w.soundcloud.com/player/api.js";
            s.onload = montar;
            s.onerror = () => { falhou = true; };
            document.head.appendChild(s);
        }
    }

    // Pré-carrega o widget silenciosamente assim que o arquivo é lido
    if (document.readyState === "loading") {
        window.addEventListener("DOMContentLoaded", iniciar);
    } else {
        iniciar();
    }

    const api = {
        tocar(chave, opc = {}) {
            pararSint();
            atual = { chave, loop: !!opc.loop, aoFim: opc.aoFim };
            if (w && pronto) { try { w.pause(); } catch (e) {} }
            iniciar();
            executar(atual);
        },
        sequencia(chaves, aoFim) {
            if (!chaves.length) { if (aoFim) aoFim(); return; }
            api.tocar(chaves[0], { aoFim: () => api.sequencia(chaves.slice(1), aoFim) });
        },
        musica() {
            pararSint();
            atual = { chave: "reserva", url: RESERVA, loop: true };
            if (w && pronto) { try { w.pause(); } catch (e) {} }
            iniciar();
            executar(atual);
        },
        parar() {
            pararSint();
            atual = null;
            if (w && pronto) { try { w.pause(); } catch (e) {} }
        },
        titulos() { return sons ? sons.map(s => s.titulo) : []; }
    };
    return api;
})();