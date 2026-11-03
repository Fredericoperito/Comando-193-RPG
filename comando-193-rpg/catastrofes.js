// ==========================================================
// catastrofes.js — carregue ANTES de game.js (depois de roteiro.js).
// Cada catástrofe é um "chefe" de 9 etapas: 3 rodadas, e em cada rodada
// decidem Soldado (praca), Oficial (oficial) e Estado-Maior (superior).
// Formato de cada etapa:
//   [quadro, diálogo, CERTA, quase-certa A, quase-certa B, consequência da falha]
// As duas "quase certas" parecem razoáveis mas têm um erro de detalhe;
// elas exigem D10 (A com -1 e B com -3 sobre o atributo).
// ==========================================================
const CATALOGO_CATASTROFES = {
    // ---------- 101: ROMPIMENTO DE BARRAGEM DE REJEITOS ----------
    101: [
        ["praca", "Família presa no 2º andar de uma casa inclinada; a lama ao redor ainda se move devagar.",
            "Ancorar o cabo aéreo em ponto alto consolidado e extrair a família em tirolesa, sem tocar a lama",
            "Ancorar o cabo no poste de concreto mais próximo, ainda dentro da área de lama, para encurtar o vão",
            "Ancorar a tirolesa na própria estrutura inclinada da casa, que oferece o ponto mais próximo",
            "A ancoragem cedeu com a lama e o sistema precisou ser refeito com a família exposta."],
        ["oficial", "Duas guarnições chegam ao bolsão de ilhados; só existe um acesso consolidado.",
            "Setorizar, balizar um único corredor de acesso e controlar entrada e saída por registro",
            "Liberar dois corredores balizados para ganhar velocidade, controlando o acesso só na entrada",
            "Deixar cada guarnição escolher seu corredor, desde que informe pelo rádio",
            "Sem controle único de acesso, equipes ficaram fora do registro e fora da zona segura."],
        ["superior", "A defesa civil pede a lista de ilhados e o rádio da brigada está saturado.",
            "Montar o posto de comando em local seguro, abrir canal exclusivo do resgate e consolidar uma lista única",
            "Manter o canal geral e aceitar listas separadas de cada órgão para consolidar depois",
            "Passar a coordenação à defesa civil e acompanhar pelo canal geral",
            "A lista duplicou ilhados e deixou outros de fora."],
        ["praca", "Uma criança está presa até a cintura em lama que endureceu na superfície.",
            "Distribuir o peso com pranchas, soltar a vítima aos poucos com água em baixa pressão e vigiar a respiração",
            "Distribuir o peso com pranchas, mas puxar a vítima pelos braços para ganhar tempo",
            "Escavar ao redor com pás, em pé ao lado da cova, para soltá-la mais rápido",
            "A tração aumentou a compressão no tórax e a vítima passou a respirar com dificuldade."],
        ["oficial", "Um helicóptero pede onde pousar para evacuar os feridos.",
            "Indicar área plana, consolidada e balizada fora da lama, com um bombeiro responsável pelo pouso",
            "Indicar a área consolidada mais próxima dos feridos, com lama seca em volta, sem responsável designado",
            "Liberar o pátio mais próximo e deixar o piloto escolher a aproximação",
            "O vento do rotor levantou lama e destroços sobre as equipes e o pouso foi abortado."],
        ["superior", "A barragem secundária mostra trincas: há risco de nova onda.",
            "Acionar sirenes, evacuar pelas rotas de fuga, manter vigia de monitoramento e definir sinal de recuo para as equipes",
            "Evacuar a população, mas manter as equipes em campo até a confirmação oficial do risco",
            "Aguardar o laudo da mineradora antes de evacuar, mantendo tudo em operação",
            "Sem sinal de recuo, a retirada atrasou e pessoas ficaram expostas."],
        ["praca", "Um idoso grave, com fratura exposta e hemorragia, ainda está dentro da casa.",
            "Controlar a hemorragia com torniquete, imobilizar o membro e retirar em tirolesa com maca e monitoramento",
            "Imobilizar o membro e retirar pela tirolesa, tratando o sangramento só após a transferência",
            "Retirar o idoso no colo até o ponto seguro para poupar o tempo do sistema",
            "O sangramento piorou na travessia e a vítima chegou ao ponto seguro em choque."],
        ["oficial", "O ponto de reunião está saturado de feridos leves chegando juntos.",
            "Aplicar triagem START, concentrar recursos nos vermelhos e orientar os verdes a aguardar na área de apoio",
            "Aplicar a START, mas atender todos na ordem de chegada para evitar reclamações",
            "Priorizar os mais perto da ambulância e fazer a triagem depois da remoção",
            "Vítimas graves esperaram enquanto feridos leves eram atendidos."],
        ["superior", "A mineradora oferece máquinas pesadas para remover lama onde há desaparecidos.",
            "Usar máquinas só após a busca manual e com cães no setor, com operador guiado por um bombeiro",
            "Autorizar as máquinas nos setores de menor probabilidade de vítimas, sem acompanhar a busca",
            "Autorizar as máquinas em todos os setores, com os operadores da empresa",
            "As máquinas atingiram vítimas que ainda poderiam ser localizadas."]
    ],

    // ---------- 102: QUEDA DE AERONAVE COMERCIAL EM ÁREA URBANA ----------
    102: [
        ["praca", "Querosene em chamas cerca a asa direita enquanto passageiros descem pelas escorregadeiras.",
            "Abrir corredor de fuga com linha de espuma a barlavento, protegendo as escorregadeiras",
            "Abrir o corredor de fuga com neblina de água, mais leve para o deslocamento da linha",
            "Atacar a base do fogo com espuma pelo lado de sotavento, onde há menos fumaça",
            "O fogo voltou sobre o corredor e passageiros ficaram presos entre as chamas."],
        ["oficial", "Há dois pontos de acesso à aeronave e a fumaça aumenta.",
            "Posicionar viaturas a barlavento, em ângulo, mantendo rota livre para saída e para as ambulâncias",
            "Posicionar as viaturas a barlavento, mas de frente para a fuselagem para encurtar as mangueiras",
            "Posicionar as viaturas junto às escorregadeiras para alcance máximo da espuma",
            "Uma viatura ficou bloqueada pelo próprio posicionamento e perdeu o ataque."],
        ["superior", "Moradores do entorno ligam pedindo orientação sobre a fumaça.",
            "Orientar a população a se manter em local fechado e afastado da pluma, e acionar a defesa civil para o perímetro",
            "Orientar a evacuação imediata de todo o quarteirão, sem definir rotas",
            "Pedir que os moradores se aproximem para ajudar na retirada de feridos",
            "O trânsito de curiosos bloqueou as rotas das ambulâncias."],
        ["praca", "Passageiros estão presos nas poltronas, com a cabine cheia de fumaça de compósitos.",
            "Entrar com EPR, abrir a saída por fora e remover as vítimas por arraste, em linha, com a espuma cobrindo",
            "Entrar com EPR e remover cada vítima individualmente, sem cobertura de espuma, para ser mais rápido",
            "Entrar com a máscara panorâmica filtrante, pois a fumaça visível já está diminuindo",
            "Sem cobertura, o fogo na cabine voltou e a equipe precisou recuar sem as vítimas."],
        ["oficial", "O número de vítimas passa de trinta e a triagem não começou.",
            "Instalar área de triagem fora da pluma, classificar com START e organizar corredor de saída para os vermelhos",
            "Instalar a triagem próxima à aeronave para reduzir o percurso das macas",
            "Fazer a triagem na própria ambulância que chegar primeiro",
            "A triagem na pluma intoxicou socorristas e atrasou os atendimentos."],
        ["superior", "Hospitais ligam pedindo informações sobre o número de feridos.",
            "Repassar números por canal único, atualizar a regulação a cada triagem e distribuir vítimas por capacidade",
            "Repassar números estimados ao hospital mais próximo para que ele organize a distribuição",
            "Enviar todas as vítimas ao hospital mais próximo para ganhar tempo",
            "O hospital mais próximo saturou e vítimas graves esperaram transferência."],
        ["praca", "Há uma passageira presa por um assento deformado, consciente.",
            "Estabilizar, proteger com manta e usar desencarcerador hidráulico em ponto de força afastado do corpo",
            "Estabilizar e usar o desencarcerador hidráulico no ponto mais próximo, com a vítima protegida por manta",
            "Cortar o assento com serra rápida para liberar a vítima mais depressa",
            "A manobra apertou o membro da vítima e agravou a lesão."],
        ["oficial", "O combustível derramado corre para um bueiro e o fogo ameaça o poço de visita.",
            "Conter e represar o combustível com barreiras, aplicar manta de espuma e evitar a entrada na rede",
            "Aplicar espuma sobre o bueiro, sem barreira de contenção, para cobrir tudo",
            "Lavar o combustível com água para fora do pátio até a rua",
            "O combustível entrou na rede pluvial e o fogo se espalhou pelo poço."],
        ["superior", "A mídia pede entrevista e um parente deseja entrar na área isolada.",
            "Designar um único porta-voz fora da zona, manter o perímetro e encaminhar familiares a um ponto de acolhimento",
            "Permitir a entrada do parente com um bombeiro acompanhando, para evitar tumulto",
            "Dar as informações à imprensa do próprio posto de comando",
            "A presença de civis atrapalhou o trabalho e gerou boatos."]
    ],

    // ---------- 103: EXPLOSÃO EM REFINARIA (BLEVE) ----------
    103: [
        ["praca", "A esfera de GLP vizinha mostra o aço mudando de cor; a válvula de alívio apita.",
            "Instalar canhões monitores autônomos no domo e recuar o efetivo da zona letal",
            "Instalar canhões monitores autônomos, mas operados por uma guarnição a 100 m, para ajustar a água",
            "Resfriar a base da esfera, onde o jato alcança melhor, e manter a guarnição a distância segura",
            "A guarnição ficou exposta à radiação e precisou recuar sem completar o resfriamento."],
        ["oficial", "O vento muda de direção e leva a pluma para a equipe de apoio.",
            "Reposicionar viaturas e efetivo a barlavento, abrindo rota de fuga e atualizando o perímetro",
            "Reposicionar apenas as viaturas, mantendo o efetivo no ponto até a conclusão do resfriamento",
            "Manter a posição e usar cortina de água para proteger as viaturas",
            "O efetivo foi atingido pela pluma e perdeu eficiência."],
        ["superior", "A diretoria da refinaria quer manter as demais unidades operando.",
            "Exigir o desligamento seguro das unidades vizinhas e a depressurização das linhas antes de aproximar equipes",
            "Aceitar manter as unidades em operação mínima, desde que monitoradas",
            "Deixar a decisão com a diretoria, apoiando com o que for solicitado",
            "A unidade vizinha continuou sob pressão e ampliou o risco de novo incêndio."],
        ["praca", "Uma tubulação de GLP em chamas alimenta o fogo próximo ao casco da esfera.",
            "Não apagar a chama: fechar a válvula de bloqueio a distância e manter o resfriamento até o corte do suprimento",
            "Apagar a chama com pó químico e fechar a válvula depois",
            "Apagar a chama com água em neblina para reduzir o calor sobre a tubulação",
            "O gás acumulou, reacendeu em nuvem e obrigou a equipe a fugir."],
        ["oficial", "Um bombeiro relata exaustão e dois operadores sem EPR chegam para ajudar.",
            "Revezar as guarnições, reidratar o efetivo e manter os operadores fora da zona de calor",
            "Revezar as guarnições, mas aceitar os operadores no apoio de mangueiras afastados da esfera",
            "Manter os mesmos bombeiros para preservar a coordenação do ataque",
            "Bombeiros exaustos cometeram erros e um operador foi atingido pelo calor."],
        ["superior", "Uma escola a 900 m reporta cheiro de gás.",
            "Ordenar o abrigo no local fechado, depois a evacuação lateral ao vento, com apoio da defesa civil",
            "Ordenar evacuação imediata da escola pela via mais curta",
            "Pedir que a escola feche janelas e aguarde novas instruções",
            "A rota escolhida passava pela pluma e crianças se intoxicaram."],
        ["praca", "A válvula de alívio para de apitar de repente.",
            "Tratar como sinal de alerta máximo: recuar imediatamente e acionar o sinal de abandono",
            "Aproximar-se de forma cautelosa para verificar a válvula e confirmar o fim da pressão",
            "Manter a posição, pois o silêncio indica que a pressão caiu",
            "A pressão ainda crescia e houve rompimento parcial perto da guarnição."],
        ["oficial", "Há feridos graves na zona morna.",
            "Retirar com equipe de resgate protegida, descontaminar e transferir ao APH fora da pluma",
            "Retirar os feridos com a equipe de resgate, descontaminando só os casos graves",
            "Atender os feridos no próprio local para ganhar tempo",
            "Vítimas contaminadas levaram o produto à zona fria."],
        ["superior", "O fogo foi controlado e a imprensa pede a causa.",
            "Preservar o local para a perícia, manter monitoramento de gases e informar apenas fatos confirmados",
            "Informar a causa provável com base nos relatos das equipes",
            "Liberar a área para a refinaria iniciar a limpeza",
            "A perícia perdeu os vestígios e a causa informada foi contestada."]
    ],

    // ---------- 104: MEGA DESLIZAMENTO APÓS TROMBA D'ÁGUA ----------
    104: [
        ["praca", "Estalos nas árvores no topo do morro indicam movimento de novo bloco.",
            "Acionar o apito de evacuação (3 silvos longos) e retirar a equipe para a zona segura antes de retomar com vigias",
            "Terminar a retirada da vítima mais próxima e só então acionar a evacuação",
            "Recuar a equipe em silêncio, para não assustar as vítimas",
            "O novo bloco desceu com a equipe ainda no setor."],
        ["oficial", "Há quatro equipes sem rádio de comunicação direta no setor.",
            "Estabelecer vigia com sinal sonoro único, rota de fuga marcada e ponto de reunião para todos",
            "Estabelecer vigia, mas permitir que cada equipe use seu próprio sinal",
            "Manter as equipes nos setores e orientar a contagem a cada hora",
            "Duas equipes não perceberam o alarme e ficaram fora da evacuação."],
        ["superior", "A prefeitura quer reabrir a via principal para as ambulâncias.",
            "Reabrir só após a avaliação geotécnica da encosta e manter a via secundária no uso",
            "Reabrir a via principal com vigia posicionado no topo",
            "Reabrir a via principal imediatamente, para o fluxo de ambulâncias",
            "A via principal foi atingida por novo deslizamento com viaturas na pista."],
        ["praca", "Os cães marcam um ponto de soterrado sob entulho de casa e lama.",
            "Chamar o cão em segundo ponto para confirmar e escorar o local antes da escavação manual",
            "Iniciar a escavação manual logo, com cuidado, para ganhar tempo",
            "Usar a retroescavadeira da prefeitura para abrir o ponto de forma rápida",
            "A escavação desestabilizou o entulho e feriu a vítima."],
        ["oficial", "A vítima localizada está consciente, mas presa por uma viga.",
            "Estabilizar a viga com cunhas e escoras, manter contato verbal e liberar a vítima com macacos hidráulicos",
            "Cortar a viga com ferramenta rápida para liberar a vítima, mantendo o contato verbal",
            "Puxar a vítima com um cinto, sem mexer na viga, para agilizar",
            "A viga se moveu, comprimiu a vítima e atrasou o resgate."],
        ["superior", "Há famílias abrigadas em uma escola no pé do morro.",
            "Transferir as famílias para abrigo em área estável, com apoio da assistência social e da defesa civil",
            "Manter as famílias na escola, com vigia posicionado",
            "Permitir que as famílias retornem às casas para buscar documentos",
            "Famílias voltaram à área instável e foi preciso novo resgate."],
        ["praca", "A vítima está há horas soterrada, com sinais de síndrome de esmagamento.",
            "Avisar o APH, hidratar antes da liberação e preparar o monitoramento cardíaco",
            "Liberar a vítima e hidratar apenas na ambulância",
            "Liberar a vítima rapidamente e aquecê-la com mantas",
            "A vítima teve parada cardíaca logo após a liberação."],
        ["oficial", "Chega a noite e as equipes têm pouca iluminação.",
            "Instalar iluminação nos setores seguros, reduzir o efetivo ao essencial e revezar as equipes",
            "Instalar a iluminação em todos os setores e manter o efetivo completo",
            "Manter a busca com lanternas individuais até amanhecer",
            "A falta de iluminação coordenada causou quedas e atrasou a busca."],
        ["superior", "Surgem relatos de desaparecidos fora da lista oficial.",
            "Confirmar com a defesa civil, manter cadastro único e registrar a fonte de cada relato antes de empenhar equipes",
            "Empenhar equipes de imediato para cada relato, sem registro formal",
            "Usar apenas a lista oficial e ignorar os novos relatos",
            "As equipes foram a locais sem vítimas e deixaram setores prováveis desguarnecidos."]
    ],

    // ---------- 105: INCÊNDIO E NAUFRÁGIO DE NAVIO QUÍMICO ----------
    105: [
        ["praca", "Náufragos de colete estão a barlavento e a mancha de óleo em chamas deriva a sotavento.",
            "Resgatar pelo setor limpo, a barlavento, com AMA e BIA, mantendo distância da pluma tóxica",
            "Resgatar a barlavento, mas passar rente à borda da mancha para ganhar tempo",
            "Resgatar os náufragos do lado mais próximo das embarcações, mesmo a sotavento",
            "A deriva da mancha atingiu a embarcação e obrigou a abortar o resgate."],
        ["oficial", "A tripulação informa tambores de produto reativo a bordo.",
            "Pedir o manifesto de carga, identificar os produtos e manter as embarcações fora da zona de risco",
            "Aproximar uma embarcação para verificar os tambores com instrumento portátil",
            "Aproximar-se e resfriar os tambores com água, pelo lado mais seguro",
            "A reação com a água liberou gases tóxicos sobre as embarcações."],
        ["superior", "A capitania pede apoio para isolar a baía.",
            "Coordenar o isolamento com a capitania, definir corredor de navegação e restringir o tráfego na zona de risco",
            "Pedir à capitania que feche só a área do navio",
            "Manter a baía aberta para não prejudicar o porto",
            "Embarcações civis entraram na zona de risco e viraram novas vítimas."],
        ["praca", "Há três náufragos agarrados a um destroço, com sinais de hipotermia.",
            "Içar na horizontal, com cuidado, proteger do vento e manter sob monitoramento até a UR",
            "Içar o náufrago mais fraco primeiro, na vertical, para agilizar",
            "Içar o mais próximo, retirar a roupa molhada ali e dar-lhe bebida quente",
            "A içada vertical causou colapso hemodinâmico em um dos náufragos."],
        ["oficial", "O vento aumenta e o mar fica agitado.",
            "Reavaliar limites das embarcações e do efetivo, manter reserva de resgate e definir cota de recuo",
            "Continuar o resgate com as embarcações maiores, mantendo as pequenas em reserva",
            "Continuar com todas as embarcações para concluir o resgate antes do pior",
            "Uma embarcação pequena virou e foi preciso socorrer a própria guarnição."],
        ["superior", "O navio inclina e há risco de afundamento com produtos a bordo.",
            "Acionar o plano de emergência ambiental, isolar a área e mobilizar barreiras de contenção",
            "Aguardar o afundamento para então acionar as barreiras",
            "Concentrar todos os recursos nos náufragos e deixar a contenção para depois",
            "A mancha se espalhou antes das barreiras e atingiu a orla."],
        ["praca", "Um tripulante está dentro de um compartimento fechado, batendo na parede.",
            "Verificar a atmosfera com detector e usar EPR antes de abrir o compartimento",
            "Abrir o compartimento com EPR e medir a atmosfera depois",
            "Abrir o compartimento pelo lado de fora e puxar o tripulante sem EPR",
            "Gases do compartimento intoxicaram o socorrista."],
        ["oficial", "O hospital pede o tipo de produto para preparar o atendimento.",
            "Repassar produto, concentração e vias de exposição, e orientar o corredor de descontaminação",
            "Repassar o nome do produto e deixar o hospital decidir o procedimento",
            "Informar apenas que há intoxicação e manter o foco no resgate",
            "O hospital recebeu vítimas contaminadas sem descontaminação prévia."],
        ["superior", "A operação passa de 12 horas e a cobertura da cidade está reduzida.",
            "Revezar equipes, solicitar reforço de municípios vizinhos e recompor a cobertura mínima da cidade",
            "Manter as equipes e solicitar o reforço só ao final da operação",
            "Retirar equipes de outras áreas da cidade para completar o efetivo",
            "Uma ocorrência simultânea ficou sem viatura disponível."]
    ]
};

const ATRIBUTOS_BOSS = {
    praca: ["Destreza Técnica", "Coragem Operacional"],
    oficial: ["Tática de Socorro", "Liderança de Guarnição"],
    superior: ["Comando e Controle", "Gestão de Crise"]
};
const FUNCAO_BOSS = {
    praca: "SOLDADO (PONTA DA LINHA)",
    oficial: "OFICIAL (GERENCIAMENTO DO SOCORRO)",
    superior: "ESTADO-MAIOR (COMANDO E CONTROLE)"
};

// Constrói as 9 etapas da catástrofe: 3 rodadas, cada uma com Soldado, Oficial e Estado-Maior
function montarEtapasCatastrofe(id) {
    return CATALOGO_CATASTROFES[id].map(([quadro, dialogo, certa, quaseA, quaseB, falha], i) => ({
        quadro,
        funcao: `${FUNCAO_BOSS[quadro]} · RODADA ${Math.floor(i / 3) + 1}/3`,
        dialogo,
        escolhas: [
            { texto: certa, tipo: "correta", consequencia: "Decisão técnica correta: a rodada segue sob controle." },
            { texto: quaseA, tipo: "parcial", atributoTeste: ATRIBUTOS_BOSS[quadro][0], bonusParcial: -1, consequenciaFalha: falha },
            { texto: quaseB, tipo: "errada", atributoTeste: ATRIBUTOS_BOSS[quadro][1], bonusParcial: -3, consequenciaFalha: falha }
        ]
    }));
}

// Reserva: monta as etapas de Oficial e Estado-Maior pela CATEGORIA (usa ROTEIROS do roteiro.js)
function etapasPorCategoria(cat, titulo) {
    const r = (typeof ROTEIROS !== "undefined") ? ROTEIROS[cat] : null;
    if (!r) return [];
    const montar = (quadro, funcao, a, attrP, attrE) => ({
        quadro, funcao,
        dialogo: a[0].replace("{n}", titulo),
        escolhas: [
            { texto: a[1], tipo: "correta", consequencia: a[4] },
            { texto: a[2], tipo: "parcial", atributoTeste: attrP, bonusParcial: 0, consequenciaFalha: a[5] },
            { texto: a[3], tipo: "errada", atributoTeste: attrE, bonusParcial: -3, consequenciaFalha: a[6] }
        ]
    });
    return [
        montar("oficial", "OFICIAL (GERENCIAMENTO DO SOCORRO)", r.o, "Tática de Socorro", "Liderança de Guarnição"),
        montar("superior", "ESTADO-MAIOR (COMANDO E CONTROLE)", r.e, "Comando e Controle", "Gestão de Crise")
    ];
}