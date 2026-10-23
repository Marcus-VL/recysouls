import { Ecopoint, Badge, QuizQuestion, Article } from "./types";

export const SEED_ECOPOINTS: Ecopoint[] = [
  {
    id: 1,
    nome: "EcoPoint Centro",
    latitude: -12.2664,
    longitude: -38.9663,
    endereco: "Av. Getúlio Vargas, 1420 (Próximo à Prefeitura) - Centro",
    regiao: "Centro",
    materiais_aceitos: ["Celulares / Tablets", "Computadores / Notebooks", "Cabos / Carregadores", "Pilhas / Baterias"],
    horario: "Segunda a Sexta - 08:00 às 17:00",
    telefone: "(75) 3601-2301"
  },
  {
    id: 2,
    nome: "EcoPoint Kalilândia",
    latitude: -12.2500,
    longitude: -38.9500,
    endereco: "Praça da Kalilândia, 48 - Kalilândia",
    regiao: "Kalilândia",
    materiais_aceitos: ["Pilhas / Baterias", "Celulares / Tablets", "Monitores / TVs", "Cabos / Carregadores"],
    horario: "Segunda a Sexta - 08:00 às 18:00",
    telefone: "(75) 3601-2302"
  },
  {
    id: 3,
    nome: "EcoPoint Avenida Nóide Cerqueira",
    latitude: -12.2750,
    longitude: -38.9200,
    endereco: "Av. Nóide Cerqueira, km 3 - SIM",
    regiao: "SIM",
    materiais_aceitos: ["Computadores / Notebooks", "Impressoras / Scanners", "Eletrodomésticos Pequenos"],
    horario: "Segunda a Sábado - 09:00 às 19:00",
    telefone: "(75) 3601-2303"
  },
  {
    id: 4,
    nome: "EcoPoint Cidade Nova",
    latitude: -12.2350,
    longitude: -38.9550,
    endereco: "Av. Transnordestina, s/n (Próxima à UEFS) - Cidade Nova",
    regiao: "Cidade Nova",
    materiais_aceitos: ["Computadores / Notebooks", "Celulares / Tablets", "Pilhas / Baterias", "Monitores / TVs"],
    horario: "Segunda a Sexta - 07:30 às 17:30",
    telefone: "(75) 3601-2304"
  },
  {
    id: 5,
    nome: "EcoPoint Feira VII",
    latitude: -12.2900,
    longitude: -38.9700,
    endereco: "Av. de Canal, 892 - Feira VII",
    regiao: "Feira VII",
    materiais_aceitos: ["Pilhas / Baterias", "Celulares / Tablets", "Eletrodomésticos Pequenos", "Cabos / Carregadores"],
    horario: "Segunda a Sexta - 08:00 às 17:00",
    telefone: "(75) 3601-2305"
  },
  {
    id: 6,
    nome: "EcoPoint Tomba",
    latitude: -12.2853,
    longitude: -38.9801,
    endereco: "Praça Macário Barreto, 12 - Tomba",
    regiao: "Tomba",
    materiais_aceitos: ["Eletrodomésticos Pequenos", "Monitores / TVs", "Computadores / Notebooks", "Cabos / Carregadores"],
    horario: "Segunda a Sexta - 08:00 às 17:00, Sábado - 08:00 às 12:00",
    telefone: "(75) 3601-2306"
  }
];

export const BADGES: Badge[] = [
  {
    id: "reciclador_iniciante",
    nome: "Latente Incolor / Unkindled",
    descricao: "Ganho ao realizar sua primeira oferenda de lixo eletrônico na Fogueira de RecySouls.",
    pontos_requisito: 50,
    icone: "Award",
    cor: "bg-teal-950/40 text-teal-300 border-teal-500/30"
  },
  {
    id: "guardiao_ambiental",
    nome: "Guardião da Fogueira / Firekeeper",
    descricao: "Acumule pelo menos 150 Almas Recicladas (Souls) realizando depósitos e decifrando pergaminhos de sabedoria.",
    pontos_requisito: 150,
    icone: "Shield",
    cor: "bg-teal-900/40 text-emerald-300 border-emerald-500/30"
  },
  {
    id: "heroi_verde",
    nome: "Lorde das Cinzas Verdes / Lord of Cinder",
    descricao: "Nível supremo do Santuário de RecySouls! Purificou pelo menos 350 almas de resíduos tecnológicos.",
    pontos_requisito: 350,
    icone: "Zap",
    cor: "bg-amber-950/40 text-amber-300 border-amber-500/30"
  }
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    pergunta: "Pilhas e baterias velhas podem ser jogadas no lixo comum?",
    alternativas: ["Sim, elas vão decompor normalmente.", "Não, elas contêm metais pesados tóxicos e exigem logística reversa."],
    resposta_correta: 1,
    explicacao: "Pilhas e baterias contêm metais como mercúrio, chumbo e cádmio. Sob decomposição ou queima, esses componentes vazam e poluem severamente o solo e os lençóis freáticos, além de causarem doenças!"
  },
  {
    id: 2,
    pergunta: "O que diz a Política Nacional de Resíduos Sólidos (PNRS) sobre lixo eletrônico?",
    alternativas: [
      "Que os eletrônicos são de responsabilidade exclusiva dos municípios.",
      "Que fabricantes, distribuidores e consumidores compartilham a responsabilidade pelo ciclo de vida dos produtos (Logística Reversa)."
    ],
    resposta_correta: 1,
    explicacao: "A PNRS (Lei 12.305/10) estabelece a responsabilidade compartilhada. Isso significa que as empresas de tecnologia devem prover canais para receber de volta aparelhos velhos e reciclá-los."
  },
  {
    id: 3,
    pergunta: "Aproximadamente, qual a quantidade de lixo eletrônico gerada anualmente no Brasil?",
    alternativas: ["Cerca de 2,4 milhões de toneladas.", "Cerca de 50 mil toneladas.", "O Brasil não possui estimativas de lixo eletrônico."],
    resposta_correta: 0,
    explicacao: "O Brasil é o maior gerador de lixo eletrônico da América Latina e o quinto no mundo, gerando cerca de 2,4 milhões de toneladas anuais. Infelizmente, menos de 3% de todo esse volume é oficialmente reciclado."
  },
  {
    id: 4,
    pergunta: "Quais materiais de valor podem ser extraídos e purificados da reciclagem de placas eletrônicas de alta tecnologia?",
    alternativas: ["Apenas plástico comum e silício.", "Metais preciosos como Ouro, Prata, Cobre e Paládio.", "Nenhum material de valor é reutilizável."],
    resposta_correta: 1,
    explicacao: "Placas de circuito impresso contêm traços de ouro de extrema pureza, cobre de alta condutividade e prata. A mineração urbana do lixo eletrônico poupa recursos naturais finitos."
  },
  {
    id: 5,
    pergunta: "A queima informal ou derretimento inadequado de fiação de cobre pode gerar quais riscos?",
    alternativas: ["Liberação de gases inofensivos para a atmosfera.", "Emissão de dioxinas altamente tóxicas e cancerígenas decorrentes do plástico PVC."],
    resposta_correta: 1,
    explicacao: "A queima ao ar livre para extrair cobre derrete o isolamento de PVC, expelindo cloro molecular e dioxinas, poluentes orgânicos persistentes que atacam o sistema respiratório e imunológico."
  }
];

export const EDUCATION_ARTICLES: Article[] = [
  {
    id: "lixo_eletronico",
    titulo: "O que é Lixo Eletrônico?",
    resumo: "Conheça o conceito de REEE (Resíduos de Equipamentos Eletroeletrônicos) e como ele impacta diretamente a sua saúde e o meio urbano.",
    conteudo: `Os Resíduos de Equipamentos Eletroeletrônicos (REEE), ou simplesmente e-waste, englobam qualquer produto que dependa de energia elétrica ou pilhas/baterias para funcionar e que chegou ao fim de sua vida útil. Isso inclui computadores, notebooks, smartphones, carregadores, geladeiras, micro-ondas e até brinquedos de plástico inteligentes.

De acordo com o **Global E-waste Monitor**, milhões de toneladas são geradas mundialmente todo ano. O Brasil é um dos epicentros dessa crise na América Latina. O descarte em sacos de lixo tradicional ou em lixões desregulados gera um perigo silencioso: a oxidação do material exposto à chuva e ao sol liquefaz substâncias tóxicas que escorrem até a água potável profunda.`,
    categoria: "Conceitos Básicos",
    tempoLeitura: "4 min de leitura",
    fonte: "Organização das Nações Unidas (ONU)"
  },
  {
    id: "por_que_reciclar",
    titulo: "Por que Reciclar Eletrônicos?",
    resumo: "A reciclagem vai muito além de evitar a sujeira. Descubra os tesouros ocultos e os benefícios reais da mineração urbana de metais preciosos.",
    conteudo: `Equipamentos tecnológicos são verdadeiras 'minas portáteis'. Para fabricar um único smartphone de última geração, são necessários dezenas de elementos químicos raros, incluindo ouro altamente purificado, prata para soldas de precisão, lítio de alto desempenho, paládio e neodímio.

Ao descartar o smartphone antigo incorretamente, estamos enterrando riquezas fósseis que exigiram toneladas de escavações de mineração destrutiva para serem obtidas. A **mineração urbana** converte placas eletrônicas velhas em lingotes de cobre, fios de alumínio e ligas de aço estrutural de forma muito menos poluente. Além disso, cada quilograma de eletrônico reciclado reduz drasticamente a emissão de CO₂ gerada para produzir novos insumos a partir do zero.`,
    categoria: "Ambiental",
    tempoLeitura: "5 min de leitura",
    fonte: "Green Eletron & MMA"
  },
  {
    id: "economia_circular",
    titulo: "Economia Circular e Logística Reversa",
    resumo: "Como a mudança na dinâmica industrial preserva os recursos globais e cria emprego qualificado no Brasil através das diretrizes sustentáveis.",
    conteudo: `Diferente do modelo tradicional linear (que consiste em extrair, fabricar, consumir e descartar), a **Economia Circular** propõe que o resíduo de uma indústria seja o insumo primário de outra, fechando o circuito produtivo de maneira perpétua.

A **Política Nacional de Resíduos Sólidos (PNRS)** brasileira determina que fabricantes e importadores de pilhas, lâmpadas, baterias e produtos eletroeletrônicos estabeleçam fluxos organizados de recebimento desses resíduos após o uso. É a chamada **Logística Reversa**. Ao devolver suas baterias velhas em e-pontos de coleta devidamente credenciados, você alimenta diretamente cooperativas certificadas de catadores, gerando renda e reintroduzindo cobre e chumbo puro de volta para as ligas industriais.`,
    categoria: "Legislação",
    tempoLeitura: "6 min de leitura",
    fonte: "Ministério do Meio Ambiente (MMA)"
  }
];
