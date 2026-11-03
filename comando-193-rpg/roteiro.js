// ==========================================================
// roteiro.js — Etapas 2 (Oficial) e 3 (Estado-Maior) específicas
// por tipo de ocorrência.
// ==========================================================
const GRUPOS_MISSOES = {
    animal:    [1, 17, 23, 36, 51, 59, 67, 79, 91],
    florestal: [7, 13, 52, 60, 73, 85, 97],
    busca:     [9, 11, 53, 63, 75, 87, 99],
    predial:   [2, 18, 29, 37, 41, 54, 68, 80, 92],
    especial:  [21, 24, 27, 33, 46, 55, 62, 78, 90],
    hazmat:    [3, 19, 26, 35, 43, 44, 50, 56, 69, 81, 93],
    crise:     [4, 31, 47, 57, 70, 82, 94],
    pericia:   [5, 39, 49, 58, 71, 83, 95],
    veicular:  [6, 22, 34, 40, 61, 72, 84, 96],
    colapso:   [10, 30, 64, 76, 88, 100],
    aquatico:  [8, 12, 16, 32, 38, 48, 65, 74, 86, 98],
    altura:    [14, 15, 20, 25, 28, 42, 45, 66, 77, 89]
};

const ROTEIROS = {
    animal: {
        o: ["O animal está contido, mas o público cresce em volta. Como o oficial organiza a cena?",
            "Isolar um raio de segurança, limitar a equipe ao mínimo necessário e designar um único responsável pela captura",
            "Deixar três bombeiros agindo ao mesmo tempo, sem divisão de funções, para acabar logo",
            "Pedir que os curiosos ajudem a cercar o animal para agilizar a operação",
            "Cena organizada: captura conduzida por um só responsável e ninguém exposto.",
            "A captura saiu, mas a equipe se atrapalhou e o animal ficou agitado por mais tempo.",
            "Civis se aproximaram do animal e o risco de acidente aumentou muito."],
        e: ["Animal contido. Falta decidir a destinação e fechar o registro da ocorrência.",
            "Entregar o animal ao tutor, ao órgão ambiental ou ao serviço veterinário, registrar a ocorrência e orientar a prevenção no local",
            "Soltar o animal na área verde mais próxima sem comunicar o órgão competente",
            "Deixar o animal com os moradores para que eles decidam o que fazer",
            "Destinação correta e ocorrência registrada: o risco de nova chamada caiu.",
            "A soltura improvisada gerou nova chamada no mesmo local dias depois.",
            "A guarda irregular do animal gerou novo acidente e problema legal."]
    },
    florestal: {
        o: ["O fogo em “{n}” avança com o vento e a equipe está espalhada. Como conduzir a operação?",
            "Definir ponto de encontro e rota de fuga, posicionar vigias e atacar a partir da área já queimada",
            "Abrir aceiro só na frente do fogo e dispensar o vigia para ter mais braços na linha",
            "Mandar a guarnição subir a encosta, a favor do vento, para cortar o fogo pela frente",
            "Linha de ataque segura: todos sabem por onde sair se o vento virar.",
            "Sem vigia, a mudança de vento pegou a equipe de surpresa e exigiu recuo às pressas.",
            "A guarnição ficou encurralada entre o fogo e a rocha; o recuo foi desesperado."],
        e: ["O fogo está controlado, mas há brasas e fumaça perto das casas. O Posto de Comando decide o encerramento.",
            "Manter rescaldo e monitoramento, avisar Defesa Civil e órgão ambiental e só liberar a área após vistoria",
            "Liberar as equipes ao anoitecer e deixar um único bombeiro vigiando a área",
            "Declarar encerrado assim que não houver chama visível e retirar todos",
            "Rescaldo bem conduzido: sem reignição e com a comunidade informada.",
            "Brasas ocultas reacenderam na madrugada e uma viatura precisou retornar.",
            "O fogo reiniciou sob a vegetação e voltou a ameaçar as casas."]
    },
    busca: {
        o: ["A busca em “{n}” entrou na segunda hora e o cansaço pesa nas equipes. O que o oficial decide?",
            "Dividir a área em setores, registrar o que cada equipe já varreu e revezar guarnições com hidratação e descanso",
            "Manter todas as equipes varrendo o mesmo trecho até esgotar a área mais provável",
            "Mandar cada bombeiro buscar por conta própria, sem rádio, para cobrir mais terreno",
            "Setorização feita: nenhuma área repetida e a equipe segue descansada.",
            "Trechos foram varridos duas vezes enquanto outros ficaram sem busca.",
            "Dois bombeiros se perderam e a operação ganhou novas pessoas para procurar."],
        e: ["A vítima foi localizada. O Posto de Comando organiza a retirada e o contato com a família.",
            "Acionar remoção compatível com o terreno, repassar o estado clínico ao hospital e informar a família por um único porta-voz",
            "Retirar pelo caminho mais curto, sem avaliar a coluna, para chegar logo ao hospital",
            "Liberar a informação à imprensa antes de avisar a família",
            "Retirada segura e família informada com respeito.",
            "A retirada apressada agravou a dor da vítima e atrasou o atendimento.",
            "A família soube pela imprensa e houve tumulto na espera."]
    },
    predial: {
        o: ["A guarnição está diante de “{n}” e o fogo avança. Como o oficial organiza a cena?",
            "Assumir o comando em posição externa, designar segurança e equipe de intervenção rápida (RIT) e controlar quem entra com EPR",
            "Entrar com a equipe de ataque para conduzir pessoalmente, deixando o comando sem responsável",
            "Mandar todos entrarem ao mesmo tempo para acabar logo com o fogo",
            "Comando externo e RIT prontos: a entrada ocorre com segurança.",
            "Sem comando externo, houve confusão na entrada e perda do controle do tempo de ar.",
            "Sem controle de entrada, o ar dos cilindros acabou em vários bombeiros ao mesmo tempo."],
        e: ["O fogo foi extinto. Resta a perícia, a administração do local e a imprensa aguardando orientação.",
            "Preservar o local para a perícia, vistoriar a estrutura com a Defesa Civil e emitir o boletim da ocorrência",
            "Liberar o local para limpeza imediata, já que o fogo foi extinto",
            "Orientar os moradores a retornarem sem vistoria da estrutura",
            "Local preservado e estrutura vistoriada: sem risco para quem retornou.",
            "A limpeza precoce destruiu vestígios importantes para a perícia.",
            "Parte da estrutura cedeu com moradores no interior; foi preciso novo socorro."]
    },
    especial: {
        o: ["“{n}” envolve risco além do fogo comum: energia, explosão ou produtos. O oficial define a estratégia.",
            "Pedir isolamento de energia ou produtos com o responsável técnico, fixar distância de segurança e atacar de cobertura",
            "Aproximar as viaturas para facilitar o ataque, mantendo o responsável técnico apenas por telefone",
            "Atacar com jato pleno imediatamente, sem confirmar o corte de energia ou o produto envolvido",
            "Risco especial controlado: ataque sem energia viva e com distância segura.",
            "A aproximação expôs as viaturas ao calor intenso e exigiu recuo.",
            "O jato sobre equipamento energizado ou produto reativo ampliou o sinistro."],
        e: ["O sinistro está sob controle, mas resta risco residual. O Posto de Comando integra empresas e órgãos de apoio.",
            "Manter monitoramento térmico, integrar a empresa responsável e a Defesa Civil e só liberar a área com laudo de segurança",
            "Liberar a área quando o monitoramento marcar temperatura aceitável uma única vez",
            "Entregar a área à empresa sem laudo, para que ela retome a operação",
            "Segurança confirmada por laudo e todos os órgãos alinhados.",
            "Um novo pico de temperatura surgiu horas depois e exigiu o retorno da guarnição.",
            "A retomada sem laudo causou reignição e nova evacuação."]
    },
    hazmat: {
        o: ["Em “{n}” a nuvem muda de direção com o vento. O oficial precisa definir as zonas de trabalho.",
            "Definir zonas quente, morna e fria a favor do vento, restringir o acesso a quem tem EPI adequado e montar corredor de descontaminação",
            "Definir só a zona quente e deixar a descontaminação para depois da operação",
            "Permitir que bombeiros sem proteção química entrem rapidamente para reduzir o tempo de vazamento",
            "Zonas bem definidas e descontaminação ativa: ninguém contaminado saiu da zona.",
            "Sem descontaminação, bombeiros levaram resíduo para a zona fria.",
            "Bombeiros sem proteção adequada se intoxicaram e precisaram de atendimento."],
        e: ["O vazamento foi contido. Órgão ambiental, prefeitura e vizinhança aguardam a orientação do Posto de Comando.",
            "Medir a atmosfera, definir a destinação do produto com o órgão ambiental e liberar o retorno da população só após a medição",
            "Liberar a população assim que o odor desaparecer",
            "Lavar o produto para o bueiro mais próximo para limpar a área rapidamente",
            "Atmosfera liberada por medição e produto destinado de forma correta.",
            "Sem medição, parte da população voltou e sentiu mal-estar.",
            "O produto atingiu a rede pluvial e gerou dano ambiental e multa."]
    },
    crise: {
        o: ["A pessoa em “{n}” ainda conversa com a equipe. O oficial deve proteger a cena sem pressioná-la.",
            "Manter um único negociador, reduzir ruído e público, isolar a área e deixar o resgate posicionado fora da vista",
            "Permitir que dois bombeiros falem ao mesmo tempo para ganhar a confiança mais rápido",
            "Pressionar a pessoa com prazo e aumentar o som das viaturas para que ela desista",
            "Um único interlocutor e cena calma: a pessoa segue conversando.",
            "Duas vozes confundiram a pessoa e a conversa precisou ser retomada do início.",
            "A pressão agravou a crise e a situação ficou muito mais perigosa."],
        e: ["A pessoa foi acolhida. O Posto de Comando decide o encaminhamento e a comunicação.",
            "Encaminhar com o SAMU e a rede de saúde mental, acolher a família e não divulgar detalhes à imprensa",
            "Liberar a pessoa com a família sem encaminhamento, por considerar o risco passado",
            "Divulgar o caso com detalhes à imprensa para mostrar o trabalho da corporação",
            "Encaminhamento correto e comunicação responsável.",
            "Sem acompanhamento, a pessoa voltou a ficar em risco dias depois.",
            "A divulgação detalhada expôs a pessoa e a família e gerou críticas."]
    },
    pericia: {
        o: ["No local de “{n}”, o oficial de dia chega para a vistoria e há curiosos e interessados no local.",
            "Isolar e fotografar o local, preservar os vestígios na posição original e registrar quem entra, com horário",
            "Deixar o proprietário acompanhar a vistoria para agilizar, sem registrar a entrada",
            "Remover os restos mais evidentes para ver melhor o foco do incêndio",
            "Local preservado e cadeia de custódia registrada.",
            "A presença sem registro abriu espaço para contestação do laudo.",
            "Vestígios foram alterados e o laudo perdeu confiabilidade."],
        e: ["A coleta terminou. Seguradora, polícia técnica e Defesa Civil aguardam o resultado.",
            "Concluir o laudo com base nos vestígios, indicar origem e causa com o grau de certeza e encaminhá-lo pelos canais oficiais",
            "Adiantar verbalmente a causa provável à seguradora antes de concluir o laudo",
            "Fechar a causa de acordo com a versão do proprietário, sem comparar com os vestígios",
            "Laudo técnico completo e entregue pelos canais oficiais.",
            "O adiantamento verbal gerou conflito entre o laudo e a versão informal.",
            "O laudo foi contestado e a corporação perdeu credibilidade."]
    },
    veicular: {
        o: ["Em “{n}” há vítimas, tráfego e risco de fogo ou combustível. O oficial organiza a cena.",
            "Estabilizar o veículo, sinalizar e isolar a pista, triar as vítimas pela gravidade e priorizar o APH",
            "Atender primeiro a vítima mais próxima, sem triagem, para ganhar tempo",
            "Liberar a pista para o trânsito andar, mesmo com o resgate em andamento",
            "Cena segura, triagem feita e vítimas graves atendidas primeiro.",
            "Uma vítima grave esperou mais do que devia enquanto a mais próxima era atendida.",
            "Um veículo passou rente à equipe de resgate e houve quase atropelamento."],
        e: ["As vítimas foram removidas. Polícia, concessionária e hospitais aguardam as informações do Posto de Comando.",
            "Repassar à regulação o número e o estado das vítimas, entregar a cena à perícia e à polícia e liberar a via após a limpeza",
            "Liberar a via e passar as informações aos hospitais só no dia seguinte",
            "Retirar as viaturas e deixar o combustível derramado na pista",
            "Hospitais preparados e via liberada com segurança.",
            "Os hospitais receberam as vítimas sem aviso e houve atraso na recepção.",
            "O combustível derramado causou novo acidente na mesma pista."]
    },
    colapso: {
        o: ["Em “{n}” a estrutura está instável e há risco de novo desmoronamento. Como o oficial protege as equipes?",
            "Escorar a estrutura, definir um vigia de estabilidade com sinal de evacuação e permitir só equipes essenciais na zona de busca",
            "Iniciar a busca com todas as equipes e escorar só se a estrutura se mexer",
            "Usar máquinas pesadas para retirar o entulho rapidamente, sem pausa para escuta",
            "Estrutura escorada, vigia posicionado e silêncio para escuta: busca segura.",
            "Uma pequena movimentação obrigou a evacuar às pressas e a busca parou.",
            "A vibração das máquinas soterrou ainda mais a vítima."],
        e: ["A vítima foi encontrada. O Posto de Comando coordena a retirada, o hospital e os órgãos de apoio.",
            "Retirar com técnica para vítima de esmagamento, acionar o APH avançado e pedir engenharia da Defesa Civil para a vistoria",
            "Retirar a vítima rapidamente, sem avaliação, para ganhar tempo",
            "Liberar o local aos moradores para pegarem seus pertences logo após o resgate",
            "Retirada técnica e estrutura sob vistoria da engenharia.",
            "A retirada brusca agravou as lesões da vítima.",
            "Moradores voltaram ao local instável e houve novo desabamento."]
    },
    aquatico: {
        o: ["Em “{n}” as condições da água mudam rápido. O oficial define a segurança e os meios do resgate.",
            "Avaliar correnteza e visibilidade, posicionar equipe de reserva, usar boia e corda e só entrar na água com flutuação e apoio",
            "Entrar na água sem apoio em terra para chegar mais rápido à vítima",
            "Mandar bombeiros sem flutuação nadarem até a vítima",
            "Resgate montado com reserva e flutuação: o socorrista não vira vítima.",
            "Sem apoio em terra, o socorrista se cansou e precisou ser socorrido.",
            "Mais de uma pessoa entrou em risco e a ocorrência cresceu."],
        e: ["A vítima foi retirada. O Posto de Comando organiza o atendimento e a informação à população.",
            "Encaminhar ao APH com monitoramento, manter a busca complementar e avisar a Defesa Civil sobre as condições do local",
            "Encerrar a busca ao retirar a vítima, sem confirmar se há mais pessoas",
            "Liberar o acesso à água logo após o resgate para normalizar o local",
            "Atendimento adequado e área monitorada: sem novas vítimas.",
            "Uma segunda pessoa ainda estava na água e foi localizada tarde.",
            "Novos banhistas entraram na água ainda perigosa."]
    },
    altura: {
        o: ["Em “{n}” a vítima está em local de difícil acesso e há risco de queda. O oficial monta o sistema.",
            "Montar ancoragem dupla e redundante, conferir o sistema com um segundo bombeiro e manter equipe de reserva com maca",
            "Usar ancoragem simples para ganhar tempo e conferir o sistema depois da subida",
            "Mandar o bombeiro subir sem sistema de segurança, só com o talabarte comum",
            "Sistema redundante conferido: acesso seguro até a vítima.",
            "A ancoragem simples exigiu parada para reforço e o tempo da vítima aumentou.",
            "O bombeiro sofreu queda parcial e foi preciso socorrer também o socorrista."],
        e: ["A vítima está estável. O Posto de Comando define a retirada e o atendimento posterior.",
            "Retirar com maca em posição adequada, manter monitoramento e passar o caso ao APH avançado com relato claro do estado e do tempo de suspensão",
            "Retirar a vítima de qualquer forma até o solo e só então avaliar",
            "Liberar o local sem investigar o motivo da queda ou do mal súbito",
            "Retirada técnica e passagem de caso completa ao APH.",
            "A retirada sem cuidado piorou o desconforto da vítima.",
            "A causa não foi investigada e o risco permaneceu para outras pessoas."]
    }
};

function gerarEtapasSuperiores(id, nome, categoriaDireta) {
    const grupo = (categoriaDireta && ROTEIROS[categoriaDireta])
        ? categoriaDireta
        : (Object.keys(GRUPOS_MISSOES).find(g => GRUPOS_MISSOES[g].includes(id)) || "predial");

    const r = ROTEIROS[grupo] || ROTEIROS.predial;
    const montar = (funcao, a, attrParcial, attrErrada) => ({
        funcao,
        dialogo: a[0].replace("{n}", nome),
        escolhas: [
            { texto: a[1], tipo: "correta", consequencia: a[4] },
            { texto: a[2], tipo: "parcial", atributoTeste: attrParcial, bonusParcial: 2, consequenciaFalha: a[5] },
            { texto: a[3], tipo: "errada", atributoTeste: attrErrada, bonusParcial: -2, consequenciaFalha: a[6] }
        ]
    });
    return [
        montar("OFICIAL (GERENCIAMENTO DO SOCORRO)", r.o, "Tática de Socorro", "Liderança de Guarnição"),
        montar("ESTADO-MAIOR (COMANDO E CONTROLE)", r.e, "Comando e Controle", "Gestão de Crise")
    ];
}