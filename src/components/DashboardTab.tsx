import React from "react";
import { User, Disposal, Badge } from "../types";
import { BADGES } from "../constants";
import { Award, Shield, Zap, TrendingUp, Sparkles, Activity, Trash2, Leaf } from "lucide-react";

interface DashboardTabProps {
  user: User;
  disposals: Disposal[];
  onNavigate: (tab: string) => void;
}

export default function DashboardTab({ user, disposals, onNavigate }: DashboardTabProps) {
  // Compute analytics
  const totalWeight = disposals.reduce((sum, d) => sum + d.peso, 0);
  const totalCO2Of = disposals.reduce((sum, d) => sum + (d.peso * 2.42), 0); // 2.42 kg of CO2 equivalent saved per kg
  const totalEquipments = disposals.length;

  // Active Badges computed from score
  const earnedBadges = BADGES.filter(b => user.pontuacao >= b.pontos_requisito);
  const nextBadge = BADGES.find(b => user.pontuacao < b.pontos_requisito);

  // Get matching icon for badges
  const getBadgeIcon = (id: string, color: string) => {
    const props = { className: `w-8 h-8` };
    switch (id) {
      case "reciclador_iniciante":
        return <Award {...props} />;
      case "guardiao_ambiental":
        return <Shield {...props} />;
      default:
        return <Zap {...props} />;
    }
  };

  // Static mock weekly chart values using simple SVGs
  const mockWeeklyData = [
    { day: "Seg", kg: 1.2 },
    { day: "Ter", kg: 0.0 },
    { day: "Qua", kg: 3.5 },
    { day: "Qui", kg: 0.8 },
    { day: "Sex", kg: 2.1 },
    { day: "Sáb", kg: 4.5 },
    { day: "Dom", kg: 0.5 },
  ];

  const maxKg = Math.max(...mockWeeklyData.map(d => d.kg)) || 1;

  return (
    <div className="space-y-6" id="dashboard-tab">
      {/* Prime Hero Panel - Styled like a Wood and Gold Gilded Shield Banner */}
      <div className="relative overflow-hidden bg-gradient-to-b from-[#2d1a10] to-[#140a06] border-2 border-[#543420] text-white rounded-3xl p-6 md:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-[#d4a359]/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 bg-[#f47c22]/5 rounded-full blur-2xl pointer-events-none"></div>

        {/* Decorative inner golden border */}
        <div className="absolute inset-2 border border-[#d4a359]/15 pointer-events-none rounded-2xl"></div>

        <div className="relative z-10 space-y-4">
          <div className="flex items-center space-x-2">
            <span className="bg-[#d4a359]/20 border border-[#d4a359]/40 text-[#f7d299] text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded font-mono flex items-center gap-1.5 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#ebd299] animate-pulse" />
              Conclave {user.nivel} • Guardião Latente
            </span>
          </div>

          <h2 className="font-display text-2xl md:text-3xl font-bold tracking-widest uppercase text-white drop-shadow">
            Saudações, {user.nome}! ⚔️
          </h2>
          <p className="text-white/70 text-sm max-w-xl font-sans leading-relaxed">
            Consagrai o lixo eletrônico quebrado aos fogos da purificação. Vossa retidão ecológica mantém o semiárido baiano limpo e vossas moedas de prestígio florescem no templo de RecySouls.
          </p>

          {/* Points Progress */}
          <div className="pt-2">
            <div className="flex justify-between items-end text-xs text-[#f7d299] mb-1.5 font-mono uppercase tracking-wider">
              <span>{user.pontuacao} Prestígio Acumulado</span>
              <span>
                {nextBadge 
                  ? `Requer mais ${nextBadge.pontos_requisito - user.pontuacao} moedas para [${nextBadge.nome}]`
                  : "Nível de Cavaleiro Lendário Atingido! 🎉"}
              </span>
            </div>
            <div className="w-full bg-black/60 rounded h-3 border border-[#3e2617] overflow-hidden">
              <div 
                className="bg-gradient-to-r from-[#d4a359] to-[#f47c22] h-full transition-all duration-500 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]"
                style={{ width: `${Math.min(100, (user.pontuacao / 350) * 100)}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Impact Metrics (Bento Grid) - Styled like medieval parchment roll records */}
      <h3 className="font-display font-semibold text-base text-[#f7d299] uppercase tracking-widest flex items-center gap-2 mb-2">
        <Activity className="w-5 h-5 text-[#d4a359]" />
        Registro do vosso Impacto e Almas Purificadas
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4" id="impact-grid">
        {/* Metric 1 - Parchment scroll */}
        <div className="parchment-scroll rounded-xl p-5 flex items-center space-x-4 border border-[#c2b291]">
          <div className="p-3 bg-[#3e291e]/15 text-[#3b2110] rounded-lg border border-[#3e291e]/10">
            <Trash2 className="w-6 h-6 text-[#4a2e1d]" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-[#5e4e3c] uppercase tracking-wider font-mono">Resíduos Entregues</p>
            <h4 className="font-display text-2xl font-bold text-[#211610] font-mono">
              {totalWeight.toFixed(2)} <span className="text-xs font-sans font-medium text-[#4a3420]">kg</span>
            </h4>
            <p className="text-[10px] text-[#4a7238] mt-0.5 font-bold uppercase tracking-wider font-mono">Purificação Segura</p>
          </div>
        </div>

        {/* Metric 2 - Parchment scroll */}
        <div className="parchment-scroll rounded-xl p-5 flex items-center space-x-4 border border-[#c2b291]">
          <div className="p-3 bg-[#3e291e]/15 text-[#3b2110] rounded-lg border border-[#3e291e]/10">
            <Leaf className="w-6 h-6 text-[#294c1c]" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-[#5e4e3c] uppercase tracking-wider font-mono">Miasma de CO₂ Evitado</p>
            <h4 className="font-display text-2xl font-bold text-[#211610] font-mono">
              {totalCO2Of.toFixed(2)} <span className="text-xs font-sans font-medium text-[#4a3420]">kg</span>
            </h4>
            <p className="text-[10px] text-[#4a7238] mt-0.5 font-bold uppercase tracking-wider font-mono">Ar Puro Preservado</p>
          </div>
        </div>

        {/* Metric 3 - Parchment scroll */}
        <div className="parchment-scroll rounded-xl p-5 flex items-center space-x-4 border border-[#c2b291]">
          <div className="p-3 bg-[#3e291e]/15 text-[#3b2110] rounded-lg border border-[#3e291e]/10">
            <Sparkles className="w-6 h-6 text-[#a16207]" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-[#5e4e3c] uppercase tracking-wider font-mono">Rendimento Total</p>
            <h4 className="font-display text-2xl font-bold text-[#211610] font-mono">
              {user.pontuacao} <span className="text-xs font-sans font-medium text-[#4a3420]">moedas</span>
            </h4>
            <p className="text-[10px] text-[#a16207] mt-0.5 font-bold uppercase tracking-wider font-mono">Título: Latente Grau {user.nivel}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Weekly Descarte Trend Chart - Styled inside a dark timber chest glass wrap */}
        <div className="glass p-5 rounded-2xl lg:col-span-7 space-y-4">
          <div className="flex justify-between items-center border-b border-[#2d1e16] pb-3">
            <div>
              <h4 className="font-display font-semibold text-white uppercase tracking-wider text-sm">Crônicas das oferendas semanais</h4>
              <p className="text-xs text-white/45 font-sans">Massa consumida nos altares por dia (kg)</p>
            </div>
            <span className="text-[10px] bg-black/45 border border-[#2d1e16] text-[#ebd7c3] px-2.5 py-1 rounded font-mono font-bold uppercase tracking-wider">
              Feira de Santana
            </span>
          </div>

          {/* SVG Custom Horizontal Charts - Warm Gold/Amber Bars */}
          <div className="pt-2 space-y-3 font-mono text-xs">
            {mockWeeklyData.map((d, index) => {
              const widthPct = (d.kg / maxKg) * 100;
              return (
                <div key={index} className="flex items-center space-x-3">
                  <span className="w-8 font-semibold text-white/60">{d.day}</span>
                  <div className="flex-1 bg-black/45 h-5 rounded overflow-hidden relative border border-[#2d1e16]/60">
                    <div 
                      className="bg-gradient-to-r from-[#d4a359] to-[#f47c22] h-full rounded-r transition-all duration-500 shadow-[inset_0_1px_rgba(255,255,255,0.1)]"
                      style={{ width: `${widthPct > 0 ? Math.max(8, widthPct) : 0}%` }}
                    ></div>
                    {d.kg > 0 && (
                      <span className="absolute right-2 top-0.5 font-mono text-[9px] font-bold text-white tracking-wide">
                        {d.kg} kg
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-[10px] text-white/30 text-center pt-2 italic font-mono border-t border-[#2d1e16] uppercase tracking-wider">
            * Registros simbólicos do conclave • Amostra de conscientização heráldica.
          </div>
        </div>

        {/* Right Side: Badges & Rewards - Sturdy studded castle panel */}
        <div className="glass p-5 rounded-2xl lg:col-span-5 space-y-4">
          <div className="border-b border-[#2d1e16] pb-3">
            <h4 className="font-display font-semibold text-white uppercase tracking-wider text-sm">Vossas Insígnias de Bravura</h4>
            <p className="text-xs text-white/45 font-sans">Medalhas reais desbloqueadas no templo</p>
          </div>

          <div className="space-y-3">
            {BADGES.map((badge) => {
              const earned = user.pontuacao >= badge.pontos_requisito;
              return (
                <div 
                  key={badge.id} 
                  className={`flex items-start space-x-3.5 p-3 rounded border transition-all ${
                    earned 
                      ? "bg-[#18110c]/80 border-[#362217] text-[#ebd7c3]" 
                      : "bg-black/35 border-[#1f1610]/40 opacity-45"
                  }`}
                >
                  <div className={`p-2.5 rounded shrink-0 ${earned ? "bg-[#d4a359]/20 text-[#ebd299] border border-[#d4a359]/40 shadow-sm" : "bg-[#140f0c] text-white/30 border border-white/5"}`}>
                    {getBadgeIcon(badge.id, badge.cor)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h5 className="text-xs font-semibold uppercase tracking-wider font-mono text-white">{badge.nome}</h5>
                      <span className="text-[10px] uppercase font-bold tracking-widest font-mono">
                        {earned ? (
                          <span className="text-[#d4a359]">CONCEBIDA ✔</span>
                        ) : (
                          <span className="text-white/40">{badge.pontos_requisito} pts</span>
                        )}
                      </span>
                    </div>
                    <p className="text-[11px] text-white/60 mt-1 font-sans leading-normal">{badge.descricao}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Decree style tip (Royal Wine Crimson) */}
          <div className="bg-[#4a1414]/25 border border-[#7f2626]/40 rounded p-3.5 flex items-start space-x-3 z-10 relative">
            <span className="text-rose-400 shrink-0 mt-0.5 text-base">⚜️</span>
            <div className="text-[11px] text-rose-200/90 leading-relaxed font-sans">
              <strong>Decreto Imperial:</strong> Monitores de vidro antigos (CRTs) abandonados nos vales emanam chumbo venenoso. Levai-os imediatamente ao conclave para reter e purificar sua alma metálica!
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Rails - Timber planks look */}
      <div className="bg-[#18110c] border-2 border-[#2d1e16] p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow">
        <div>
          <h5 className="text-xs font-bold text-[#ebd7c3] uppercase tracking-widest font-mono">Desejais colher mais prestígio para vosso clã?</h5>
          <p className="text-xs text-white/45 font-sans mt-0.5">Responda ao julgamento do pergaminho sagrado ou consulte o mapa dos templos.</p>
        </div>
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <button 
            onClick={() => onNavigate("quiz")}
            className="flex-1 sm:flex-none text-center bg-[#291a11] border border-[#40291a] hover:bg-[#3d2719] text-[#ebd7c3] text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded font-mono transition cursor-pointer"
          >
            Iniciar Prova
          </button>
          <button 
            onClick={() => onNavigate("map")}
            className="flex-1 sm:flex-none text-center medieval-wax-seal text-white text-xs font-bold px-5 py-2.5 rounded transition uppercase tracking-widest cursor-pointer"
          >
            Ver Mapa
          </button>
        </div>
      </div>
    </div>
  );
}
