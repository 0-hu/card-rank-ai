import React, { useState, useEffect } from "react";
import { Sparkles, Camera, Zap, CheckCircle, Flame, ShieldAlert, Sparkle } from "lucide-react";
import { motion } from "motion/react";
import { generateMockCardBase64 } from "../utils";

interface IntroScreenProps {
  onStartManual: () => void;
  onSelectSample: (front: string, back: string) => void;
}

export default function IntroScreen({ onStartManual, onSelectSample }: IntroScreenProps) {
  const [charizardSample, setCharizardSample] = useState<{ front: string; back: string } | null>(null);
  const [pikachuSample, setPikachuSample] = useState<{ front: string; back: string } | null>(null);

  useEffect(() => {
    // Generate samples in the background for instant demo capability
    try {
      const czFront = generateMockCardBase64("charizard", "front");
      const czBack = generateMockCardBase64("charizard", "back");
      const pkFront = generateMockCardBase64("pikachu", "front");
      const pkBack = generateMockCardBase64("pikachu", "back");

      setCharizardSample({ front: czFront, back: czBack });
      setPikachuSample({ front: pkFront, back: pkBack });
    } catch (e) {
      console.error("Error pre-generating sample cards:", e);
    }
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 space-y-12">
      {/* Title Hero */}
      <div className="text-center space-y-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 bg-pokemon-yellow/10 text-pokemon-blue border-2 border-pokemon-yellow/40 px-4 py-1.5 rounded-full text-xs font-bold shadow-xs uppercase tracking-wider"
        >
          <Sparkle className="w-4 h-4 animate-spin text-pokemon-yellow" style={{ animationDuration: "6s" }} />
          <span>Universal TCG AI Pre-Grader</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl md:text-7xl font-display font-black tracking-tight"
        >
          <span className="text-pokemon-blue">Card</span>
          <span className="text-pokemon-yellow font-outline-2 drop-shadow-md">-RANK</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-3 text-sm md:text-base text-slate-500 max-w-lg mx-auto leading-relaxed font-sans"
        >
          스마트폰 카메라로 트레이딩 카드(TCG)를 스캔해 보세요! AI 컴퓨터 비전 모델이 실시간으로 <span className="font-extrabold text-pokemon-red">센터링</span>, <span className="font-extrabold text-pokemon-blue">코너</span>, <span className="font-extrabold text-pokemon-yellow">엣지</span>, <span className="font-extrabold text-emerald-600">표면</span>의 미세 흠집과 마모도를 정밀 측정하여 신뢰할 수 있는 예상 PSA 등급을 즉시 산출해 드립니다.
        </motion.p>
      </div>

      {/* Intro Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Step Cards */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white border-2 border-slate-200 hover:border-pokemon-yellow rounded-3xl p-6 shadow-sm flex flex-col justify-between transition duration-300 relative overflow-hidden"
        >
          {/* Subtle decoration bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-pokemon-red" />
          
          <div>
            <h2 className="text-lg font-display font-black text-slate-800 mb-6 flex items-center gap-2">
              <Zap className="w-5 h-5 text-pokemon-yellow animate-pulse" />
              어떻게 그레이딩하나요?
            </h2>
            
            <div className="space-y-5">
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-pokemon-red text-white flex items-center justify-center text-xs font-mono font-black border border-pokemon-yellow shadow-xs">
                  1
                </span>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-800">카드의 앞면 등록</h3>
                  <p className="text-xs text-slate-500 mt-1">밝은 조명 아래에서 카드가 테두리 가이드 격자에 채워지도록 똑바로 세우거나 내려놓고 촬영해 주세요.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-pokemon-blue text-white flex items-center justify-center text-xs font-mono font-black border border-pokemon-yellow shadow-xs">
                  2
                </span>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-800">카드의 뒷면 등록</h3>
                  <p className="text-xs text-slate-500 mt-1">동일한 거리와 카메라 흔들림이 없는 상태에서 뒷면의 파란 테두리가 가이드에 맞게 촬영해 주세요.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-pokemon-yellow text-slate-900 flex items-center justify-center text-xs font-mono font-black border border-pokemon-blue shadow-xs">
                  3
                </span>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-800">Gemini AI 다이내믹 감정</h3>
                  <p className="text-xs text-slate-500 mt-1">수평계 측정값, 모서리 미세 마모, 화이트 치핑, 표면 스크래치 결함을 8대 핵심 항목별로 완벽 감지합니다.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <button
              onClick={onStartManual}
              className="w-full bg-pokemon-blue hover:bg-pokemon-blue/95 text-white hover:text-pokemon-yellow font-display font-black py-3.5 px-5 rounded-2xl transition duration-200 transform hover:scale-[1.01] flex items-center justify-center gap-2 shadow-md active:scale-95 cursor-pointer border-2 border-pokemon-yellow btn-shine"
            >
              <Camera className="w-5 h-5 text-pokemon-yellow" />
              <span>내 TCG 카드 직접 스캔 / 업로드</span>
            </button>
          </div>
        </motion.div>

        {/* Demo Samples */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white border-2 border-slate-200 hover:border-pokemon-blue rounded-3xl p-6 shadow-sm transition duration-300 relative overflow-hidden flex flex-col justify-between"
        >
          {/* Subtle decoration bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-pokemon-blue" />
          
          <div>
            <h2 className="text-lg font-display font-black text-slate-800 mb-2 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-pokemon-yellow animate-pulse" />
              샘플 카드로 즉시 AI 스캔 체험
            </h2>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              지금 당장 분석할 카드가 없으신가요? 고해상도로 엄선된 전설의 아래 카드 세트를 터치하여 Gemini 시각 인공지능 그레이딩을 즉시 시작해 보세요!
            </p>

            <div className="space-y-4">
              {/* Charizard Card */}
              <div
                onClick={() => charizardSample && onSelectSample(charizardSample.front, charizardSample.back)}
                className="group cursor-pointer bg-slate-50 hover:bg-pokemon-red/5 border-2 border-slate-100 hover:border-pokemon-red/30 p-4 rounded-2xl flex items-center gap-4 transition duration-200 transform hover:-translate-y-0.5 shadow-xs"
              >
                <div className="w-14 h-20 bg-slate-200 rounded-lg overflow-hidden flex-shrink-0 border border-slate-300 group-hover:border-pokemon-red/40 transition-colors flex items-center justify-center relative">
                  {charizardSample ? (
                    <img
                      src={charizardSample.front}
                      alt="Charizard Front"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-2 h-2 bg-pokemon-red rounded-full animate-ping" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-1.5 text-sm font-extrabold text-slate-800 group-hover:text-pokemon-red transition-colors">
                    <Flame className="w-4 h-4 text-pokemon-red animate-pulse" />
                    프리미엄 클래식 레드 드래곤 세트 (Red Dragon Sample)
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                    경미한 뒷면 엣지 미세 마모 및 비대칭 센서링이 포함된 현실적인 등급 시뮬레이션 샘플입니다. (예상 등급: PSA 8)
                  </p>
                </div>
              </div>

              {/* Pikachu Card */}
              <div
                onClick={() => pikachuSample && onSelectSample(pikachuSample.front, pikachuSample.back)}
                className="group cursor-pointer bg-slate-50 hover:bg-pokemon-yellow/10 border-2 border-slate-100 hover:border-pokemon-yellow/40 p-4 rounded-2xl flex items-center gap-4 transition duration-200 transform hover:-translate-y-0.5 shadow-xs"
              >
                <div className="w-14 h-20 bg-slate-200 rounded-lg overflow-hidden flex-shrink-0 border border-slate-300 group-hover:border-pokemon-yellow/50 transition-colors flex items-center justify-center relative">
                  {pikachuSample ? (
                    <img
                      src={pikachuSample.front}
                      alt="Pikachu Front"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-2 h-2 bg-pokemon-yellow rounded-full animate-ping" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-1.5 text-sm font-extrabold text-slate-800 group-hover:text-pokemon-blue transition-colors">
                    <span className="text-pokemon-yellow text-sm font-bold">⚡</span>
                    울트라 골드 마스터 세트 (Ultra Gold Sample)
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                    완벽에 가까운 센터링 비율과 흠집 없는 눈부신 카드 표면 광택 상태를 보존하고 있는 최고 등급 샘플 카드입니다. (예상 등급: PSA 10)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Safety Notice */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-pokemon-yellow/5 border-2 border-pokemon-yellow/30 rounded-2xl p-4 flex gap-3 text-xs text-slate-600 leading-relaxed shadow-xs"
      >
        <ShieldAlert className="w-5 h-5 text-pokemon-red flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-extrabold text-slate-800">안내 및 면책사항 (Disclaimer):</span> 본 서비스에서 산출되는 PSA 예상 등급은 전문 감정사의 공식 등급이 아닌 Gemini AI 모델의 시각적 패턴을 분석한 보조 참고용(Pre-grade) 추정치입니다. 실제 그레이딩 기관(PSA, BGS, CGC 등)의 감정 결과와 무관하며, 카드의 공식 거래나 상업 가치 보장 용도로는 절대 사용하지 마십시오.
        </div>
      </motion.div>
    </div>
  );
}
