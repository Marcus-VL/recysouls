import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

// Body parser
app.use(express.json({ limit: "15mb" }));

// Helper to determine if we have a real Gemini API key
const hasActiveGeminiKey = (): boolean => {
  const key = process.env.GEMINI_API_KEY;
  return !!key && key !== "MY_GEMINI_API_KEY" && key.trim() !== "";
};

// Lazy initialize Gemini client
let _ai: GoogleGenAI | null = null;
const getGeminiClient = (): GoogleGenAI => {
  if (!hasActiveGeminiKey()) {
    throw new Error("GEMINI_API_KEY environment variable is not configured with a valid key.");
  }
  if (!_ai) {
    _ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return _ai;
};

// --- API Endpoints ---

// API Health Check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    hasApiKey: hasActiveGeminiKey(),
  });
});

// 1. Scanner de Produto (IA com Gemini-3.5-flash)
app.post("/api/scan", async (req, res) => {
  try {
    const { image, textFallback } = req.body;

    if (!hasActiveGeminiKey()) {
      console.warn("Using smart fallback offline identification because GEMINI_API_KEY is not configured.");
      
      // Smart static scanner simulator based on common items
      const query = (textFallback || "aparelho").toLowerCase();
      let detectedName = textFallback || "Aparelho Desconhecido";
      let category = "Outros Eletrônicos";
      let weight = 1.2;
      let recyclable = ["Cobre", "Plástico ABS", "Alumínio", "Soldas de Estanho"];
      let toxic = ["Traços de Chumbo", "Retardantes de Chama Bromados"];
      let points = 30;
      let descarte = "Entregue em ecopontos com recepção de pequenos eletrônicos ou informática.";

      if (query.includes("notebook") || query.includes("dell") || query.includes("computador") || query.includes("laptop")) {
        detectedName = textFallback || "Notebook Computável";
        category = "Computadores / Notebooks";
        weight = 2.1;
        recyclable = ["Placa de Circuito Impresso", "Carcaça de Alumínio", "Ouro dos Conectores", "Cobre das Bobinas", "Estanho"];
        toxic = ["Bateria de Íon de Lítio", "Chumbo nas soldas antigas", "Mercúrio no backlight (se antigo)"];
        points = 60;
        descarte = "Remova cartões de memória extras. Descarte preferencialmente intacto no EcoPoint Centro ou Cidade Nova para destinação segura de baterias de lítio.";
      } else if (query.includes("celular") || query.includes("iphone") || query.includes("samsung") || query.includes("motorola") || query.includes("telefone") || query.includes("smartphone")) {
        detectedName = textFallback || "Smartphone Genérico";
        category = "Celulares / Tablets";
        weight = 0.2;
        recyclable = ["Placa de circuito com ouro/cobre/silício", "Vidro da tela", "Carcaça protetora"];
        toxic = ["Bateria de Lítio selada", "Cobalto", "Níquel tóxico"];
        points = 50;
        descarte = "Faça backup de dados e restaure de fábrica. Deposite nos nichos específicos de celulares do EcoPoint Kalilândia ou Centro.";
      } else if (query.includes("pilha") || query.includes("bateria") || query.includes("duracell") || query.includes("rayovac")) {
        detectedName = textFallback || "Combo de Pilhas / Baterias";
        category = "Pilhas / Baterias";
        weight = 0.3;
        recyclable = ["Zinco", "Manganês", "Recipiente de Aço"];
        toxic = ["Cádmio", "Níquel", "Mercúrio", "Lítio inflamável"];
        points = 25;
        descarte = "Guarde em recipiente de plástico rígido e seco. Nunca misture com lixo orgânico. Compatível com os nichos verdes de EcoPoint Kalilândia, Centro ou Feira VII.";
      } else if (query.includes("impressora") || query.includes("scanner") || query.includes("toner") || query.includes("hp") || query.includes("epson")) {
        detectedName = textFallback || "Impressora Multifuncional";
        category = "Impressoras / Scanners";
        weight = 4.8;
        recyclable = ["Plástico ABS resistente", "Motores de passo (Cobre)", "Eixo de aço inox", "Cabos internos"];
        toxic = ["Resíduos de Pó de Carbono (Toner)", "Retardantes de chama químicos"];
        points = 45;
        descarte = "Remova cartuchos de tinta antes de entregar. Pode ser descartado no EcoPoint Avenida Nóide Cerqueira ou Tomba.";
      } else if (query.includes("monitor") || query.includes("tv") || query.includes("tela") || query.includes("televisão")) {
        detectedName = textFallback || "Monitor LCD/LED";
        category = "Monitores / TVs";
        weight = 3.5;
        recyclable = ["Vidro plano livre de aditivos", "Moldura rígida", "Placas de controle"];
        toxic = ["Fósforo residual", "Mercúrio em tubas CCFL (se LCD clássico)", "Cristal líquido bruto"];
        points = 55;
        descarte = "Evite trincar a tela para evitar dispersão de vapores químicos. Entregue no EcoPoint Kalilândia ou Tomba.";
      }

      return res.json({
        scanResult: {
          nome: detectedName,
          categoria: category,
          pesoEstimado: weight,
          componentesReciclaveis: recyclable,
          componentesToxicos: toxic,
          instrucoesDescarte: descarte,
          pontosEstimados: points,
        },
        offline: true,
      });
    }

    const ai = getGeminiClient();
    
    let response;
    if (image && image.includes("base64,")) {
      // Decode base64
      const parts = image.split("base64,");
      const mimeType = parts[0].split(":")[1].split(";")[0];
      const base64Data = parts[1];

      const imagePart = {
        inlineData: {
          mimeType: mimeType,
          data: base64Data,
        }
      };

      const textInstruction = {
        text: "Você é um especialista em resíduos tecnológicos e sustentabilidade urbana no Brasil. " +
              "Analise esta imagem que o usuário tirou e identifique o aparelho eletrônico/bateria/cabo. " +
              "Caso a imagem não contenha um lixo eletrônico, identifique o que for mais próximo ou use sua melhor estimativa técnica para o resíduo presente. " +
              "Retorne os dados em formato JSON em português de acordo com o esquema definido."
      };

      response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: { parts: [imagePart, textInstruction] },
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              nome: { type: Type.STRING, description: "Marca e modelo aproximado do aparelho (ex: Notebook Dell, Carregador genérico, Celular antigo Samsung)" },
              categoria: { type: Type.STRING, description: "Escolha uma destas exatas categorias: 'Computadores / Notebooks', 'Celulares / Tablets', 'Impressoras / Scanners', 'Monitores / TVs', 'Pilhas / Baterias', 'Eletrodomésticos Pequenos', 'Cabos / Carregadores' ou 'Outros'" },
              pesoEstimado: { type: Type.NUMBER, description: "Peso aproximado em quilogramas" },
              componentesReciclaveis: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Lista de materiais úteis que podem ser extraídos (ouro, cobre, alumínio, etc)" },
              componentesToxicos: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Lista de elementos perigosos (chumbo, mercúrio, lítio, cádmio, retardante de chamas)" },
              instrucoesDescarte: { type: Type.STRING, description: "Instruções específicas para o correto descarte ecológico segura deste item" },
              pontosEstimados: { type: Type.INTEGER, description: "Pontuação para gamificação por reciclar este item (entre 15 e 80 com base na complexidade e perigo)" }
            },
            required: ["nome", "categoria", "pesoEstimado", "componentesReciclaveis", "componentesToxicos", "instrucoesDescarte", "pontosEstimados"]
          }
        }
      });
    } else {
      // Text input-based scanning simulation requested by user
      const itemDesc = textFallback || "aparelho eletrônico";
      response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `Analise estatisticamente o seguinte produto eletrônico ou resíduo descrito pelo usuário: "${itemDesc}".
                  Identifique a categoria exata de descarte e estime seu peso e componentes para reciclagem segura.
                  Retorne um objeto JSON em português.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              nome: { type: Type.STRING },
              categoria: { type: Type.STRING },
              pesoEstimado: { type: Type.NUMBER },
              componentesReciclaveis: { type: Type.ARRAY, items: { type: Type.STRING } },
              componentesToxicos: { type: Type.ARRAY, items: { type: Type.STRING } },
              instrucoesDescarte: { type: Type.STRING },
              pontosEstimados: { type: Type.INTEGER }
            },
            required: ["nome", "categoria", "pesoEstimado", "componentesReciclaveis", "componentesToxicos", "instrucoesDescarte", "pontosEstimados"]
          }
        }
      });
    }

    const textResult = response.text || "{}";
    const parsedData = JSON.parse(textResult.trim());
    return res.json({ scanResult: parsedData });

  } catch (error: any) {
    console.error("Scanning API Error:", error);
    res.status(500).json({ error: error.message || "Erro interno na análise de IA." });
  }
});

// 2. EcoRoute (Roteamento inteligente de descarte por IA)
app.post("/api/ecoroute", async (req, res) => {
  try {
    const { descricaoResiduos, ecopointsList } = req.body;

    if (!descricaoResiduos) {
      return res.status(400).json({ error: "Descrição de resíduos é necessária." });
    }

    if (!hasActiveGeminiKey()) {
      console.warn("Using smart fallback offline EcoRoute router because GEMINI_API_KEY is not configured.");
      
      // Smart static Router logic based on keywords
      const query = descricaoResiduos.toLowerCase();
      const identified: string[] = [];
      const recommendedPoints: any[] = [];
      
      if (query.includes("notebook") || query.includes("computador") || query.includes("laptop")) {
        identified.push("1x Notebook/Computador");
      }
      if (query.includes("pilha") || query.includes("bateria")) {
        identified.push("Pilhas/Baterias de Lítio");
      }
      if (query.includes("celular") || query.includes("telefone")) {
        identified.push("1x Celular/Smartphone");
      }
      if (query.includes("impressora")) {
        identified.push("1x Impressora Multifuncional");
      }
      if (identified.length === 0) {
        identified.push("Resíduos eletroeletrônicos mistos");
      }

      // Filter point recommendations based on identified materials
      const points = ecopointsList || [];
      points.slice(0, 2).forEach((pt: any) => {
        recommendedPoints.push({
          ecopointId: pt.id,
          nome: pt.nome,
          endereco: pt.endereco,
          materiais_adequados: pt.materiais_aceitos.slice(0, 2),
          distanciaEstimada: (1.5 + Math.random() * 4).toFixed(1) + " km"
        });
      });

      if (recommendedPoints.length === 0) {
        recommendedPoints.push({
          ecopointId: 1,
          nome: "EcoPoint Centro",
          endereco: "Av. Getúlio Vargas, 1420 - Centro",
          materiais_adequados: ["Eletrônicos em geral"],
          distanciaEstimada: "2.8 km"
        });
      }

      const totalWeight = identified.length * 1.5;
      const co2Saved = (totalWeight * 2.3).toFixed(1);

      return res.json({
        ecoRoute: {
          residuosIdentificados: identified,
          pontosRecomendados: recommendedPoints,
          rotaPassos: [
            "Passo 1: Separe os materiais eletroeletrônicos recomendados. Não desmonte carcaças de pilhas.",
            "Passo 2: Embale os resíduos secos de forma segura em uma pequena caixa.",
            "Passo 3: Dirija-se até o EcoPoint mais perto da sua região recomendada na listagem.",
            "Passo 4: Entregue os itens ao atendente e escaneie o QRCode de coleta para computar pontos verdes no EcoMap!"
          ],
          tempoEstimado: "9 a 15 min de carro, 20 min de transporte coletivo",
          co2EvitadoEstimado: parseFloat(co2Saved)
        },
        offline: true
      });
    }

    const ai = getGeminiClient();
    const prompt = `Você é o assistente inteligente de rotas ambientais "EcoRoute".
Você receberá itens eletrônicos quebrados ou de descarte e uma lista de Ecopoints com materiais aceitos.
Analise a listagem, identifique quais pontos aceitam esses itens de forma otimizada para evitar que o usuário vá a dois lugares diferentes se possível, senão recomende a melhor alternativa.

Descrição do usuário: "${descricaoResiduos}"
Ecopontos disponíveis: ${JSON.stringify(ecopointsList)}

Retorne um JSON contendo sugestões em português, com passos de segurança claros, distância estimada lógica e estimativa científica de CO2 evitado.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            residuosIdentificados: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Lista concisa de aparelhos ou resíduos que você deduziu da frase do usuário." },
            pontosRecomendados: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  ecopointId: { type: Type.INTEGER },
                  nome: { type: Type.STRING },
                  endereco: { type: Type.STRING },
                  materiais_adequados: { type: Type.ARRAY, items: { type: Type.STRING } },
                  distanciaEstimada: { type: Type.STRING, description: "Distância aproximada (ex: '2.5 km')" }
                },
                required: ["ecopointId", "nome", "endereco", "materiais_adequados", "distanciaEstimada"]
              },
              description: "Recomendações dos melhores Ecopoints locais correspondentes retirados da lista."
            },
            rotaPassos: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Passos fáceis em formato de string descrevendo a logística, preparação de segurança e depósito." },
            tempoEstimado: { type: Type.STRING, description: "Tempo de locomoção típico (ex: '15 minutos de carro ou 30 minutos a pé')" },
            co2EvitadoEstimado: { type: Type.NUMBER, description: "Estime a poluição reduzida em kg de CO2 (regra geral: ~2.4kg de CO2 evitado por kg de metal/plástico eletrônico reciclado)" }
          },
          required: ["residuosIdentificados", "pontosRecomendados", "rotaPassos", "tempoEstimado", "co2EvitadoEstimado"]
        }
      }
    });

    const textResult = response.text || "{}";
    const parsedData = JSON.parse(textResult.trim());
    return res.json({ ecoRoute: parsedData });

  } catch (error: any) {
    console.error("EcoRoute API Error:", error);
    res.status(500).json({ error: error.message || "Erro interno na rota do EcoRoute." });
  }
});


// Serve static frontend files in production or hook Vite in development
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[RecySouls] Server is running on http://localhost:${PORT}`);
  });
}

startServer();
