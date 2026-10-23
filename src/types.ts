export interface User {
  id: string;
  nome: string;
  email: string;
  pontuacao: number;
  nivel: number;
}

export interface Ecopoint {
  id: number;
  nome: string;
  latitude: number;
  longitude: number;
  endereco: string;
  materiais_aceitos: string[];
  regiao: string;
  horario: string;
  telefone: string;
}

export interface Disposal {
  id: string;
  user_id: string;
  ecopoint_id: number;
  tipo_residuo: string;
  peso: number; // in kg
  data: string; // ISO format string
  pontos_ganhos: number;
  equipamento_nome?: string;
}

export interface Badge {
  id: string;
  nome: string;
  descricao: string;
  pontos_requisito: number;
  icone: string; // Lucide icon name
  cor: string; // Tailwind color class
}

export interface QuizQuestion {
  id: number;
  pergunta: string;
  alternativas: string[];
  resposta_correta: number; // index of alternativas
  explicacao: string;
}

export interface Article {
  id: string;
  titulo: string;
  resumo: string;
  conteudo: string;
  categoria: string;
  tempoLeitura: string;
  fonte: string;
  urlReferencia?: string;
}

export interface ScanResult {
  nome: string;
  categoria: string;
  pesoEstimado: number;
  componentesReciclaveis: string[];
  componentesToxicos: string[];
  instrucoesDescarte: string;
  pontosEstimados: number;
}

export interface EcoRouteResult {
  residuosIdentificados: string[];
  pontosRecomendados: {
    ecopointId: number;
    nome: string;
    endereco: string;
    materiais_adequados: string[];
    distanciaEstimada: string;
  }[];
  rotaPassos: string[];
  tempoEstimado: string;
  co2EvitadoEstimado: number;
}
