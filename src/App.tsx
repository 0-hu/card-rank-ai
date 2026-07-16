import React, { useState, useEffect } from "react";
import { Sparkles, RefreshCw, Cpu, Layers, AlertCircle, HelpCircle, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import IntroScreen from "./components/IntroScreen";
import CardScanner from "./components/CardScanner";
import CardGradingResult from "./components/CardGradingResult";
import CardLogo from "./components/CardLogo";
import { AppStep, GradingResult } from "./types";

export default function App() {
  const [step, setStep] = useState<AppStep>("INTRO");
  const [frontImage, setFrontImage] = useState<string>("");
  const [backImage, setBackImage] = useState<string>("");
  const [analyzingMessage, setAnalyzingMessage] = useState<string>("AI 분석 엔진을 가동하는 중...");
  const [gradingResult, setGradingResult] = useState<GradingResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Progressive loading statements during analysis
  useEffect(() => {
    if (step !== "ANALYZING") return;

    const messages = [
      "AI 분석 엔진을 가동하는 중...",
      "앞면 이미지에서 카드 규격 테두리를 추출하고 있습니다...",
      "상하좌우 베젤 비율 측정 중 (시각적 센서링 대조)...",
      "뒷면 이미지 분석 시작: 카드 뒷면 중심축 센터링 검측...",
      "모서리 4개 코너 부근의 미세 화이트닝/치핑 스캔 중...",
      "테두리 엣지의 도색 마모도 및 훼손 여부를 정밀 판정하는 중...",
      "카드 표면의 난반사를 유도하여 미세 스크래치 및 인쇄선 검지 중...",
      "종합 sub-grade 평점을 취합하여 PSA 등급 통합 연산을 실행 중...",
    ];

    let currentMsgIdx = 0;
    const interval = setInterval(() => {
      if (currentMsgIdx < messages.length - 1) {
        currentMsgIdx++;
        setAnalyzingMessage(messages[currentMsgIdx]);
      }
    }, 1500);

    return () => clearInterval(interval);
  }, [step]);

  // Handle analyzing API post
  const handleAnalyze = async () => {
    setStep("ANALYZING");
    setError(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          frontImage,
          backImage,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "카드를 분석하는 도중 서버 에러가 발생했습니다.");
      }

      setGradingResult(data);
      setStep("RESULT");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "서버와 통신하는 도중 오류가 발생했습니다. 네트워크 상태 및 API 키 설정을 확인해주세요.");
      setStep("FRONT_UPLOAD"); // Rollback to front upload on failure so they can try again
    }
  };

  const handleSelectSample = (front: string, back: string) => {
    setFrontImage(front);
    setBackImage(back);
    // Directly launch analyze on sample cards
    setTimeout(() => {
      setStep("ANALYZING");
      // Execute the API post using the pre-populated base64 strings
      fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          frontImage: front,
          backImage: back,
        }),
      })
        .then((res) => {
          if (!res.ok) throw new Error("Sample analysis failed");
          return res.json();
        })
        .then((data) => {
          setGradingResult(data);
          setStep("RESULT");
        })
        .catch((err) => {
          console.error(err);
          setError("샘플 카드 분석에 실패했습니다. API 키 설정이 올바른지 확인해 주세요.");
          setStep("INTRO");
        });
    }, 100);
  };

  const handleReset = () => {
    setFrontImage("");
    setBackImage("");
    setGradingResult(null);
    setError(null);
    setStep("INTRO");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col relative overflow-x-hidden font-sans antialiased selection:bg-blue-500/10 selection:text-blue-900">
      {/* Decorative Glowing Ambients */}
      <div className="absolute top-0 left-1/3 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[140px] pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-0 right-1/3 w-[600px] h-[600px] bg-slate-200/30 rounded-full blur-[140px] pointer-events-none translate-y-1/2" />

      {/* Global Header */}
      <header className="border-b border-slate-200/80 bg-white sticky top-0 z-50 px-4 py-3.5 shadow-xs">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div onClick={handleReset} className="flex items-center gap-2 cursor-pointer group">
            <div className="w-10 h-10 flex items-center justify-center text-blue-600 group-hover:scale-105 transition duration-200">
              <CardLogo className="w-9 h-9" />
            </div>
            <div>
              <span className="text-base font-display font-extrabold tracking-tight text-slate-800 group-hover:text-blue-600 transition">
                Card-RANK
              </span>
              <span className="hidden sm:inline-block text-[10px] font-mono text-blue-600/80 ml-2 tracking-wider italic font-semibold">v0.2</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden md:flex items-center gap-2 text-xs text-slate-600 font-mono bg-slate-100 py-1.5 px-3 rounded-full border border-slate-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Gemini AI Connected</span>
            </span>
          </div>
        </div>
      </header>

      {/* Global Error Banner */}
      {error && (
        <div className="bg-red-50 border-b border-red-200/80 px-4 py-3">
          <div className="max-w-4xl mx-auto flex items-center gap-3 text-sm text-red-700">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-500" />
            <div className="flex-1 font-medium">{error}</div>
            <button
              onClick={() => setError(null)}
              className="text-xs font-semibold underline hover:text-red-800 text-red-600"
            >
              닫기
            </button>
          </div>
        </div>
      )}

      {/* Core Layout Stage */}
      <main className="flex-1 flex flex-col justify-center py-6">
        <AnimatePresence mode="wait">
          {step === "INTRO" && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <IntroScreen
                onStartManual={() => setStep("FRONT_UPLOAD")}
                onSelectSample={handleSelectSample}
              />
            </motion.div>
          )}

          {(step === "FRONT_UPLOAD" || step === "BACK_UPLOAD") && (
            <motion.div
              key="scanner"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <CardScanner
                frontImage={frontImage}
                backImage={backImage}
                setFrontImage={setFrontImage}
                setBackImage={setBackImage}
                onBack={handleReset}
                onAnalyze={handleAnalyze}
              />
            </motion.div>
          )}

          {step === "ANALYZING" && (
            <motion.div
              key="analyzing"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-md mx-auto px-4 py-16 text-center flex flex-col items-center justify-center"
            >
              {/* Spinning Scanner Aura */}
              <div className="relative w-40 h-52 mb-10 flex items-center justify-center border-2 border-slate-200 rounded-2xl overflow-hidden shadow-sm bg-slate-100">
                {/* Simulated laser scan line */}
                <motion.div
                  animate={{
                    top: ["0%", "100%", "0%"],
                  }}
                  transition={{
                    duration: 2.2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent shadow-[0_0_12px_#3b82f6] z-10"
                />

                {/* Simulated Grid overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.08)_1px,transparent_1px)] bg-[size:10px_10px]" />

                <div className="text-center z-20 flex flex-col items-center gap-3">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center border border-blue-100 shadow-xs animate-pulse">
                    <Cpu className="w-5 h-5 animate-spin" style={{ animationDuration: "3s" }} />
                  </div>
                  <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase">SCANNING CARD</span>
                </div>
              </div>

              <h2 className="text-lg font-display font-bold text-slate-800 flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-blue-600 animate-pulse" />
                <span>AI 감정 가동 중</span>
              </h2>

              <p className="text-xs text-slate-500 max-w-sm h-12 flex items-center justify-center px-4 leading-relaxed font-mono">
                {analyzingMessage}
              </p>

              <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden mt-6 max-w-xs">
                <motion.div
                  initial={{ width: "5%" }}
                  animate={{ width: "95%" }}
                  transition={{ duration: 12, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-blue-600 to-blue-400"
                />
              </div>
              <span className="text-[10px] text-slate-400 mt-2 font-mono uppercase tracking-widest">Est. 3-8 seconds</span>
            </motion.div>
          )}

          {step === "RESULT" && gradingResult && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <CardGradingResult
                result={gradingResult}
                frontImage={frontImage}
                backImage={backImage}
                onReset={handleReset}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Global Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 text-center text-[10px] text-slate-500 font-mono">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-2">
          <span>Card-RANK v0.2 Demo | Powered by Gemini 3.5 Flash Model</span>
          <span>© 2026 AI Studio Workspace. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
}
