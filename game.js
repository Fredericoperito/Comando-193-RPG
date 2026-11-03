// ==========================================
// 1. ESTADO GLOBAL DO JOGO E TABELAS DE ESTILO
// ==========================================
const CARREIRAS = {
    praca: ["Soldado", "Cabo", "3º Sargento", "2º Sargento", "1º Sargento", "Subtenente"],
    oficial: ["Aspirante", "2º Tenente", "1º Tenente", "Capitão"],
    superior: ["Major", "Tenente-Coronel", "Coronel"]
};

const METAS_XP = {
    praca: [0, 700, 1400, 4600, 10500, 30000],
    oficial: [0, 1100, 15500, 40000],
    superior: [0, 17000, 45000]
};

const ESTILOS_PAISES = {
    "Brasil": { fardaQuartel: "#c5a880", fardaBorda: "#7a6345", trajeFogo: "#c59b52", detalheOmbro: "#5c4930", capaceteCor: "#d32f2f", faixaRefletiva: "#e6ee2a", InsigniaTexto: "BM" },
    "Estados Unidos": { fardaQuartel: "#1c2536", fardaBorda: "#0f1521", trajeFogo: "#1f1f1f", detalheOmbro: "#111111", capaceteCor: "#1a1a1a", faixaRefletiva: "#ffd600", InsigniaTexto: "343" },
    "Rússia": { fardaQuartel: "#263238", fardaBorda: "#161f24", trajeFogo: "#2c3033", detalheOmbro: "#1a1d1f", capaceteCor: "#f5f5f5", faixaRefletiva: "#cfd8dc", InsigniaTexto: "27" },
    "Portugal": { fardaQuartel: "#1a2845", fardaBorda: "#c62828", trajeFogo: "#162238", detalheOmbro: "#b71c1c", capaceteCor: "#c62828", faixaRefletiva: "#ffd600", InsigniaTexto: "PT" }
};

const TONS_PELE = { "Claro": "#f5cba7", "Moreno": "#d4996a", "Negro": "#6e3f23" };
const CATALOGO_100_MISSOES = [];

const estadoJogo = {
    dificuldade: "Novato",
    tempoBase: 30,
    corpoBombeiros: "Brasil",
    genero: "Masculino",
    corPele: "Moreno",
    xp: 0,
    xpIndividual: { praca: 0, oficial: 0, superior: 0 },
    ganhosNaMissao: { praca: 0, oficial: 0, superior: 0 },
    tokens: 0,
    coberturaCidade: 100,
    pontosDistribuir: 6,
    indicesPatente: { praca: 0, oficial: 0, superior: 0 },
    filaPromocoes: [],
    paginaCursos: 0,
    missaoSelecionadaMapaId: null,
    atributos: {
        "Força Física": { valor: 5, cargo: "Praça" },
        "Destreza Técnica": { valor: 5, cargo: "Praça" },
        "Coragem Operacional": { valor: 5, cargo: "Praça" },
        "Tática de Socorro": { valor: 5, cargo: "Oficial" },
        "Liderança de Guarnição": { valor: 5, cargo: "Oficial" },
        "Comando e Controle": { valor: 5, cargo: "Estado-Maior" },
        "Gestão de Crise": { valor: 5, cargo: "Estado-Maior" }
    },
    cursosComprados: {
        "Salvamento em Altura": false, "Salvamento no Mar": false, "Salvamento em Montanhas": false,
        "Operações com cães": false, "Combate a Incêndios Florestais": false, "Operações em Desastres": false,
        "Socorrista": false, "Mergulhador Autônomo": false, "Comando e Controle": false,
        "Produtos Perigosos": false, "Períto de Incêndio": false, "Abordador Técnico": false
    },
    missoesAtivasIds: [1, 2, 3, 4, 8, 12],
    missoesConcluidas: 0,
    bossesGerados: 0,
    ultimoTipoEscolha: null,
    ocorrenciaAtual: null,
    etapaAtual: 0,
    viaturasSelecionadas: [],
    bonusDadoAtivo: 0,
    tempoRestante: 30,
    intervaloTimer: null,
    timerPausado: false,
    avisoPendenteTexto: ""
};

const VIATURAS_DISPONIVEIS = [
    { id: "ABT", nome: "ABT (Auto Bomba Tanque)" },
    { id: "ABS", nome: "ABS (Busca e Salvamento)" },
    { id: "ASE", nome: "ASE (Ambulância / APH)" },
    { id: "AEM", nome: "AEM (Escada Mecânica)" },
    { id: "APP", nome: "APP (Produtos Perigosos)" },
    { id: "AR",  nome: "AR (Auto-Rápido / Oficial)" },
    { id: "AMA", nome: "AMA (Auto Moto Aquática)" },
    { id: "BIA", nome: "BIA (Barco Inflável Avançado)" }
];

// ==========================================
// 2. CATÁLOGO DE MISSÕES E CATÁSTROFES
// ==========================================
const DADOS_100_MISSOES = [
    [1, "animal", 1, "Jiboia na Rede Elétrica Residencial", "Serpente de grande porte enrolada próxima ao transformador de distribuição.", ["ABS"], "Salvamento em Altura",
        "A jiboia está a 40 cm da bucha primária de 13,8 kV do transformador; a chave fusível ainda está fechada.",
        "Isolar a projeção dos cabos, aguardar abertura e bloqueio da chave fusível pela concessionária e capturar com gancho/cambão isolado",
        "Usar a vara de manobra isolada da própria viatura para tentar puxar a serpente com a rede ainda ligada",
        "Posicionar a escada extensível de fibra apoiada no cabo mensageiro metálico do poste antes do desligamento"],
    [2, "predial", 3, "Incêndio no 4º Andar de Edifício", "Chamas intensas na sala com moradores retidos na varanda superior.", ["ABT", "AEM", "ASE"], "Salvamento em Altura",
        "No 4º andar, a porta está superaquecida, a fumaça amarelada pulsa pelas frestas e os vidros estão escurecidos e vibrando.",
        "Manter a porta fechada, aplicar pulsos curtos de neblina (painting) na camada superior de gases pelo acesso lateral controlado e manter posição abaixada",
        "Abrir a porta em 45 graus agachado e aplicar jato contínuo direto no teto por 30 segundos (rompendo o equilíbrio térmico)",
        "Quebrar a janela do corredor atrás da equipe e abrir totalmente a porta do apartamento para aliviar a fumaça"],
    [3, "hazmat", 4, "Carreta Tombada Vazando Gás H2S", "Caminhão-tanque acidentado liberando gás sulfídrico (ONU 1053) em baixada da rodovia.", ["APP", "ABT", "ASE"], "Produtos Perigosos",
        "Ao descer o barranco para checar a cabine, o cheiro forte de ovo podre some de repente, mas o detector acusa 120 ppm (acima do IPVS de 100 ppm).",
        "Confiar na leitura instrumental (reconhecendo a paralisia do nervo olfativo pelo H2S), operar com EPR em pressão positiva e retirar a vítima para cota alta a barlavento",
        "Substituir o EPR por máscara panorâmica com filtro químico multigás VO/GA para ganhar mobilidade no resgate",
        "Retirar a peça facial na baixada por julgar que a ausência de cheiro confirma a dissipação da nuvem"],
    [4, "crise", 5, "Tentativa de Suicídio no 12º Andar", "Jovem em crise emocional aguda sentado no parapeito externo da cobertura.", ["AR", "AEM", "ASE"], "Abordador Técnico",
        "Enquanto o abordador conduz o diálogo verbal na janela lateral, você está posicionado no terraço superior preparando a segurança.",
        "Montar ancoragem dupla equalizada e silenciosa (usando fitas têxteis sem bater mosquetões metálicos) e aguardar o comando do abordador",
        "Montar o sistema batendo os mosquetões de aço no guarda-corpo para testar a rigidez da estrutura",
        "Iniciar a descida de rapel por conta própria aproveitando que a vítima olhou para o lado"],
    [5, "pericia", 3, "Perícia em Galpão Logístico Destruído", "Investigação pós-sinistro com suspeita de fraude securitária.", ["AR"], "Períto de Incêndio",
        "Há três marcas de queima baixa em 'V' sem conexão por condução/radiação entre si e mancha de 'spalling' ao redor de um tambor.",
        "Documentar os múltiplos focos independentes, coletar substrato poroso na borda fria da mancha em recipiente hermético e colher amostra-controle",
        "Coletar amostra apenas do centro exato da cratera de concreto onde a calcinação foi mais intensa",
        "Atribuir o spalling (desplacamento do concreto) automaticamente ao uso de líquido inflamável sem análise laboratorial"],
    [6, "veicular", 2, "Colisão Frontal com Vítima Encarcerada", "Motorista preso pelo painel com vazamento de combustível no asfalto.", ["ABS", "ABT", "ASE"], "Socorrista",
        "O painel comprime o fêmur bilateral do motorista; o veículo possui chave presencial (keyless) no bolso do condutor.",
        "Calçar o veículo em 4 pontos, afastar a chave presencial a mais de 5m, desconectar o polo negativo da bateria com linha de proteção pronta e rebater o painel",
        "Cortar apenas o cabo positivo da bateria com o alicate hidráulico enquanto a chave presencial permanece na ignição",
        "Rebater o volante puxando a coluna de direção com corrente presa ao guincho da viatura"],
    [7, "florestal", 3, "Incêndio Florestal na Encosta da Serra", "Frente de fogo subindo rápido em direção a residências rurais.", ["ABT", "ABS"], "Combate a Incêndios Florestais",
        "O fogo sobe o aclive de 30° em capim seco; o vento de vale sopra a 30 km/h empurrando a cabeça do incêndio.",
        "Iniciar ataque progressivo pelos flancos a partir da área negra (já queimada), mantendo vigia e rota de fuga para zona segura",
        "Posicionar a linha de abafadores no meio da encosta não queimada, 20 metros acima da cabeça do fogo",
        "Realizar combate direto de frente para a cabeça do fogo na subida da garganta da serra"],
    [8, "aquatico", 2, "Banhista Arrastado por Corrente de Retorno", "Vítima exausta acenando a 120 metros da areia na arrebentação.", ["ABS", "ASE"], "Salvamento no Mar",
        "A vítima está no pescoço da corrente de retorno, agitada e tentando nadar de frente contra o fluxo de volta para a areia.",
        "Aproximar pelas costas entregando o flutuador (rescue tube) ao peito, acalmar a vítima e rebocar diagonalmente saindo pela lateral da corrente",
        "Entrar pelo canal e rebocar a vítima nadando em linha reta de volta pelo eixo central contra a corrente de retorno",
        "Fazer o contato físico direto de frente sem interpor o rescue tube entre o guarda-vidas e a vítima"],
    [9, "busca", 3, "Trilheiro Desaparecido na Mata Fechada", "Estudante perdido há 14 horas em trilha íngreme sob neblina densa.", ["ABS", "AR", "ASE"], "Salvamento em Montanhas",
        "Vocês encontram um agasalho da vítima próximo a uma bifurcação que desce para o leito de um rio encachoeirado.",
        "Preservar o agasalho sem tocá-lo com as mãos nuas (para referência de odor), marcar o ponto no GPS e realizar chamada com pausa de escuta de 1 minuto",
        "Recolher o agasalho passando de mão em mão na equipe e descer correndo pelo leito de pedras do rio",
        "Disparar sirene contínua e apitos sem pausas de silêncio enquanto caminham na neblina"],
    [10, "colapso", 4, "Desabamento Parcial de Sobrado Antigo", "Laje do segundo piso cedeu após explosão de GLP, soterrando moradora.", ["ABS", "ABT", "ASE"], "Operações em Desastres",
        "A moradora está em um vazio triangular sob uma viga fissurada; ela conversa, mas seu braço está prensado há 4 horas.",
        "Escorar a viga com pontaletes e cunhas antes de entrar no vão e solicitar acesso venoso com solução salina antes de aliviar a compressão do membro",
        "Aliviar imediatamente o peso sobre o braço com almofada pneumática antes da chegada do suporte médico avançado",
        "Cortar os vergalhões de aço tracionados da laje suspensa para ampliar a entrada do túnel"]
    [11, "busca", 3, "Busca com Cães em Deslizamento de Encosta", "Barranco cedeu sobre duas casas após temporal; binômio K9 acionado.", ["ABS", "AR", "ASE"], "Salvamento em Altura",
        "O cão de busca indica forte odor em um ponto da lama, mas curiosos e motosserras fazem barulho ao redor.",
        "Paralisar motores, afastar pessoas a sotavento e confirmar o ponto com o segundo cão antes de escavar",
        "Escavar com enxadas pesadas exatamente sobre o focinho do cão sem isolar a área",
        "Liberar dezenas de voluntários para pisotearem o cone de odor antes da varredura canina"],
    [12, "aquatico", 3, "Família Ilhada no Telhado por Enchente", "Rio transbordou rapidamente cercando residência com água barrenta e correnteza.", ["ABS", "ASE"], "Salvamento em Altura",
        "A água passa de 1,80m com galhos e fios submersos; três pessoas aguardam no beiral do telhado.",
        "Aproximar de bote inflável pela zona de remanso a montante, equipar coletes nas vítimas e embarcar uma a uma",
        "Cruzar a correnteza principal transversalmente com o motor no limite máximo",
        "Saltar na água barrenta amarrado apenas por uma corda na cintura"],
    [13, "florestal", 2, "Captação de Água em Açude para Incêndio Rural", "ABT precisa ser reabastecido em represa lamacenta durante combate a galpão.", ["ABT"], "Salvamento em Altura",
        "A margem do açude é de barro fofo e o fundo tem muita folha e lodo que podem entupir a bomba.",
        "Estacionar o ABT em terreno firme, montar o mangote com ralo e boia flutuante a 40 cm do fundo",
        "Jogar o mangote direto no lodo do fundo sem cesto de retenção para puxar água logo",
        "Avançar com as rodas traseiras do caminhão ABT para dentro da margem de lama"],
    [14, "altura", 3, "Operários Presos em Andaime Suspenso", "Cabo de aço esquerdo rompeu deixando plataforma pendurada no 9º andar.", ["ABS", "AEM", "ASE"], "Salvamento em Altura",
        "Dois pintores estão presos apenas pelo trava-quedas enquanto o andaime balança com o vento.",
        "Ancorar linhas independentes de vida e trabalho no topo do prédio e realizar pick-off técnico",
        "Pedir que os operários pulem para a janela do 8º andar segurando em uma corda simples",
        "Puxar o cabo de aço danificado do andaime usando o guincho da viatura lá embaixo"],
    [15, "altura", 4, "Resgate Aéreo com Helicóptero no Costão", "Pescador com fratura exposta em laje rochosa cercada por mar agitado.", ["AR", "ASE"], "Salvamento em Altura",
        "A aeronave paira sobre a pedra; o vento do rotor levanta espuma e a vítima está hipotérmica.",
        "Descer no guincho com triângulo de evacuação/puçá, estabilizar a vítima e usar cabo guia anti-rotação",
        "Içar a vítima segurando apenas pelos braços para sair rápido da zona de arrebentação",
        "Mandar o piloto encostar o esqui do helicóptero na rocha molhada e inclinada"],
    [16, "aquatico", 4, "Mergulho de Resgate em Carro Submerso", "Automóvel caiu de ponte em canal de 5 metros de profundidade com visibilidade zero.", ["ABS", "ASE"], "Salvamento em Altura",
        "Você está equipado para mergulho autônomo preso ao cabo guia e toca o teto do veículo no fundo escuro.",
        "Manter comunicação por puxadas no cabo guia, orientar-se pelo contorno do vidro e abrir/quebrar a janela lateral",
        "Soltar-se do cabo guia do tender para nadar mais livre ao redor do carro",
        "Tirar o regulador da boca no fundo escuro para tentar ouvir gritos no interior"],
    [17, "animal", 1, "Enxame de Abelhas Africanizadas em Escola", "Colmeia migratória instalada no pátio infantil com crianças retidas nas salas.", ["ABS", "ASE"], "Produtos Perigosos",
        "Dezenas de abelhas patrulham o corredor externo e o diretor quer tocar o sinal de saída agora.",
        "Manter todos trancados nas salas com janelas fechadas, vestir roupa de apicultor e recolher o enxame com fumigador",
        "Bater vassouras e jogar água fria sobre o enxame sem EPI apícola",
        "Tocar a sirene da escola e mandar todas as crianças correrem pelo pátio aberto"],
    [18, "predial", 2, "Incêndio em Cozinha Industrial de Restaurante", "Fritadeira industrial de 40 litros entrou em autoignição tomando a coifa.", ["ABT", "ASE"], "Perícia de Incêndio",
        "As chamas no óleo fervente lambem os dutos de gordura da coifa e o cozinheiro corre com um balde d'água.",
        "Impedir o uso de água, cortar o gás GLP/energia e abafar com agente saponificante Classe K ou manta",
        "Disparar jato compacto de água fria diretamente dentro da cuba de óleo fervente",
        "Ligar o exaustor elétrico no máximo para puxar as chamas para a chaminé"],
    [19, "hazmat", 4, "Vazamento de Amônia em Frigorífico", "Tubulação da sala de máquinas rompeu formando névoa branca pungente.", ["APP", "ABT", "ASE"], "Produtos Perigosos",
        "Um operador desmaiou perto da porta da câmara fria e a concentração de NH3 queima a pele exposta.",
        "Entrar em dupla com traje encapsulado Nível A e EPR, retirar a vítima e aplicar neblina d'água para abater o gás",
        "Entrar usando apenas máscara facial simples sem roupa de proteção química",
        "Acionar ventiladores jogando a nuvem concentrada de amônia para a avenida comercial"],
    [20, "altura", 2, "Gato Preso em Parapeito do 6º Andar", "Felino assustado na aba externa da janela sem tela há dois dias.", ["ABS"], "Salvamento em Altura",
        "O animal está arisco na borda estreita e ameaça saltar se alguém fizer movimento brusco na janela.",
        "Montar rede/puçá de contenção com segurança ancorada no ponto interno e aproximar com calma",
        "Inclinar metade do corpo para fora da janela do 6º andar sem cinto para agarrar o gato",
        "Assustar o gato com cabo de vassoura esperando que ele caia nos arbustos do térreo"],
    [21, "especial", 4, "Incêndio em Subestação Elétrica de Alta Tensão", "Transformador a óleo mineral explodiu gerando arco elétrico e fumaça tóxica.", ["ABT", "APP", "AR"], "Produtos Perigosos",
        "Há cabos de 138 kV ainda energizados estalando sobre o tanque de óleo em chamas.",
        "Aguardar confirmação formal de manobra de desligamento e aterramento, usando pó químico/CO2 ou neblina à distância segura",
        "Avançar com linha de espuma mecânica a 2 metros do barramento ainda energizado",
        "Lançar jato sólido de água diretamente sobre as buchas de alta tensão ligadas"],
    [22, "veicular", 3, "Ônibus Tombado em Ribanceira na Rodovia", "Coletivo com 28 passageiros tombou lateralmente no barranco sob chuva.", ["ABS", "ABT", "ASE", "AR"], "Salvamento em Altura",
        "Passageiros gritam no interior; alguns caminham feridos pela pista e outros estão presos nos bancos.",
        "Estabilizar a carroceria com escoras, abrir acesso pelo para-brisa/alçapão do teto e aplicar triagem START",
        "Entrar pela janela lateral superior sem calçar o ônibus que ameaça escorregar mais",
        "Colocar todos os feridos graves e leves misturados na primeira ambulância sem triagem"],
    [23, "animal", 2, "Cavalo Caído em Fossa Séptica Desativada", "Animal de 400 kg afundou até o peito em buraco estreito de quintal.", ["ABS", "AR"], "Salvamento em Altura",
        "O cavalo se debate exausto e as bordas de terra da fossa começam a desmoronar.",
        "Acalmar e proteger a cabeça do animal, passar cintas largas pelo tórax/garupa e içar com tripé/munck",
        "Laçar o pescoço do cavalo com corda fina e puxar com o guincho da viatura",
        "Pular para dentro da fossa estreita junto das patas do cavalo em pânico"],
    [24, "especial", 4, "Princípio de Incêndio em Heliponto de Hospital", "Vazamento de querosene de aviação (QAv) pegou fogo no trem de pouso durante partida.", ["ABT", "ASE", "AR"], "Produtos Perigosos",
        "O rotor ainda gira em desaceleração e o combustível líquido escorre em direção ao ralo do terraço.",
        "Aproximar a favor do vento fora do cone do rotor de cauda e cobrir o líquido e o trem de pouso com tapete de espuma LGE",
        "Correr por trás do rotor de cauda em movimento com um único extintor de água",
        "Jogar jato pleno de água espalhando o querosene aceso pelo terraço do hospital"],
    [25, "altura", 3, "Vítima com Mal Súbito em Grua de Construção", "Operador sofreu infarto na cabine a 45 metros de altura.", ["ABS", "AEM", "ASE"], "Salvamento em Altura",
        "A escada marinheiro da torre é estreita demais para descer com a vítima nos braços.",
        "Realizar APH na cabine, imobilizar em maca envelope (Sked) e descer por sistema de tirolesa/freio controlado",
        "Tentar descer a vítima desacordada nas costas pelos degraus verticais sem corda",
        "Ligar os comandos da grua sem habilitação tentando baixar a pessoa pelo gancho de carga"],
    [26, "hazmat", 3, "Cilindro de Cloro Vazando em Estação de Água", "Válvula de cilindro de 68 kg apresentou fissura liberando nuvem esverdeada irritante.", ["APP", "ABT", "ASE"], "Produtos Perigosos",
        "O gás cloro é mais pesado que o ar e está se acumulando nas galerias baixas da estação.",
        "Equipar EPI Nível A com EPR e aplicar o Kit 'A' de estanqueidade específico para cilindros de cloro",
        "Jogar água diretamente no furo da válvula de cloro (o que forma ácido corrosivo e aumenta o furo)",
        "Rolar o cilindro vazando para dentro do córrego ao lado da estação"],
    [27, "especial", 3, "Carro Elétrico em Chamas em Garagem Subterrânea", "Bateria de íons de lítio entrou em embalo térmico (thermal runaway) no subsolo 2.", ["ABT", "ABS", "AR"], "Produtos Perigosos",
        "Jatos rápidos não apagam a bateria sob o assoalho e os gases fluoretados tomam a garagem baixa.",
        "Usar EPR obrigatório, aplicar resfriamento contínuo de grande volume sob o chassi e ventilar os gases tóxicos",
        "Gastar apenas um extintor de pó químico e retirar a máscara para conferir de perto",
        "Rebocar o carro ainda em reação térmica para encostá-lo ao lado de carros a gasolina"],
    [28, "altura", 2, "Parapentista Preso em Copa de Eucalipto", "Piloto ficou pendurado a 22 metros de altura com linhas enroscadas em galhos secos.", ["ABS", "ASE"], "Salvamento em Altura",
        "O vento balança o velame aberto como uma vela, ameaçando quebrar o galho que sustenta o piloto.",
        "Ascender pela árvore sadia, ancorar o piloto em linha segura e só então recolher/cortar o velame",
        "Cortar primeiro as linhas do parapente antes de passar a corda de segurança no piloto",
        "Derrubar a árvore com motosserra esperando amortecer a queda com colchões"],
    [29, "predial", 4, "Incêndio em Hospital com UTI no 3º Andar", "Fumaça vinda da lavanderia invade os dutos do bloco cirúrgico e UTI.", ["ABT", "AEM", "ABS", "ASE", "AR"], "Salvamento em Altura",
        "Há pacientes entubados dependentes de ventilação mecânica e a fumaça chega ao corredor da UTI.",
        "Fechar portas corta-fogo, pressurizar a ala segura adjacente e realizar evacuação horizontal assistida",
        "Desligar todos os respiradores de uma vez e descer os pacientes no colo pela escada enfumaçada",
        "Usar os elevadores sociais comuns para descer as macas durante o incêndio"],
    [30, "colapso", 5, "Operário Soterrado em Vala de Saneamento", "Talude de terra de 3 metros de profundidade cedeu cobrindo trabalhador até o tórax.", ["ABS", "ASE", "AR"], "Salvamento em Altura",
        "A parede oposta da vala apresenta trincas no solo úmido e outros operários querem pular lá dentro.",
        "Afastar pessoas da borda, colocar pranchas de distribuição no solo, escorar as paredes com painéis e escavar à mão",
        "Pular direto para o fundo da vala sem escorar os taludes laterais",
        "Usar a concha da retroescavadeira para puxar a terra colada ao corpo da vítima"],
    [31, "crise", 5, "Homem em Surto na Passarela de Pedestres", "Cidadão desorientado do lado externo da grade sobre rodovia movimentada.", ["AR", "ABS", "ASE"], "Abordagem Técnica a Tentativa de Suicídio",
        "Motoristas buzinaram lá embaixo e curiosos gritam na passarela, aumentando a agitação da vítima.",
        "Interditar as faixas inferiores, posicionar colchão pneumático/caminhão baú, afastar curiosos e manter diálogo calmo",
        "Manter o tráfego de carretas passando normalmente sob a passarela durante a conversa",
        "Correr fazendo barulho na estrutura metálica para tentar puxá-lo pela camisa"],
    [32, "aquatico", 2, "Embarcação de Passeio à Deriva nas Pedras", "Lancha com pane seca no motor sendo empurrada pelas ondas contra o costão.", ["ABS", "ASE"], "Salvamento em Altura",
        "Quatro tripulantes sem colete estão no convés escorregadio a poucos metros das rochas.",
        "Lançar cabo de reboque à distância segura com moto aquática/lancha de salvamento e fornecer coletes antes da tração",
        "Encostar o casco da embarcação de resgate diretamente nas pedras sob ondulação forte",
        "Mandar os passageiros pularem na arrebentação sobre as pedras com cracas"],
    [33, "especial", 4, "Vazamento de GLP em Central de Condomínio", "Tubulação coletiva rompida por obra forma nuvem densa de gás no térreo.", ["ABT", "APP", "ASE"], "Produtos Perigosos",
        "O explosímetro acusa 60% do Limite Inferior de Inflamabilidade (LIE) perto da portaria.",
        "Proibir acionamento de interruptores/campainhas, entrar com proteção para fechar a válvula-mãe e dissipar com neblina",
        "Tocar todos os interfones elétricos dos apartamentos para avisar do vazamento",
        "Entrar no abrigo de gás usando lanterna comum não intrinsecamente segura"],
    [34, "veicular", 3, "Engavetamento Múltiplo sob Neblina na Serra", "Cinco veículos colidiram em curva sem visibilidade; risco de novas batidas.", ["ABS", "ABT", "ASE", "AR"], "Salvamento em Altura",
        "A cerração reduz a visão a 15 metros e ouvem-se carretas descendo a serra atrás da cena.",
        "Posicionar viatura pesada em escudo (fend-off) 100m antes da curva com sinalização luminosa e iniciar triagem",
        "Descer toda a guarnição direto para os carros batidos sem sinalizar a entrada da curva",
        "Pedir que motoristas feridos fiquem no meio da faixa abanando panos na neblina"],
    [35, "hazmat", 5, "Acidente com Fonte Radioativa Industrial", "Veículo de gamagrafia colidiu e o blindado de Irídio-192 caiu no asfalto.", ["APP", "AR", "ASE"], "Produtos Perigosos",
        "O dosímetro dispara alerta sonoro ao chegar a 30 metros da caixa metálica caída.",
        "Aplicar os 3 princípios (Tempo mínimo, Distância máxima e Blindagem), isolar em 50m e acionar a CNEN",
        "Pegar a cápsula metálica caída com as mãos enluvadas para guardá-la na viatura",
        "Jogar jato de água sobre a fonte selada achando que água neutraliza radiação gama"],
    [36, "animal", 1, "Cão Preso em Galeria Pluvial Estreita", "Animal caiu em bueiro e ficou entalado na manilha a 4 metros da caixa de inspeção.", ["ABS"], "Salvamento em Altura",
        "Chove na cabeceira da rua e o nível de água na manilha começa a subir lentamente.",
        "Montar grade de contenção a jusante, monitorar atmosfera e retirar o cão com laço guia acolchoado",
        "Entrar de cabeça na manilha de 50 cm sem corda nos pés nem medição de gás",
        "Abrir o hidrante na caixa superior para tentar empurrar o cão na pressão d'água"],
    [37, "predial", 3, "Incêndio em Subsolo de Shopping Center", "Depósito de calçados e plásticos em chamas gerando fumaça tóxica densa.", ["ABT", "ABS", "ASE", "AR"], "Perícia de Incêndio",
        "A visibilidade no corredor técnico do subsolo é zero e o calor irradia pelo teto rebaixado.",
        "Avançar em dupla ancorada por cabo guia, usando câmera térmica para localizar o foco e linha de 1½ polegada",
        "Entrar sozinho sem cabo guia confiando que conhece a planta do subsolo",
        "Subir o visor da máscara no subsolo escuro para tentar enxergar melhor"],
    [38, "aquatico", 2, "Surfista com Prancha Quebrada no Mar", "Leash arrebentou no outside e o surfista apresenta câimbras severas nas duas pernas.", ["ABS", "ASE"], "Salvamento em Altura",
        "A vítima não consegue bater perna e uma série maior se aproxima do pico.",
        "Embarcar a vítima no sled da moto aquática (ou pranchão de resgate) no intervalo das ondas e sair pelo canal",
        "Tentar rebocar a vítima nadando contra a arrebentação principal de frente para a série",
        "Jogar apenas uma corda solta sem boia para quem está com câimbra nos membros"],
    [39, "pericia", 3, "Perícia em Incêndio de Veículo de Luxo", "Automóvel queimou totalmente em estrada deserta horas após seguro ser renovado.", ["AR"], "Perícia de Incêndio",
        "O cofre do motor está íntegro, mas os bancos de couro apresentam queima intensa de baixo para cima e tampa de combustível aberta.",
        "Documentar a ausência de falha elétrica no motor, coletar cinzas do assoalho e apontar foco primário no habitáculo",
        "Assinar laudo rápido de pane elétrica no alternador sem abrir o capô",
        "Lavar o interior queimado com mangueira antes de fotografar os padrões de queima"],
    [40, "veicular", 3, "Motociclista Sob Eixo de Caminhão Urbano", "Vítima consciente com capacete fechado presa sob o rodado dianteiro.", ["ABS", "ASE", "ABT"], "Salvamento em Altura",
        "O pneu não passou sobre o tórax, mas o para-choque baixo impede a retirada direta da vítima.",
        "Calçar os dois lados das rodas, erguer o eixo com almofadas pneumáticas + calços escalonados (cribbing) e extrair em prancha",
        "Pedir ao motorista do caminhão que dê ré devagar para liberar o motociclista",
        "Puxar o motociclista pelos ombros sem erguer a estrutura nem estabilizar a cervical"],
    [41, "predial", 2, "Fogo em Chaminé e Forno a Lenha de Pizzaria", "Fuligem acumulada no duto vertical pegou fogo soltando fagulhas no telhado vizinho.", ["ABT", "ABS"], "Perícia de Incêndio",
        "O duto metálico está rubro ao atravessar o forro de madeira do segundo pavimento.",
        "Extinguir a brasa na fornalha, resfriar o madeiramento adjacente ao duto com câmera térmica e usar pó químico/neblina fina",
        "Jogar jato sólido de água gelada dentro do duto de tijolos incandescente (causando explosão de vapor e rachadura)",
        "Ir embora apenas apagando a lenha de baixo sem inspecionar o forro de madeira"],
    [42, "altura", 3, "Trabalhador Suspenso pelo Cinto Após Queda", "Montador de fachada escorregou e ficou pendurado inerte no trava-quedas.", ["ABS", "AEM", "ASE"], "Salvamento em Altura",
        "Ele já está suspenso há 12 minutos e corre risco grave de trauma de suspensão inerte (síndrome do arnês).",
        "Realizar resgate rápido em menos de 10 minutos, aliviar a pressão das fitas femorais e manter o tronco semi-sentado no APHinicial",
        "Deitar a vítima totalmente reta no chão assim que tocar o solo após longa suspensão",
        "Aguardar 40 minutos até montar um guindaste externo sem aliviar as fitas das pernas"],
    [43, "hazmat", 3, "Derramamento de Mercúrio em Laboratório Universitário", "Frasco de 500g de mercúrio metálico quebrou no piso aquecido do laboratório.", ["APP", "AR"], "Produtos Perigosos",
        "As microgotas prateadas se espalharam sob as bancadas e os vapores tóxicos sobem com o calor.",
        "Desligar aquecedores, usar proteção respiratória para vapores de Hg e recolher com aspirador específico/enxofre reagente",
        "Varrer as bolinhas de mercúrio com vassoura comum (dividindo-as em milhares de gotículas e aumentando a evaporação)",
        "Usar aspirador doméstico comum que aquece e pulveriza o vapor de mercúrio no ar"],
    [44, "hazmat", 2, "Reação Química de Hipoclorito em Casa de Bombas", "Funcionário misturou cloro granulado com ácido muriático em piscina de clube.", ["APP", "ASE", "ABT"], "Produtos Perigosos",
        "Uma nuvem amarelada de gás cloro sai pelo respiro da casa de bombas subterrânea ao lado da piscina.",
        "Evacuar a área da piscina a barlavento, descer com EPR para retirar o recipiente e ventilar com exaustor",
        "Descer a escada da casa de bombas sem máscara para jogar mais água na bombona",
        "Fechar o respiro trancando o funcionário lá dentro com o gás"],
    [45, "altura", 3, "Turista Preso em Tirolesa Travada sobre Vale", "Roldana engripou no meio do cabo de aço a 60 metros do chão.", ["ABS", "AR"], "Salvamento em Altura",
        "O turista está cansado segurando na fita e o sol forte acelera a desidratação.",
        "Progredir pelo cabo principal com roldana tandem e linha de segurança, conectar a vítima e tracionar até a plataforma",
        "Sacudir o cabo de aço nas extremidades para tentar destravar a roldana no tranco",
        "Descer a vítima até o fundo de mata fechada sem saber o comprimento da corda"],
    [46, "especial", 5, "Incêndio em Silo de Grãos com Risco de Explosão", "Aquecimento interno da soja gerou combustão lenta e nuvem de poeira combustível.", ["ABT", "ABS", "APP", "AR"], "Produtos Perigosos",
        "Abrir a comporta inferior ou levantar poeira com jato forte pode causar uma explosão de pó (dust explosion).",
        "Inertizar o topo, evitar suspensão de poeira, monitorar temperatura/CO e retirar os grãos de forma controlada e úmida",
        "Abrir todas as escotilhas e jogar jato pleno levantando nuvem densa de pó de cereal",
        "Entrar caminhando sobre a massa de grãos do silo (risco fatal de engolfamento)"],
    [47, "crise", 4, "Paciente em Surto no Telhado de Clínica", "Interno subiu no telhado de telhas de fibrocimento antigas ameaçando pular.", ["AR", "ABS", "AEM", "ASE"], "Abordagem Técnica a Tentativa de Suicídio",
        "Além do risco de salto, as telhas de amianto quebram facilmente se pisadas fora das terças.",
        "Posicionar a escada mecânica/pranchões sobre as vigas para distribuir o peso e manter negociação calma",
        "Subir correndo em três bombeiros pisando no meio das telhas secas",
        "Jogar jato de água para forçar o paciente a descer pelo telhado molhado"],
    [48, "aquatico", 3, "Kitesurfista Arrastado pelo Vento para Alto-Mar", "Linhas da pipa enroscaram na barra de controle sob vento terral forte.", ["ABS", "AR", "ASE"], "Salvamento em Altura",
        "A pipa continua dando trancos na água puxando o atleta cansado cada vez mais para fora.",
        "Aproximar pelo lado de barlavento das linhas, acionar o sistema de ejeção/corta-linhas da pipa e embarcar o atleta",
        "Passar com a hélice da embarcação por cima das linhas finas de dyneema do kite",
        "Tentar puxar o atleta contra o vento mantendo a pipa inflada puxando para o outro lado"],
    [49, "pericia", 4, "Perícia em Explosão de Apartamento Residencial", "Janelas foram projetadas a 30 metros na rua; dúvida entre GLP ou artefato.", ["AR", "ABS"], "Perícia de Incêndio",
        "As paredes sofreram deslocamento uniforme por pressão difusa e a mangueira do fogão está cortada sem abraçadeira.",
        "Mapear o epicentro da onda de sobrepressão difusa (típica de gás acumulado) e recolher o registro e mangueira para perícia",
        "Declarar atentado a bomba sem analisar a linha de gás da cozinha",
        "Permitir que o síndico jogue fora o fogão e os destroços da janela antes do exame"],
    [50, "hazmat", 3, "Descarte Clandestino de Tambores Químicos em Terreno", "Oito tambores sem rótulo vazando líquido fumegante ácido perto de escola.", ["APP", "ABT", "AR"], "Produtos Perigosos",
        "O líquido reage com a umidade do solo liberando vapores corrosivos sem número ONU visível.",
        "Aproximar com EPI Nível A, identificar pH e inflamabilidade com fita/multigás e conter com dique de vermiculita/areia seca",
        "Cheirar a boca do tambor aberto para tentar adivinhar qual é o solvente",
        "Empurrar os tambores com o para-choque da viatura para dentro do valão"]
    [51, "colapso", 5, "Colapso em Laje de Garagem", "Laje puncionou um pilar inferior.", ["ABS", "ABT", "ASE", "AR"], "Operações em Desastres", "Sobrecarga de mudança; vítima no subsolo batendo no cano.", "Escorar o pilar falho verticalmente, furar o vazio sem atingir cabos de protensão", "Cortar os cabos protendidos com alicate (chicote elástico violento)", "Apoiar peso do ABT sobre a mesma laje pendurada"],
    [52, "colapso", 4, "Queda de Marquise", "Placa de 6 ton sobre banca de jornal.", ["ABS", "ABT", "ASE", "AR"], "Operações em Desastres", "Duas vítimas vivas debaixo do esmagamento parcial.", "Elevação milimétrica com sistema de calços em fogueira (levantar e calçar em paralelo)", "Inflar duas almofadas de ar sobrepostas sem calço algum", "Posicionar almofada pneumática direto na ferragem pontuda"],
    [53, "colapso", 4, "Colapso de Teto Metálico de Mercado", "Treliças e prateleiras em efeito dominó.", ["ABS", "ABT", "ASE", "AR"], "Operações em Desastres", "Gôndolas frigoríficas seguram partes do teto torto.", "Cortar utilidades, travar efeito dominó e resgatar pelos vãos das gôndolas escoradas", "Caminhar pelas telhas dobradas soltas em cima da área colapsada", "Cortar os montantes de aço da prateleira retorcida"],
    [54, "colapso", 5, "Desabamento em Construção", "Panqueca de andares com concreto úmido (2,4 ton/m³).", ["ABS", "ABT", "AEM", "ASE", "AR"], "Operações em Desastres", "Concreto alcalino afundou os operários.", "Lavar cimento úmido das vias aéreas/olhos imediatamente e retirar pedras soltas", "Encharcar todo o vão para o cimento fluir melhor", "Aguardar o concreto endurecer e usar martelete rompedor na vítima"],
    [55, "colapso", 4, "Explosão de Caldeira de Hospital", "Vapor superaquecido invisível e alvenaria caindo.", ["ABS", "ABT", "ASE", "AR"], "Operações em Desastres", "Equipe médica em pânico próximo ao vaso de pressão.", "Bloquear válvulas, isolar zona de vapor e escorar paredes divisórias rachadas", "Engatinhar pela névoa quente sem EPR confiando na camisa normal", "Esfriar as outras caldeiras subitamente com jatos frios diretos"],
    [56, "colapso", 3, "Passarela de Aço Esmagando Van", "Caminhão derrubou viga em van escolar.", ["ABS", "ABT", "ASE", "AR"], "Operações em Desastres", "Viga apoiada torta; extremidade solta no viaduto.", "Ancorar caminhão e viga, chamar guindaste e cortar veículo sob a proteção", "Acelerar caminhão para puxar o viaduto e liberar a van", "Cortar a viga principal ao meio deixando os restos caírem nas vítimas"],
    [57, "aquatico", 4, "Enchente Relâmpago (Cabeça D'Água)", "6 turistas cercados por enxurrada na pedra.", ["ABS", "AR", "ASE"], "Salvamento no Mar", "Volume cresceu e arrasta troncos.", "Tirolesa tensionada nas margens ou lançar saco de resgate (pêndulo ao remanso)", "Nadar com corda estática na cintura (vítima do arrasto de corda)", "Mandar os turistas de mãos dadas cruzarem o corredeira a pé"],
    [58, "aquatico", 3, "Carro Arrastado em Canal", "Água na metade do veículo preso no pilar.", ["ABS", "ABT", "ASE"], "Salvamento no Mar", "Família ilhada dentro; água subindo.", "Fixar cabo de estabilização da ponte e quebrar vidro a jusante (traseira) para evacuar", "Apoiar a escada de gancho direto no teto submerso instável", "Quebrar o vidro dianteiro deixando a enxurrada inundar a cabine"],
    [59, "aquatico", 4, "Evacuação de Asilo Inundado", "18 idosos acamados com água a 1,2m.", ["ABS", "ASE", "ABT", "AR"], "Operações em Desastres", "Pacientes com O2 e camas elétricas sem luz.", "Evacuação vertical para o 2º andar imediata e uso de botes para O2 dependentes", "Carregar idosos nos ombros submersos atravessando o pátio com buracos", "Ligar gerador a gasolina dentro do corredor escuro alagado"],
    [60, "aquatico", 3, "Alagamento de Garagem", "Água a 40cm do teto e subindo rápido no -2.", ["ABS", "ABT", "ASE"], "Mergulhador Autônomo", "Dois vigias ilhados, água turbulenta impedindo saída a pé.", "Bloquear concessionária e penetrar com mergulho linha guia e octopus de resgate", "Descer nadando livremente na rampa em turbulência violenta", "Bombear a água sem trancar vazamento, com motor a combustão no subsolo"],
    [61, "aquatico", 3, "Perna Presa em Grade de Bueiro", "Enxurrada empurrando vítima para baixo da grade.", ["ABS", "ABT", "ASE"], "Salvamento no Mar", "Água sufoca a face do garoto.", "Desviar o fluxo a montante (escudo/barreira veicular), afastar as barras com expansor", "Puxar pelos braços com três militares disputando força com a água", "Mergulhar para soltar a perna da vítima dentro da sucção"],
    [62, "aquatico", 4, "Bote Virado em Corredeira", "2 bombeiros no rio se aproximam da ponte (peneira).", ["ABS", "ASE", "AR"], "Salvamento no Mar", "Galhos bloqueiam passagem na ponte a jusante.", "Posição de natação ofensiva/defensiva 45° rumo ao remanso (sem tentar pé no chão)", "Tentar ficar em pé no fundo forte, arriscando foot entrapment fatal", "Nadar de peito reto em direção aos galhos soltos da ponte"],
    [63, "colapso", 5, "Barreira Prensou Casa de Encota", "Soterrados até o teto em barro de 15m.", ["ABS", "ABT", "ASE", "AR"], "Operações em Desastres", "Lama compacta tomou os fundos da casa.", "Vigia da encosta com rota balizada e escavação cuidadosa pelo teto livre sem jogar água", "Posicionar-se no corredor entre o barranco frágil e a parede destruída", "Lavar o barro na parede com jato forte de 60 lbs (liquefazendo tudo)"],
    [64, "colapso", 4, "Engolfamento em Silo de Areia", "Dois peões atolados na areia funil (silo).", ["ABS", "ASE", "AR"], "Operações em Desastres", "Movimento gera deslizamento de areia adicional.", "Instalar pranchas, cravar tubos de contenção no quadrante deles e extrair a areia de dentro", "Puxar a vítima pelas cordas sem retirar o peso mecânico da areia", "Escavar a base inferior do funil de areia usando as mãos desprotegidas"],
    [65, "aquatico", 2, "Canoa Havaiana Virou na Barra", "Seis pessoas sem barco, maré de vazante.", ["ABS", "ASE"], "Mergulhador Autônomo", "Dois sem colete indo para as pedras.", "Resgatar imediatamente os 2 não flutuantes; manter resto no casco", "Agarrar os de colete e deixar os sem colete tentando nadar", "Exigir que todos abandonem o barco para nadar contra a vazante"],
    [66, "altura", 3, "Pintor Desmaiado na Cadeira", "Mal súbito na fachada a 8 andares.", ["ABS", "AEM", "ASE"], "Salvamento em Altura", "Vítima presa ao balancim lateral e ao cinto.", "Acesso rápido com linha própria, pick-off frontal e descida mantendo tórax", "Cortar as cordas do cadeirão e confiar no trava-quedas emperrado", "Tracionar o homem desmaiado de mau jeito pelas cordas finas"],
    [67, "animal", 1, "Gambá Preso no Motor do Carro", "Enroscado na correia após rodar quente.", ["ABS"], "Salvamento em Altura", "Proprietário quer ligar motor para matar.", "Deter chave do dono e resgatar o marsupial calmamente com raspa de couro grossa", "Bater no cárter do carro com marreta espantando o bicho", "Ligar o carro quente e lavar com água fria direto no colete"],
    [68, "predial", 4, "Fogo em Acervo de Biblioteca", "Estantes abarrotadas e corredores de fumaça.", ["ABT", "ABS", "ASE", "AR"], "Períto de Incêndio", "Acervo raro destruído no calor extremo.", "Ir linha a linha com varredura direita/esqueda pelo cabo guia e termovisor", "Jogar toneladas de água pelo corredor do hall sem direcionamento ao foco", "Perder-se sem a guia e acabar o ar respirável na prateleira J"],
    [69, "hazmat", 5, "Nuvem de Cloro em Navio", "Container furado, porões cheios de névoa.", ["APP", "ABT", "ASE", "AR"], "Produtos Perigosos", "Cloro corroendo navio mercante.", "Entrar Nível A/EPR, estancar cilindro base e usar ventilação positiva nos porões", "Lavar fissura de gás cloro de navio direto no mar", "Atravessar névoa ácida do porão em traje limpo sem isolante"],
    [70, "crise", 5, "Ameaça em Torre Caixa D'água", "Crise emocional em pátio escolar lotado.", ["AR", "ABS", "AEM", "ASE"], "Abordador Técnico", "Adolescente cercado por celulares filmando.", "Conter área visual total da escola, enviar só o abordador principal na AEM e resgate oculto", "Descer com equipe ruidosa no pátio pelas escadas para pegar a vítima", "Dar voz grave e grosseira no megafone pra descer da caixa"],
    [71, "pericia", 3, "Fogo em Seção do Mercado", "Incêndio noturno em loja sem alarmes ligados.", ["AR"], "Períto de Incêndio", "Vestígios lineares escuros no chão polido.", "Sinalizar o trailer (fio condutor de acelerante) e pegar fitas das câmeras antes de limpar", "Ignorar padrão das prateleiras derretidas e dar como combustão espontânea comum", "Deixar trator raspar os azulejos calcinados antes do perito fotografar"],
    [72, "veicular", 3, "Betoneira Girando Sobre Carro", "Pesado rolando contra automóvel de passeio.", ["ABS", "ABT", "ASE", "AR"], "Socorrista", "Tambor gigante de 18t triturando o teto.", "Travar o giro, acionar guindaste/amarras pra evitar esmagamento completo; resgatar após travar peso", "Cortar e rebater o teto enquanto betoneira roda no eixo da frente", "Entrar e arrastar o paciente enquanto as 18t do caminhão balançam"],
    [73, "florestal", 4, "Fogo Perto de Condomínio", "Restinga queimando empurrada aos prédios.", ["ABT", "ABS", "AR"], "Combate a Incêndios Florestais", "Fagulhas atravessam o muro dos primeiros lotes.", "Postar combate na interface rural/urbana defendendo condomínio com água, isolar frentes.", "Avançar cego pela restinga sem garantir retaguarda dos prédios residenciais", "Parar caminhão a favor do vento onde a fagulha destrói a pintura de resina"],
    [74, "aquatico", 3, "Mergulhador em Rede Fantasma", "Pescador apnéia enroscado na malha do mar.", ["ABS", "ASE"], "Mergulhador Autônomo", "Prendeu a nadadeira e está quase afogado a 9m.", "Descer dupla de resgate com fonte suplementar, transferir ar e cortar as redes do calcanhar.", "Puxar a rede fantasma bruta no guincho da lancha pra trazer o corpo junto", "Arrançar o cabo de arpão torcido cortando logo o regulador dele e o tubo de pressão"],
    [75, "busca", 4, "Busca de Criança na Chuva", "Mata densa ao cair da noite.", ["ABS", "AR", "ASE"], "Operações com cães", "Odor fragilizado pela chuva, roupas intactas sem uso em casa.", "Passar ao cão de faro pelo saco isolado sem contaminação das mães e seguir quadrantes sistemáticos.", "Rodar com motoqueiros cruzando cheiro humano no perímetro todo da floresta", "Desprezar roupas usadas e lançar guarnição de braço atirando lanternas a esmo"],
    [76, "colapso", 5, "Caminhão Contra Passarela", "Caminhão caçamba bate em passarela sobre via com trânsito de carroça.", ["ABS", "ABT", "AEM", "ASE", "AR"], "Operações em Desastres", "Parte do tabuleiro pendurado.", "Isolar as duas pistas, estancar o pilar base com apoio do guincho pesado, cortar veículos fora da poeira caindo.", "Meter maçarico nas hastes suspensas soltando lascas vivas no chao.", "Subir tropas pelas rampas avariadas de concreto antes do guindaste chegar"],
    [77, "altura", 3, "Escalador Cair em Costão Liso", "Deitou tornozelo faturado; Laje vertical íngrime", ["ABS", "AR", "ASE"], "Salvamento em Montanhas", "De 6 metros e muito vento lateral.", "Descer 2 operadores fixar o grampo maciço; colocar fratura em placa moldável e rebocar suave", "Trazer ferido nas costas sem alinhar tornozelo doendo pendurado pelo mosquetão.", "Puxar cordinha solta arranhando paciente até ferir os joelhos subindo."],
    [78, "especial", 4, "Combustão Em Casa de Máquina Náutica", "Navio atracado. Diesel pegando porao com maquinista desaparecido.", ["ABT", "ABS", "APP", "ASE"], "Produtos Perigosos", "Espaço com metal incandescente. Fumaça de chaminé.", "Combater incêndio exterior resfriando casco e inserir espuma química pesada depois de busca rápida.", "Atirar 40 mil litros de água direto afogando navio na quilha ao porto", "Tocar a mangueira isolando porta sem fechar o tubo de alimentação de combustível."],
    [79, "animal", 2, "Boi Fundo No Lamaçal D'Água", "Mangue sugando o rebanho ao final da maré.", ["ABS", "AR"], "Operações em Desastres", "Vácuo nas patas o enterra mais e mais.", "Diluir barro com lança de ar/água sob casco desfazendo tensão profunda do vácuo antes da tração e erguer prancha.", "Ligar cabo de aço da VTR no pescoço do boi e esticar tração forçando coluna dele.", "Mergulhar bombeiros sem proteção de superfície afundando junto ao peso morto do barro negro"],
    [80, "predial", 3, "Acumulador Compulsivo Fogo Quarto", "Ap 2o Andar trancado cheio de revistas incendiadas.", ["ABT", "ABS", "ASE", "AR"], "Comando e Controle", "Blocos obstruem janela.", "Progredir rotacionando pessoal enquanto jatos de ar e pouca água são ministrados e peso estático medido no piso inferior.", "Alagar completamente os 2 metros de papel até romper o teto do vizinho da laje inferior", "Caminhar sob 4m de lixo escorregando e caindo sem corda de suporte."],
    [81, "hazmat", 4, "Ácido Sulfúrico Capotamento BR", "Produto denso queima via asfalto.", ["APP", "ABT", "ASE"], "Produtos Perigosos", "Borbulha contato poça.", "Construir represa mineral seco, não adicionar água para não ferver; neutralizar no poço estanque e remover PPE ácido", "Limpar tudo rapidamente esfregando água pesada borbulhante corroendo viatura", "Usar pó de serra seco (madeira) que pega fogo em ácido nítrico/sulfúrico no ato das misturas"],
    [82, "crise", 5, "Tentativa Homicídio Passarela Tiro", "Ex militar surtado; Sacada apart.", ["AR", "ABS", "ASE"], "Abordador Técnico", "Ele bate farda na janela. Exige recuo das motos PMs", "Afastar as luzes giroflez, deixar único líder empático civil à frente contendo perimetros calados; acobertar a viatura de intervenção nos pontos mortos", "Avançar grupo barulhento das tropas da Força Tatica do BM e PM correndo de escudos armados em frente da rua principal", "Buzinar insistindo pela rede tática de alto falantes do quartel ao idoso."],
    [83, "pericia", 4, "Quadro Força Furtado Explode Prédio", "Sem luz e condomínio quer relocar barramentos rápido.", ["AR"], "Períto de Incêndio", "Cabos grossos com pérolas soldadas ao fundo do quadro negro.", "Fotografar ligações disjuntoras antigas preservadas pra fraude elétrica processual, proibir zelador de faxina no quarto escuro.", "Autorizar equipe light tirar sucata para limpar o terreno da fumaça escura pra vizinhos dormirem rápido", "Registrar acidentes genéricos em fios expostos sem relatar bypass nos cobre."],
    [84, "veicular", 2, "Sedan Submerso Invertido no Valão", "Água suja quase afogando face de cabeça ao teto do canal.", ["ABS", "ABT", "ASE"], "Socorrista", "Cinto bloqueado pelo peso.", "Fixar chassi do carro de virar com cabo, resguardar oxigênio com mangueira ou snorkel e travar cabeca pra descer da maca em reboque inclinado.", "Cortar cinto imediatamente e deixar cabeca bater direto no volante da direção por gravidade de tombamento", "Enlaçar eixo por cima com VTR puxando rolar de uma vez na ponte matando passageiro com o giro"],
    [85, "florestal", 3, "Escola Cercada Por Fogo Em Canavial", "Palha seca alta ventando faíscas ao pátio da roça.", ["ABT", "ABS"], "Combate a Incêndios Florestais", "Via principal preenchida de fumaça cinza sem fim.", "Evacuação protegida no ônibus balizado e linhas defesa água umedecendo entorno até isolar aceiro", "Transportar crianças cruzando pátio das queimadas correndo com toalhas à deriva", "Defender palmeira de cana enquanto escolas acendem o toldo traseiro ao pó"],
    [86, "aquatico", 3, "Arraia Ferroa Náufrago Coroa De Areia", "Banhista pego no baixio a 3km.", ["ABS", "ASE"], "Socorrista", "Toxina gerando espasmos da canela;", "Socorrer embarcado APH de calor d'água morna local tolerável ameniza toxina neuro e desinfectar ferrão pontiagudo preservado.", "Botar bolsa de gelo industrial trincado anestesiando necrose tissular venenosa", "Colocar corda de arrasto no Jet Ski trazendo a perna espumando sobre maresia pesada 3km rasgando peito d agua"],
    [87, "busca", 4, "Menino Na Piscina Esgotada Vazia", "Desaparecido Cond Clube Extenso", ["ABS", "AR", "ASE"], "Operações com cães", "Obras sem grades, e pais em desesperos na guarita.", "Varredura pontual alta prioridade de afogamento piscinas bombas antes do bosque dos cães iniciarem nas periferias e estradas adjacentes.", "Deixar cachorro investigar portarias aleatórias nas recepções sociais 4hs de retardo.", "Não fechar carros nem a portaria da rua dos trabalhadores civis no momento tenso de crime do escoamento"],
    [88, "colapso", 4, "Soterramento Pedra Pedreira De Muro", "Pedras enormes prendem oficina fundo.", ["ABS", "ABT", "ASE", "AR"], "Operações em Desastres", "3 hs esmagamento sindrome pernas mecânico.", "Suporte Life médico para hidratação preventiva aos íons renais tóxicos em suspensão de sangue antes de rolar pedra das almofadas macaco 3 vias", "Erguer bruta sem medico injetar drogas alcalinas causando parada cardiaca instantes apos oxigenio na panturrilha morta.", "Marretar picos para fragmentar placa base no colo dele afundando ainda mais na compressao"],
    [89, "altura", 4, "Antenista Chocado Torre Alta Voltagem", "Fio rompeu torre telecom de 50m. Rajada tempo virando.", ["ABS", "AR", "ASE"], "Salvamento em Altura", "Vento cruzado perigoso; Tonto no deck.", "Progredir via tubos gaiola protegidos, manter distancia linha Viva de alta com corda não metálica (estática isolante) descer sistema dupla tração", "Içar cintas de aço balançando sob indução magnética de raios trovoando nuvem no deck do rádio.", "Apoiar peso num mosquetao simples de metal rasgado da queda primária solto pelo tempo e sol poente de vento de sudoeste puxando"],
    [90, "especial", 5, "Pneus Antigos Cemitério", "Colunas borracha espessa fumaça preta kms.", ["ABT", "ABS", "APP", "AR"], "Comando e Controle", "Oleo inflamável fervendo do asfalto.", "Seccionar a queima escavadeiras apartando o acervo sujo, inundar vala óleo retendo LGE ou Terra; jogar água so de neblina contensão", "Lavar borrachas centrais espalhando rio de fogo líquido ao bairro ribeirinho sem drenar esgoto e mananciais.", "Usar todo reservatorio tanque do caminhão numa única poça que borbulha inútil sob os empilhamentos grossos de roda grossa cega."],
    [91, "animal", 1, "Bicho Preguiça No Sinal Amarelo Urbano", "Parou Transito e está assustada garras finas fixas", ["ABS"], "Salvamento em Altura", "Fios enrolam corpo denso do animal devagarzinho", "Desligar luzes de transito do mastro e destravar garrinhas soltando pacientemente folhinhas amigaveis a caixa aerea escada", "Apertar forte e tracionar arrancando dedos fora cortando tendões e patas rasgadas pelas ferragens da rua urbana da buzina da PM.", "Puxar macaquinho caindo tonto da batida varada que soltaram de baixo do caminhao da prefeitura lixo correndo solta e morrendo atropelada caindo cega ao solo seco"],
    [92, "predial", 3, "Lençóis Queimando Lavanderia Subsolo Hospital", "Secadoras derretendo em tubos.", ["ABT", "ABS", "ASE"], "Comando e Controle", "Toxinas ao duto e elevadores", "Corte gás imediato base; ataque ofensivo confinado e Ventilação Natural Forçada Pela lateral extração; Não inundar corredor.", "Jogar fumaça quente para as saídas superiores do berçario 1 Andar evacuado atrasado.", "Correr pelos túneis apertados da caldeira usando mascara de pano para tossir no calor infernal das tubulações em chama viva no porão de pó sem rádio funcionando."],
    [93, "hazmat", 4, "Posto Combustível GNV Disparado Valvula", "Vazamento em Pressão Altíssima de Carro", ["ABT", "APP", "ASE"], "Produtos Perigosos", "Ruído extremo de metano gasoso. Nevoa fria densa perigo faisca em bomba.", "S-Off geral das bombas mestre na guarita, cordao de Isolamento Total; Neblinar em alta dissipando GNV sem congelar os tubos sob proteção cega e nao faiscante na base", "Trancar o jato com a mao, placa peito ou toalhinhas esmagadas sob a lata do bico vazado com super forca humana", "Mandar todo mundo ligar seu carro na partida e sair voado pra salvar de bomba os seus golzinho de praça, pipocando arranque."],
    [94, "crise", 4, "Gás GLP Suicida Fechado Fogão Interno Quarto Ap", "Forte cheiro corredor de botijoes vazados, isqueiro ameaçando.", ["AR", "ABT", "ABS", "ASE"], "Abordador Técnico", "Risco Explosão Morte Coletiva na Madrugada", "Corte energia Predio rua afora Gás Geral válvulas centrais ; Evacuação silênciosa Taticos em janela lateral para diálogo persuasivo de desarmar pavio no quarto, janelas ao Vento disperso com Neblina de Cortina Externa.", "Apertar alarme do corredor da campainha gerando faisca detonadora explodindo todas portas ao hall", "Cortar porta base no machado espalhando panico sem tirar os dutos inflamados na atmosfera e pular gritando pra não tacar fogo nos moleques do quintal vizinhos no terreo morto."],
    [95, "pericia", 3, "Iate Cabine Fibra Marina Fogo Vizinhas lanchas", "Deixou lanchas cais queimadas a ré.", ["AR"], "Períto de Incêndio", "Fibra Delaminada funda motor.", "Registrar curtos na conexão de estibordo com rede do cais de luz docas aterrada em ponte metálica, bater foto das bombas óleo esvaziadas antes do afundamento nas comportas de lixo da doca portuária e anexos legais docados portos civis.", "Descartar relatorio das docas acusar faísca sem provar delaminação isolante central elétrica", "Jogar destroços a baía fundos por ordem do capitao porto e nao recolher pecas base pro processo de pagamento lixo"],
    [96, "veicular", 4, "Carreta Suspensa Caída Marginal", "Pende caindo sob teto sedan.", ["ABS", "ABT", "ASE", "AR"], "Socorrista", "Carga pressiona torax motorista na cabine amarela no vão da ribanceira do rodoanel escuro de 10 metros.", "Escorar estais carreta na traseira antes que despenque final; Expansor ram no banco retirando pernas cinto imovel em 0 Grau e colocar no sled do cesto maca içamento com guindaste do Munck reboque fixo em 4 cintas de amarração 6 Toneladas na viga transversal 1.", "Arrancar portas e cortar a coluna com serra afrouxando resistencia inteira de capota tombando baú no vão livre em morte esmagante a todos bombeiros cortando as molas traseiras com alicate velho pesado de 40 lbs ao vento livre descendo com pernas finas de guincho mal amarrado pelas pressas do tenente de área correndo."]
    [97, "florestal", 3, "Incêndio Causado por Queda de Balão em Mata Atlântica", "Balão de grande porte caiu aceso em copa de árvores perto de reserva biológica.", ["ABT", "ABS", "AR"], "Combate a Incêndios Florestais",
        "A bucha do balão ainda queima forte no chão espalhando múltiplos focos secundários na serrapilheira.",
        "Abafar/resfriar prioritariamente a bucha principal para cessar novas brasas, abrir aceiro circular ao redor dos focos e recolher a estrutura do balão",
        "Sacudir a bandeira e a bucha acesa espalhando parafina derretida pela mata",
        "Combater apenas um lado deixando a bucha principal soltando fagulhas a favor do vento"],
    [98, "aquatico", 4, "Resgate Noturno de Tripulantes de Veleiro Naufragado", "Veleiro chocou-se contra laje submersa à noite; três náufragos usam coletes com luz estroboscópica.", ["ABS", "AR", "ASE"], "Mergulhador Autônomo",
        "A escuridão dificulta ver as pedras submersas e as vítimas apresentam sinais de hipotermia.",
        "Navegar por carta náutica/sonar com vigia de proa e holofote de busca, recolher os náufragos na horizontal para evitar colapso pós-resgate e aquecê-los",
        "Acelerar a lancha de salvamento às cegas sobre a laje submersa no escuro",
        "Obrigar os náufragos hipotérmicos a subirem escada alta fazendo esforço intenso"],
    [99, "busca", 4, "Operação de Busca de Asa-Delta Caída na Serra", "Piloto perdeu sustentação e caiu em encosta de mata densa sem sinal de celular.", ["ABS", "AR", "ASE"], "Salvamento em Montanhas",
        "Testemunhas viram a asa branca sumir atrás da segunda crista rochosa antes do pôr do sol.",
        "Cruzar os azimutes visuais das testemunhas (triangulação) no mapa topográfico, lançar equipe de montanha pela crista e manter escuta de rádio/apito",
        "Entrar na mata sem bússola nem GPS caminhando em círculos no fundo do vale",
        "Encerrar as buscas na primeira hora sem triangular os pontos de avistamento"],
    [100, "colapso", 5, "Explosão e Colapso em Moinho Industrial", "Onda de choque derrubou paredes de alvenaria com múltiplos feridos no pátio e subsolo.", ["ABS", "ABT", "AEM", "APP", "ASE", "AR"], "Comando e Controle",
        "É a maior ocorrência do ano: há incêndio secundário, feridos caminhando no pátio e desaparecidos sob lajes.",
        "Implantar imediatamente o SCI (Sistema de Comando de Incidentes), setorizar Combate, Busca/Resgate (BREC) e Triagem START, controlando o risco de nova explosão",
        "Mandar todas as guarnições entrarem desordenadas no mesmo prédio sem Posto de Comando",
        "Transportar apenas quem está gritando na porta e deixar o subsolo sem avaliação"]
];

const META_CATASTROFES = {
    101: { cat: "colapso",  titulo: "Rompimento de Barragem de Rejeitos", resumo: "Lama em movimento, ilhados e risco de nova onda.", viaturas: ["ABS", "ABT", "ASE", "AR"], curso: "Operações em Desastres" },
    102: { cat: "especial", titulo: "Queda de Aeronave em Área Urbana", resumo: "Querosene em chamas e dezenas de vítimas na fuselagem.", viaturas: ["ABT", "APP", "ASE", "AR"], curso: "Socorrista" },
    103: { cat: "hazmat",   titulo: "Explosão em Refinaria (BLEVE)", resumo: "Esfera de GLP superaquecida com válvula de alívio apitando.", viaturas: ["ABT", "APP", "AR"], curso: "Produtos Perigosos" },
    104: { cat: "busca",    titulo: "Mega Deslizamento após Tromba d'Água", resumo: "Encosta instável com soterrados e risco de novo bloco.", viaturas: ["ABS", "ABT", "ASE", "AR"], curso: "Operações em Desastres" },
    105: { cat: "aquatico", titulo: "Incêndio e Naufrágio de Navio Químico", resumo: "Náufragos a barlavento e mancha tóxica a sotavento.", viaturas: ["AMA", "BIA", "APP", "ASE"], curso: "Produtos Perigosos" }
};

function popularCatalogoMissoes() {
    CATALOGO_100_MISSOES.length = 0;

    DADOS_100_MISSOES.forEach(item => {
        if (!item || item.length < 11) return;
        const [id, cat, nivel, titulo, resumo, viaturasOriginais, curso, dialogoSoldado, opCerta, opParcial, opErrada] = item;

        const jaTemAquatica = viaturasOriginais.includes("AMA") || viaturasOriginais.includes("BIA");
        const viaturas = (!jaTemAquatica && (cat === "aquatico" || id === 8 || id === 12))
            ? [...viaturasOriginais, "ASE"]
            : viaturasOriginais;

        let etapasSuperiores = [];
        try {
            if (typeof gerarEtapasSuperiores === "function") {
                etapasSuperiores = gerarEtapasSuperiores(id, titulo, cat) || [];
            }
        } catch (e) {}
        etapasSuperiores.forEach((e, i) => { if (!e.quadro) e.quadro = ["oficial", "superior"][i]; });

        CATALOGO_100_MISSOES.push({
            id,
            ehCatastrofe: false,
            titulo: `[Nível ${nivel}] ${titulo}`,
            resumo,
            cursoRecomendado: curso,
            viaturasIdeais: viaturas,
            xpRecompensa: 140 + (nivel * 35),
            categoria: cat,
            etapas: [
                {
                    quadro: "praca",
                    funcao: "SOLDADO (PONTA DA LINHA)",
                    dialogo: dialogoSoldado,
                    escolhas: [
                        { texto: opCerta, tipo: "correta", consequencia: "Manobra técnica executada com precisão! O risco primário foi controlado." },
                        { texto: opParcial, tipo: "parcial", atributoTeste: "Destreza Técnica", bonusParcial: 0, consequenciaFalha: "O improviso tático falhou e gerou complicações!" },
                        { texto: opErrada, tipo: "errada", atributoTeste: "Coragem Operacional", bonusParcial: -3, consequenciaFalha: "A ação de alto risco agravou severamente a ocorrência!" }
                    ]
                },
                ...etapasSuperiores
            ]
        });
    });


    Object.keys(CATALOGO_CATASTROFES).forEach(idStr => {
        const id = Number(idStr);
        const meta = META_CATASTROFES[id];
        if (!meta) return;
        const etapas = montarEtapasCatastrofe(id);
        if (!etapas || !etapas.length) return;
        CATALOGO_100_MISSOES.push({
            id,
            ehCatastrofe: true,
            titulo: `🌋 [CATÁSTROFE] ${meta.titulo}`,
            resumo: meta.resumo,
            cursoRecomendado: meta.curso,
            viaturasIdeais: meta.viaturas,
            xpRecompensa: 1800,
            categoria: meta.cat,
            etapas
        });
    });
}

window.addEventListener("load", () => {
    popularCatalogoMissoes();
    renderizarAtributosCriacao();
    atualizarPreviewCriacao();
    atualizarQuartel();
});

// ==========================================
// 3. NAVEGAÇÃO
// ==========================================
function mostrarTela(idTela) {
    clearInterval(estadoJogo.intervaloTimer);
    document.querySelectorAll(".tela").forEach(t => t.classList.remove("ativa"));
    const alvo = document.getElementById(idTela);
    if (alvo) alvo.classList.add("ativa");
    if (typeof Som !== "undefined" && typeof Som.fundo === "function") Som.fundo(idTela);
}

function irParaCriacao() {
    mostrarTela("tela-criacao");
    renderizarAtributosCriacao();
    atualizarPreviewCriacao();
}

function trocarAbaCriacao(aba) {
    document.getElementById("sub-criacao-visual").style.display = aba === "visual" ? "flex" : "none";
    document.getElementById("sub-criacao-attr").style.display = aba === "attr" ? "flex" : "none";
    document.getElementById("btn-aba-visual").classList.toggle("ativa", aba === "visual");
    document.getElementById("btn-aba-attr").classList.toggle("ativa", aba === "attr");
}

function abrirAbaQuartel(aba) {
    ["mapa", "missoes", "carreira", "cursos"].forEach(nome => {
        const elAba = document.getElementById(`aba-quartel-${nome}`);
        const elBtn = document.getElementById(`btn-q-${nome}`);
        
        if (elAba) {
            elAba.style.display = (nome === aba) ? "flex" : "none";
        }
        if (elBtn) elBtn.classList.toggle("ativa", nome === aba);
    });
    atualizarQuartel();
}

function mudarPaginaCursos(delta) {
    const totalCursos = Object.keys(estadoJogo.cursosComprados).length;
    const maxPag = Math.max(0, Math.ceil(totalCursos / 6) - 1);
    estadoJogo.paginaCursos = Math.max(0, Math.min(maxPag, estadoJogo.paginaCursos + delta));
    atualizarQuartel();
}

// ==========================================
// 4. PERSONALIZAÇÃO DE CRIAÇÃO
// ==========================================
function selecionarDificuldade(nome, segundos, botao) {
    estadoJogo.dificuldade = nome;
    estadoJogo.tempoBase = segundos;
    document.querySelectorAll("#seletor-dificuldade .btn-opcao").forEach(b => b.classList.remove("selecionado"));
    botao.classList.add("selecionado");
}

function selecionarCorpo(nome, botao) {
    estadoJogo.corpoBombeiros = nome;
    document.querySelectorAll("#seletor-corpo .btn-opcao").forEach(b => b.classList.remove("selecionado"));
    botao.classList.add("selecionado");
    atualizarPreviewCriacao();
}

function selecionarGenero(nome, botao) {
    estadoJogo.genero = nome;
    document.querySelectorAll("#seletor-genero .btn-opcao").forEach(b => b.classList.remove("selecionado"));
    botao.classList.add("selecionado");
    atualizarPreviewCriacao();
}

function selecionarPele(nome, botao) {
    estadoJogo.corPele = nome;
    document.querySelectorAll("#seletor-pele .btn-opcao").forEach(b => b.classList.remove("selecionado"));
    botao.classList.add("selecionado");
    atualizarPreviewCriacao();
}

function gerarMiniaturaMembroSVG(papel, usarEPI, largura = 72, altura = 105) {
    if (typeof desenharBonecoVetorial !== "function") return "";
    return `<svg viewBox="0 0 90 172" style="width:${largura}px;height:${altura}px;display:block;">${desenharBonecoVetorial(papel, usarEPI)}</svg>`;
}

function atualizarPreviewCriacao() {
    const box = document.getElementById("preview-equipe-criacao");
    if (!box) return;
    box.innerHTML = `
        <div style="display:flex;flex-direction:column;align-items:center;">
            ${gerarMiniaturaMembroSVG("Jovem", true, 78, 102)}
            <span style="font-size:10px;color:#ffca28;font-weight:bold;">SOLDADO (EPI)</span>
        </div>
        <div style="display:flex;flex-direction:column;align-items:center;">
            ${gerarMiniaturaMembroSVG("Oficial", false, 78, 102)}
            <span style="font-size:10px;color:#ffca28;font-weight:bold;">OFICIAL</span>
        </div>
        <div style="display:flex;flex-direction:column;align-items:center;">
            ${gerarMiniaturaMembroSVG("Superior", false, 78, 102)}
            <span style="font-size:10px;color:#ffca28;font-weight:bold;">COMANDO</span>
        </div>
    `;
}

function renderizarAtributosCriacao() {
    const container = document.getElementById("lista-atributos-criacao");
    if (!container) return;
    document.getElementById("pontos-restantes").innerText = estadoJogo.pontosDistribuir;
    container.innerHTML = "";

    for (const [nomeAttr, dados] of Object.entries(estadoJogo.atributos)) {
        const div = document.createElement("div");
        div.className = "linha-atributo";
        div.innerHTML = `
            <div><strong>${nomeAttr}</strong> <small>(${dados.cargo})</small></div>
            <div class="controles-attr">
                <button onclick="alterarAtributo('${nomeAttr}', -1)">-</button>
                <span style="margin: 0 8px; font-weight:bold;">${dados.valor}</span>
                <button onclick="alterarAtributo('${nomeAttr}', 1)">+</button>
            </div>
        `;
        container.appendChild(div);
    }
}

function alterarAtributo(nome, delta) {
    const attr = estadoJogo.atributos[nome];
    if (delta > 0 && estadoJogo.pontosDistribuir > 0 && attr.valor < 9) {
        attr.valor++;
        estadoJogo.pontosDistribuir--;
    } else if (delta < 0 && attr.valor > 3) {
        attr.valor--;
        estadoJogo.pontosDistribuir++;
    }
    renderizarAtributosCriacao();
}

function finalizarCriacao() {
    mostrarTela("tela-quartel");
    abrirAbaQuartel("missoes");
}

function atualizarQuartel() {
    if (CATALOGO_100_MISSOES.length === 0) popularCatalogoMissoes();

    // Atualizar HUD Geral
    const elUnif = document.getElementById("hud-uniforme");
    if (elUnif) elUnif.innerText = `${estadoJogo.corpoBombeiros} (${estadoJogo.genero} / ${estadoJogo.corPele})`;
    const elTok = document.getElementById("hud-tokens");
    if (elTok) elTok.innerText = estadoJogo.tokens;
    const elCob = document.getElementById("hud-cobertura");
    if (elCob) elCob.innerText = estadoJogo.coberturaCidade + "%";

    const xpP = document.getElementById("hud-xp-praca");
    const xpO = document.getElementById("hud-xp-oficial");
    const xpS = document.getElementById("hud-xp-superior");
    if (xpP) xpP.innerText = estadoJogo.xpIndividual.praca;
    if (xpO) xpO.innerText = estadoJogo.xpIndividual.oficial;
    if (xpS) xpS.innerText = estadoJogo.xpIndividual.superior;

    // 1. RENDERIZAR ABA MISSÕES (Modo Cards Clássico)
    const containerCards = document.getElementById("lista-cards-missoes");
    if (containerCards) {
        containerCards.innerHTML = "";
        if (estadoJogo.missoesAtivasIds.length > 0) {
            estadoJogo.missoesAtivasIds.forEach(idOc => {
                const oc = CATALOGO_100_MISSOES.find(o => o.id === idOc);
                if (!oc) return;

                const cardDiv = document.createElement("div");
                cardDiv.className = oc.ehCatastrofe ? "card-chamado catastrofe-card" : "card-chamado";
                cardDiv.innerHTML = `
                    <div class="card-chamado-topo">
                        <div style="flex:1;">
                            <h4 style="color:${oc.ehCatastrofe ? '#ffeb3b' : '#ffca28'}; font-size:12.5px;">${oc.titulo}</h4>
                            <p style="font-size:11px; color:#ddd; margin:2px 0;">${oc.resumo}</p>
                            <p style="font-size:10.5px; color:#90caf9;">🎓 Curso: <strong>${oc.cursoRecomendado}</strong> | XP: <strong>+${Math.floor(oc.xpRecompensa / oc.etapas.length)} por etapa</strong></p>
                        </div>
                    </div>
                    <button class="btn-principal" style="width:100%; padding:8px; font-size:12px; margin-top:4px;" onclick="iniciarDespacho(${oc.id})">
                        ${oc.ehCatastrofe ? "🌋 ATENDER CATÁSTROFE" : "🚨 INICIAR MISSÃO"}
                    </button>
                `;
                containerCards.appendChild(cardDiv);
            });
        }
    }

    // 2. RENDERIZAR ABA CARREIRA
    const painelCarreira = document.getElementById("painel-detalhe-carreira");
    if (painelCarreira) {
        painelCarreira.innerHTML = "";
        const quadros = [
            { chave: "praca", titulo: "Quadro de Praças (Etapa 1)", papel: "Jovem", epi: true },
            { chave: "oficial", titulo: "Quadro de Oficiais (Etapa 2)", papel: "Oficial", epi: false },
            { chave: "superior", titulo: "Estado-Maior (Etapa 3)", papel: "Superior", epi: false }
        ];

        quadros.forEach(q => {
            const idx = estadoJogo.indicesPatente[q.chave];
            const xpMembro = estadoJogo.xpIndividual[q.chave];
            const patAtual = CARREIRAS[q.chave][idx];
            const proxIdx = idx + 1;
            const temProx = proxIdx < CARREIRAS[q.chave].length;
            const patProx = temProx ? CARREIRAS[q.chave][proxIdx] : "Topo da Carreira";
            const metaXP = temProx ? METAS_XP[q.chave][proxIdx] : xpMembro;
            const pct = temProx ? Math.min(100, Math.floor((xpMembro / metaXP) * 100)) : 100;

            const card = document.createElement("div");
            card.className = "card-carreira-membro";
            card.innerHTML = `
                <div style="background:#1a1e26;border:1px solid #c5a880;border-radius:6px;padding:2px;">
                    ${gerarMiniaturaMembroSVG(q.papel, q.epi, 50, 72)}
                </div>
                <div class="info-carreira">
                    <strong>${q.titulo}</strong>
                    <span>Patente Atual: <strong style="color:#ffca28;">${patAtual}</strong></span>
                    <span>Próxima: <strong>${patProx}</strong> ${temProx ? `(${xpMembro}/${metaXP} XP)` : "✔"}</span>
                    <div class="barra-xp-carreira"><div class="barra-xp-preench" style="width:${pct}%"></div></div>
                </div>
            `;
            painelCarreira.appendChild(card);
        });
    }

    // 3. RENDERIZAR ABA CURSOS
    const listaCursos = document.getElementById("lista-cursos");
    if (listaCursos) {
        listaCursos.innerHTML = "";
        const entradasCursos = Object.entries(estadoJogo.cursosComprados);
        const iniCur = estadoJogo.paginaCursos * 6;
        const cursosPagina = entradasCursos.slice(iniCur, iniCur + 6);

        cursosPagina.forEach(([nomeCurso, comprado]) => {
            const div = document.createElement("div");
            div.className = "linha-atributo";
            div.innerHTML = `
                <span>${nomeCurso}</span>
                ${comprado
                    ? `<span style="color:#4caf50; font-weight:bold;">✔ Habilitado</span>`
                    : `<button class="btn-opcao" style="max-width:120px; padding:4px 8px;" onclick="comprarCurso('${nomeCurso}')">Comprar (10 🪙)</button>`}
            `;
            listaCursos.appendChild(div);
        });

        const indCur = document.getElementById("indicador-pagina-cursos");
        if (indCur) {
            const totalPagCur = Math.max(1, Math.ceil(entradasCursos.length / 6));
            indCur.innerText = `Página ${estadoJogo.paginaCursos + 1}/${totalPagCur}`;
        }
    }
}

function comprarCurso(nomeCurso) {
    if (estadoJogo.tokens >= 10 && !estadoJogo.cursosComprados[nomeCurso]) {
        estadoJogo.tokens -= 10;
        estadoJogo.cursosComprados[nomeCurso] = true;
        atualizarQuartel();
    } else {
        alert("Tokens insuficientes! Cada curso custa 10 Tokens.");
    }
}

// ==========================================
// 5. DESPACHO E EXECUÇÃO
// ==========================================
function iniciarDespacho(idOcorrencia) {
    estadoJogo.ocorrenciaAtual = CATALOGO_100_MISSOES.find(o => o.id === idOcorrencia);
    estadoJogo.viaturasSelecionadas = [];
    mostrarTela("tela-despacho");

    document.getElementById("despacho-titulo").innerText = estadoJogo.ocorrenciaAtual.titulo;
    document.getElementById("despacho-descricao").innerText = estadoJogo.ocorrenciaAtual.resumo;

    const container = document.getElementById("lista-viaturas");
    container.innerHTML = "";
    VIATURAS_DISPONIVEIS.forEach(v => {
        const btn = document.createElement("button");
        btn.className = "btn-opcao";
        btn.innerText = v.nome;
        btn.onclick = () => {
            if (estadoJogo.viaturasSelecionadas.includes(v.id)) {
                estadoJogo.viaturasSelecionadas = estadoJogo.viaturasSelecionadas.filter(i => i !== v.id);
                btn.classList.remove("selecionado");
            } else {
                estadoJogo.viaturasSelecionadas.push(v.id);
                btn.classList.add("selecionado");
            }
        };
        container.appendChild(btn);
    });
}

function confirmarDespacho() {
    if (estadoJogo.viaturasSelecionadas.length === 0) {
        alert("Selecione pelo menos uma viatura para sair do quartel!");
        return;
    }

    const ideais = estadoJogo.ocorrenciaAtual.viaturasIdeais;
    const faltouViaturaIdeal = ideais.some(v => !estadoJogo.viaturasSelecionadas.includes(v));
    const excessoViaturas = estadoJogo.viaturasSelecionadas.filter(v => !ideais.includes(v)).length;

    let penalidadeTempo = 0;
    let aviso = "";
    if (faltouViaturaIdeal) {
        penalidadeTempo = 4;
        aviso += `⚠️ Viaturas insuficientes (Ideal: ${ideais.join(", ")})! -4s aguardando apoio. `;
    }
    if (excessoViaturas > 0) {
        estadoJogo.coberturaCidade = Math.max(20, estadoJogo.coberturaCidade - (excessoViaturas * 15));
        aviso += `⚠️ ${excessoViaturas} viatura(s) em excesso! Cobertura da cidade caiu para ${estadoJogo.coberturaCidade}%.`;
    }

    estadoJogo.avisoPendenteTexto = aviso;
    estadoJogo.etapaAtual = 0;
    estadoJogo.falhasNaMissao = 0;
    estadoJogo.ganhosNaMissao = { praca: 0, oficial: 0, superior: 0 };
    mostrarTela("tela-ocorrencia");
    carregarEtapaOcorrencia(penalidadeTempo);
}

function carregarEtapaOcorrencia(penalidadeSegundos = 0) {
    const oc = estadoJogo.ocorrenciaAtual;
    // 🎵 Toca o som específico da categoria do socorro (ex: animal.mp3, hazmat.mp3, etc.)
    if (typeof Som !== "undefined" && oc && oc.categoria) {
        Som.tocarSocorro(oc.categoria);
    }
    const etapa = oc.etapas[estadoJogo.etapaAtual];
    estadoJogo.bonusDadoAtivo = 0;
    estadoJogo.ultimoTipoEscolha = null;

    document.getElementById("caixa-dado").style.display = "none";
    document.getElementById("etapa-funcao").innerText = etapa.funcao;
    document.getElementById("etapa-progresso").innerText = `Etapa ${estadoJogo.etapaAtual + 1} de ${oc.etapas.length}`;
    document.getElementById("dialogo-cena").innerText = etapa.dialogo;

    const boxCena = document.getElementById("ilustracao-cena-box");
    if (typeof gerarIlustracaoCenaSVG === "function") {
        boxCena.innerHTML = gerarIlustracaoCenaSVG(oc.categoria, estadoJogo.etapaAtual, "inicial", oc.id);
    }

    const avisoBox = document.getElementById("aviso-empenho-box");
    if (estadoJogo.avisoPendenteTexto) {
        avisoBox.style.display = "block";
        avisoBox.innerText = estadoJogo.avisoPendenteTexto;
        estadoJogo.avisoPendenteTexto = "";
    } else {
        avisoBox.style.display = "none";
    }

    const areaCurso = document.getElementById("area-curso-ativo");
    areaCurso.innerHTML = "";
    if (estadoJogo.cursosComprados[oc.cursoRecomendado]) {
        areaCurso.innerHTML = `
            <button id="btn-usar-curso" class="btn-curso" onclick="usarCursoNaFase()">
                🎓 Ativar Curso: ${oc.cursoRecomendado} (+8s e +2 no D10)
            </button>
        `;
    }

    const listaEscolhas = document.getElementById("lista-escolhas");
    listaEscolhas.innerHTML = "";
    etapa.escolhas.forEach(esc => {
        const btn = document.createElement("button");
        btn.className = "btn-escolha";
        btn.innerText = esc.texto;
        btn.onclick = () => { if(typeof processarEscolha === "function") processarEscolha(esc); };
        listaEscolhas.appendChild(btn);
    });

    iniciarCronometro(Math.max(4, estadoJogo.tempoBase - penalidadeSegundos));
}

function iniciarCronometro(segundosIniciais) {
    clearInterval(estadoJogo.intervaloTimer);
    estadoJogo.tempoRestante = segundosIniciais;
    const tempoTotal = segundosIniciais;
    atualizarVisualCronometro(tempoTotal);

    estadoJogo.intervaloTimer = setInterval(() => {
        if (estadoJogo.timerPausado) return;
        estadoJogo.tempoRestante--;
        atualizarVisualCronometro(tempoTotal);

        if (estadoJogo.tempoRestante <= 0) {
            clearInterval(estadoJogo.intervaloTimer);
            estadoJogo.falhasNaMissao++;
            avancarEtapaOuConcluir(false);
        }
    }, 1000);
}

function atualizarVisualCronometro(tempoTotal) {
    document.getElementById("contador-segundos").innerText = estadoJogo.tempoRestante + "s";
    const pct = Math.max(0, (estadoJogo.tempoRestante / tempoTotal) * 100);
    const barra = document.getElementById("barra-tempo-preenchimento");
    barra.style.width = pct + "%";
    barra.style.background = pct > 40 ? "#4caf50" : "#f44336";
}

function usarCursoNaFase() {
    estadoJogo.tempoRestante += 8;
    estadoJogo.bonusDadoAtivo = 2;
    const btnCurso = document.getElementById("btn-usar-curso");
    if (btnCurso) {
        btnCurso.disabled = true;
        btnCurso.innerText = "🎓 Curso Ativo! (+8s e +2 no D10)";
    }
}

function avancarEtapaOuConcluir(sucessoEtapa) {
    const oc = estadoJogo.ocorrenciaAtual;
    const etapaDef = oc.etapas[estadoJogo.etapaAtual];
    const quadroDaEtapa = (etapaDef && etapaDef.quadro) || ["praca", "oficial", "superior"][estadoJogo.etapaAtual] || "praca";
    const fatores = { correta: 1, parcial: 0.5, errada: 0.25 };
    const fator = fatores[estadoJogo.ultimoTipoEscolha] !== undefined ? fatores[estadoJogo.ultimoTipoEscolha] : 1;
    const xpPorEtapa = Math.round(Math.floor(oc.xpRecompensa / oc.etapas.length) * fator);
    estadoJogo.ultimoTipoEscolha = null;

    if (sucessoEtapa) {
        estadoJogo.xpIndividual[quadroDaEtapa] += xpPorEtapa;
        estadoJogo.ganhosNaMissao[quadroDaEtapa] += xpPorEtapa;
        estadoJogo.xp += xpPorEtapa;
    }

    estadoJogo.etapaAtual++;
    if (estadoJogo.etapaAtual < estadoJogo.ocorrenciaAtual.etapas.length) {
        carregarEtapaOcorrencia(0);
    } else {
        concluirMissao(estadoJogo.falhasNaMissao === 0);
    }
}

function concluirMissao(sucessoTotal) {
    const modal = document.getElementById("modal-promocao");
    const textoModal = document.getElementById("texto-promocao");
    const oc = estadoJogo.ocorrenciaAtual;
    const g = estadoJogo.ganhosNaMissao;

    const resumoXP = `
        <div style="background:#1b2028; padding:8px; border-radius:6px; margin:6px 0; text-align:left; font-size:12px;">
            <div>🪖 <strong>Praça (Soldado):</strong> ${g.praca > 0 ? `<span style="color:#4caf50;">+${g.praca} XP ✔</span>` : `<span style="color:#f44336;">0 XP (Falhou)</span>`}</div>
            <div>⭐ <strong>Oficial (Socorro):</strong> ${g.oficial > 0 ? `<span style="color:#4caf50;">+${g.oficial} XP ✔</span>` : `<span style="color:#f44336;">0 XP (Falhou)</span>`}</div>
            <div>🦅 <strong>Estado-Maior (Cmdo):</strong> ${g.superior > 0 ? `<span style="color:#4caf50;">+${g.superior} XP ✔</span>` : `<span style="color:#f44336;">0 XP (Falhou)</span>`}</div>
        </div>
    `;

    if (sucessoTotal) {
        const recompensaTokens = oc.ehCatastrofe ? 5 : 2;
        estadoJogo.tokens += recompensaTokens;
        textoModal.innerHTML = `
            <h3 style="color:#4caf50;">🏆 ${oc.ehCatastrofe ? "CATÁSTROFE CONTROLADA!" : "MISSÃO CONCLUÍDA COM SUCESSO!"}</h3>
            ${resumoXP}
            <p><strong>Recompensa:</strong> +${recompensaTokens} 🪙 Tokens!</p>
        `;
    } else {
        estadoJogo.tokens = Math.max(0, estadoJogo.tokens - 3);
        textoModal.innerHTML = `
            <h3 style="color:#f44336;">⚠️ MISSÃO COM FALHAS!</h3>
            <p>Apenas os acertos renderam XP:</p>
            ${resumoXP}
            <p><strong>Penalidade Geral:</strong> -3 🪙 Tokens!</p>
        `;
    }

    estadoJogo.missoesConcluidas++;
    const idAtual = oc.id;
    estadoJogo.missoesAtivasIds = estadoJogo.missoesAtivasIds.filter(id => id !== idAtual);

    let proximaId = null;
    if (estadoJogo.missoesConcluidas > 0 && estadoJogo.missoesConcluidas % 25 === 0) {
        const chefes = [101, 102, 103, 104, 105];
        proximaId = chefes[estadoJogo.bossesGerados % chefes.length];
        estadoJogo.bossesGerados++;
        if (estadoJogo.missoesAtivasIds.includes(proximaId)) proximaId = null;
        else textoModal.innerHTML += `<p style="color:#ffeb3b; margin-top:8px;">🌋 <strong>ALERTA MÁXIMO!</strong> Uma catástrofe surgiu no mapa.</p>`;
    }
    if (proximaId === null) {
        const livres = CATALOGO_100_MISSOES.filter(o => !o.ehCatastrofe && o.id !== idAtual && !estadoJogo.missoesAtivasIds.includes(o.id));
        proximaId = livres.length ? livres[Math.floor(Math.random() * livres.length)].id : idAtual;
    }
    estadoJogo.missoesAtivasIds.push(proximaId);

    checarNovasPromocoes();
    modal.style.display = "flex";
}

function checarNovasPromocoes() {
    for (const quadro of ["praca", "oficial", "superior"]) {
        let nivelAtual = estadoJogo.indicesPatente[quadro];
        const xpMembro = estadoJogo.xpIndividual[quadro];
        while (nivelAtual + 1 < CARREIRAS[quadro].length && xpMembro >= METAS_XP[quadro][nivelAtual + 1]) {
            const de = CARREIRAS[quadro][nivelAtual];
            const para = CARREIRAS[quadro][nivelAtual + 1];
            nivelAtual++;
            estadoJogo.indicesPatente[quadro] = nivelAtual;
            estadoJogo.filaPromocoes.push({ quadro, de, para, idxNovo: nivelAtual });
        }
    }
}

function fecharModalRelatorio() {
    document.getElementById("modal-promocao").style.display = "none";
    if (estadoJogo.filaPromocoes.length > 0 && typeof iniciarCerimonia === "function") {
        iniciarCerimonia();
    } else {
        mostrarTela("tela-quartel");
        atualizarQuartel();
    }
}

// ==========================================
// 6. ATALHOS DE TESTE RÁPIDO (DEV)
// ==========================================
function devIrPara(idTela) {
    mostrarTela(idTela);
    if (idTela === "tela-quartel") atualizarQuartel();
    if (idTela === "tela-criacao") {
        renderizarAtributosCriacao();
        atualizarPreviewCriacao();
    }
}

function devAdicionarRecursos() {
    estadoJogo.xpIndividual.praca += 400;
    estadoJogo.xpIndividual.oficial += 400;
    estadoJogo.xpIndividual.superior += 400;
    estadoJogo.tokens += 10;
    checarNovasPromocoes();
    if (estadoJogo.filaPromocoes.length > 0 && typeof iniciarCerimonia === "function") {
        iniciarCerimonia();
    } else if (document.getElementById("tela-quartel").classList.contains("ativa")) {
        atualizarQuartel();
    }
}

function devForcarCatastrofe() {
    const catIds = [101, 102, 103, 104, 105];
    const sorteada = catIds[Math.floor(Math.random() * catIds.length)];
    if (!estadoJogo.missoesAtivasIds.includes(sorteada)) {
        estadoJogo.missoesAtivasIds[0] = sorteada;
    }
    mostrarTela("tela-quartel");
    abrirAbaQuartel("missoes");
}

function devForcarPromocao() {
    estadoJogo.xpIndividual.praca += 700;
    estadoJogo.xpIndividual.oficial += 1100;
    estadoJogo.xpIndividual.superior += 17000;
    checarNovasPromocoes();
    if (estadoJogo.filaPromocoes.length > 0 && typeof iniciarCerimonia === "function") {
        iniciarCerimonia();
    }
}

function devPausarTempo() {
    estadoJogo.timerPausado = !estadoJogo.timerPausado;
    document.getElementById("btn-dev-pause").innerText = estadoJogo.timerPausado ? "▶️ Retomar" : "⏸️ Tempo";
}