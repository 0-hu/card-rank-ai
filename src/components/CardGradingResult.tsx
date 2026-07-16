import React, { useState, useEffect } from "react";
import { 
  Award, 
  Sparkles, 
  RefreshCw, 
  Sliders, 
  ShieldAlert, 
  Layers, 
  Info, 
  Check, 
  X,
  ChevronDown, 
  ChevronUp, 
  CreditCard as CardIcon, 
  Sparkle,
  AlertTriangle,
  Flame,
  CheckCircle2,
  Scan,
  Eye
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { GradingResult } from "../types";

interface CardGradingResultProps {
  result: GradingResult;
  frontImage: string;
  backImage: string;
  onReset: () => void;
}

export default function CardGradingResult({ result, frontImage, backImage, onReset }: CardGradingResultProps) {
  const [showSimulator, setShowSimulator] = useState(false);
  const [slabSide, setSlabSide] = useState<"front" | "back">("front");

  // Holographic card shine effect on mouse move
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCoords({ x, y });
  };

  // Live Grade Simulator State (for collapsible sandbox at the bottom)
  const [simCenteringFront, setSimCenteringFront] = useState(result.front.centering.sub_grade);
  const [simCornersFront, setSimCornersFront] = useState(result.front.corners.sub_grade);
  const [simEdgesFront, setSimEdgesFront] = useState(result.front.edges.sub_grade);
  const [simSurfaceFront, setSimSurfaceFront] = useState(result.front.surface.sub_grade);

  const [simCenteringBack, setSimCenteringBack] = useState(result.back.centering.sub_grade);
  const [simCornersBack, setSimCornersBack] = useState(result.back.corners.sub_grade);
  const [simEdgesBack, setSimEdgesBack] = useState(result.back.edges.sub_grade);
  const [simSurfaceBack, setSimSurfaceBack] = useState(result.back.surface.sub_grade);

  // Live Calculated Grade
  const [liveGrade, setLiveGrade] = useState(result.estimated_psa);
  const [liveExplanation, setLiveExplanation] = useState("");

  useEffect(() => {
    const grades = [
      simCenteringFront,
      simCornersFront,
      simEdgesFront,
      simSurfaceFront,
      simCenteringBack,
      simCornersBack,
      simEdgesBack,
      simSurfaceBack,
    ];

    const minGrade = Math.min(...grades);
    const otherGrades = [...grades];
    const minIndex = otherGrades.indexOf(minGrade);
    if (minIndex !== -1) {
      otherGrades.splice(minIndex, 1);
    }

    const otherAvg = otherGrades.reduce((a, b) => a + b, 0) / otherGrades.length;
    let finalCalculated = minGrade;
    let bonusApplied = false;

    if (otherAvg - minGrade >= 2) {
      finalCalculated += 0.5;
      bonusApplied = true;
    }

    // Clamp
    finalCalculated = Math.min(10, Math.max(1, finalCalculated));
    setLiveGrade(finalCalculated);

    const componentNames = [
      "앞면 센터링", "앞면 코너", "앞면 엣지", "앞면 표면",
      "뒷면 센터링", "뒷면 코너", "뒷면 엣지", "뒷면 표면"
    ];
    const originalIndexes = [
      simCenteringFront, simCornersFront, simEdgesFront, simSurfaceFront,
      simCenteringBack, simCornersBack, simEdgesBack, simSurfaceBack
    ];
    const minCompIndex = originalIndexes.indexOf(minGrade);
    const minCompName = componentNames[minCompIndex];

    if (bonusApplied) {
      setLiveExplanation(
        `최저점 항목인 '${minCompName}'(${minGrade}점)을 기초로 삼으며, 다른 항목들의 평균 점수(${otherAvg.toFixed(1)}점)가 최저점보다 2점 이상 우수하여 +0.5점 보너스 혜택이 적용되었습니다.`
      );
    } else {
      setLiveExplanation(
        `최저점 항목인 '${minCompName}'(${minGrade}점)을 기준으로 최종 등급이 책정되었습니다. 보너스 혜택(+0.5)을 얻으려면 다른 항목들의 평균 점수가 최저점보다 2점 이상 더 높아야 합니다. (현재 격차: ${(otherAvg - minGrade).toFixed(1)}점)`
      );
    }
  }, [
    simCenteringFront,
    simCornersFront,
    simEdgesFront,
    simSurfaceFront,
    simCenteringBack,
    simCornersBack,
    simEdgesBack,
    simSurfaceBack,
  ]);

  // Helper to map score to ◎, ○, △, ✕ marks
  const getPsaMark = (category: "centering" | "surface" | "corners" | "edges", score: number) => {
    if (category === "centering") {
      if (score >= 10) return { mark: "◎", text: "50/50 ~ 55/45 수준, 거의 완벽", color: "text-pokemon-blue", bgColor: "bg-blue-50 border-blue-200" };
      if (score === 9) return { mark: "○", text: "약간 치우침 (PSA 9 수준)", color: "text-emerald-600", bgColor: "bg-emerald-50 border-emerald-200" };
      if (score === 8) return { mark: "△", text: "눈에 띄는 치우침", color: "text-amber-600", bgColor: "bg-amber-50 border-amber-200" };
      return { mark: "✕", text: "심한 센터링 불량", color: "text-pokemon-red", bgColor: "bg-red-50 border-red-200" };
    }
    if (category === "surface") {
      if (score >= 10) return { mark: "◎", text: "결함 없음 또는 제조 수준 미세 흔적", color: "text-pokemon-blue", bgColor: "bg-blue-50 border-blue-200" };
      if (score === 9) return { mark: "○", text: "매우 미세한 스크래치 1~2개", color: "text-emerald-600", bgColor: "bg-emerald-50 border-emerald-200" };
      if (score === 8) return { mark: "△", text: "육안으로 보이는 스크래치 또는 프린트 라인", color: "text-amber-600", bgColor: "bg-amber-50 border-amber-200" };
      return { mark: "✕", text: "압흔, 깊은 스크래치, 심한 손상", color: "text-pokemon-red", bgColor: "bg-red-50 border-red-200" };
    }
    if (category === "corners") {
      if (score >= 10) return { mark: "◎", text: "네 모서리 모두 깨끗함", color: "text-pokemon-blue", bgColor: "bg-blue-50 border-blue-200" };
      if (score === 9) return { mark: "○", text: "미세한 Whitening 1곳", color: "text-emerald-600", bgColor: "bg-emerald-50 border-emerald-200" };
      if (score === 8) return { mark: "△", text: "Whitening 또는 찍힘 여러 곳", color: "text-amber-600", bgColor: "bg-amber-50 border-amber-200" };
      return { mark: "✕", text: "심한 마모 또는 눌림", color: "text-pokemon-red", bgColor: "bg-red-50 border-red-200" };
    }
    if (score >= 10) return { mark: "◎", text: "깨끗한 엣지", color: "text-pokemon-blue", bgColor: "bg-blue-50 border-blue-200" };
    if (score === 9) return { mark: "○", text: "미세 Whitening", color: "text-emerald-600", bgColor: "bg-emerald-50 border-emerald-200" };
    if (score === 8) return { mark: "△", text: "Whitening 다수 또는 까짐", color: "text-amber-600", bgColor: "bg-amber-50 border-amber-200" };
    return { mark: "✕", text: "심한 손상 또는 층 분리", color: "text-pokemon-red", bgColor: "bg-red-50 border-red-200" };
  };

  const criticalDefects = [
    { name: "압흔 (Dent)", desc: "뒷면이나 전면에 힘이 가해져 움푹 들어간 상태", isDetected: result.front.surface.sub_grade <= 7 || result.back.surface.sub_grade <= 7 },
    { name: "주름/접힘 (Crease)", desc: "카드 표면에 발생한 영구적인 꺾임 현상", isDetected: result.front.surface.sub_grade <= 5 || result.back.surface.sub_grade <= 5 },
    { name: "오염/수분 (Liquid)", desc: "음료수, 물 등의 침투 흔적 및 이물질 부착", isDetected: result.front.surface.sub_grade <= 6 || result.back.surface.sub_grade <= 6 },
    { name: "가장자리 찢김 (Tear)", desc: "엣지 부위의 물리적인 뜯겨나감/찢어짐", isDetected: result.front.edges.sub_grade <= 5 || result.back.edges.sub_grade <= 5 },
    { name: "모서리 둥글어짐 (Rounded)", desc: "모서리 반경이 완전히 닳아 둥글어진 마모", isDetected: result.front.corners.sub_grade <= 6 || result.back.corners.sub_grade <= 6 },
    { name: "잉크/프린트 에러 (Defect)", desc: "인쇄 도중 발생한 심한 잉크 얼룩/번짐", isDetected: result.front.surface.sub_grade <= 7 },
  ];

  const detectedCount = criticalDefects.filter((d) => d.isDetected).length;

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 space-y-6">
      
      {/* 1. Header with Title & Reset Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white border-2 border-slate-100 rounded-3xl p-5 shadow-xs">
        <div className="space-y-1 text-left">
          <div className="flex items-center gap-1 bg-pokemon-blue/10 text-pokemon-blue border border-pokemon-blue/20 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider w-fit">
            <Award className="w-3.5 h-3.5" />
            <span>Pre-Grade Evaluation Completed</span>
          </div>
          <h2 className="text-xl md:text-2xl font-display font-black tracking-tight text-slate-800">
            TCG 카드 분석 성적표
          </h2>
        </div>

        <button
          onClick={onReset}
          className="w-full sm:w-auto bg-pokemon-blue hover:bg-pokemon-blue/90 text-white hover:text-pokemon-yellow py-2.5 px-6 rounded-xl border-2 border-pokemon-yellow shadow-md transition-all flex items-center justify-center gap-2 text-xs font-black cursor-pointer active:scale-95 duration-200 font-sans btn-shine"
        >
          <RefreshCw className="w-4 h-4 text-pokemon-yellow" />
          <span>새 카드 분석하기 (Reset)</span>
        </button>
      </div>

      {/* 2. ESTIMATED PSA GRADE & COMPACT OVERALL BANNER (즉시 가장 먼저 보이는 상단 결과) */}
      <div className="bg-gradient-to-r from-pokemon-blue via-slate-900 to-pokemon-blue border-y-4 border-pokemon-yellow rounded-3xl p-6 text-white shadow-md flex flex-col sm:flex-row items-center justify-between gap-5 relative overflow-hidden">
        <div className="space-y-1.5 text-center sm:text-left z-10">
          <span className="text-[9px] font-mono text-pokemon-yellow uppercase tracking-widest font-black flex items-center justify-center sm:justify-start gap-1">
            <Sparkle className="w-3.5 h-3.5 text-pokemon-yellow animate-spin" />
            UNIVERSAL TCG PSA INTEGRITY STANDARD
          </span>
          <h3 className="text-2xl font-display font-black tracking-tight text-white">
            인공지능 등급 측정 결과
          </h3>
          <p className="text-xs text-slate-300 max-w-lg leading-relaxed font-sans">
            8대 서브 점수 대조 결과 최저 감정 점수인 {Math.min(
              result.front.centering.sub_grade, result.front.surface.sub_grade, result.front.corners.sub_grade, result.front.edges.sub_grade,
              result.back.centering.sub_grade, result.back.surface.sub_grade, result.back.corners.sub_grade, result.back.edges.sub_grade
            )}점을 기본 산정기준으로 적용하였습니다.
          </p>
        </div>

        <div className="flex flex-col items-center bg-white/10 backdrop-blur-md rounded-2xl py-3 px-6 border border-white/20 min-w-[160px] text-center z-10 shadow-lg">
          <span className="text-[9px] font-mono text-pokemon-yellow font-extrabold uppercase tracking-widest">PSA GRADE</span>
          <span className="text-4xl font-black text-pokemon-yellow tracking-tighter drop-shadow-md my-0.5 font-display">
            PSA {result.estimated_psa}
          </span>
          <div className="px-2.5 py-0.5 bg-pokemon-red text-white rounded-full text-[10px] font-black border border-pokemon-yellow/40 shadow-xs">
            범위: PSA {result.estimated_range}
          </div>
        </div>
      </div>

      {/* 3. CORE 4 DETAILED CRITERIA REPORT (유저 요청: 상세 평가 항목에 대한 걸 좀 더 위쪽에서 기술하여 한눈에 확인) */}
      <div className="space-y-4">
        <h4 className="text-xs font-mono font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
          <Scan className="w-3.5 h-3.5 text-pokemon-red" />
          <span>PSA 4대 핵심 검수 리포트 상세 (At-A-Glance Breakdown)</span>
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* 1. CENTERING (센터링) */}
          {(() => {
            const fCent = result.front.centering.sub_grade;
            const bCent = result.back.centering.sub_grade;
            const avgCent = Math.round((fCent + bCent) / 2);
            const markObj = getPsaMark("centering", avgCent);
            return (
              <div className="bg-white border-2 border-slate-100 hover:border-pokemon-yellow rounded-2xl p-4 shadow-xs transition flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-black text-slate-800 flex items-center gap-1.5 font-display">
                      <CardIcon className="w-3.5 h-3.5 text-pokemon-blue" />
                      1. 센터링 (Centering)
                    </span>
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-display font-black text-sm border ${markObj.bgColor} ${markObj.color}`}>
                      {markObj.mark}
                    </div>
                  </div>
                  
                  <div className="bg-slate-50 rounded-xl p-2.5 text-[10px] space-y-1 mb-3 text-slate-600">
                    <div className="font-bold text-slate-700 mb-1">인공지능 대조 측정 결과:</div>
                    <div className="flex items-center gap-1">
                      <span className={avgCent >= 10 ? "text-pokemon-blue font-extrabold" : "text-slate-300"}>{avgCent >= 10 ? "●" : "○"}</span>
                      <span className={avgCent >= 10 ? "font-bold text-slate-800" : ""}>◎ 앞면 50/50 ~ 55/45 수준 (거의 완벽)</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className={avgCent === 9 ? "text-emerald-500 font-extrabold" : "text-slate-300"}>{avgCent === 9 ? "●" : "○"}</span>
                      <span className={avgCent === 9 ? "font-bold text-slate-800" : ""}>○ 약간 치우침 (PSA 9 수준)</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className={avgCent === 8 ? "text-amber-500 font-extrabold" : "text-slate-300"}>{avgCent === 8 ? "●" : "○"}</span>
                      <span className={avgCent === 8 ? "font-bold text-slate-800" : ""}>△ 눈에 띄는 치우침</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className={avgCent <= 7 ? "text-pokemon-red font-extrabold" : "text-slate-300"}>{avgCent <= 7 ? "●" : "○"}</span>
                      <span className={avgCent <= 7 ? "font-bold text-slate-800" : ""}>✕ 심한 센터링 불량</span>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="text-[10px] bg-slate-50 p-2 rounded-xl text-slate-500 leading-relaxed font-sans border border-slate-100">
                    <span className="font-black text-slate-700">AI 소견:</span> 앞면 비율({result.front.centering.ratio || "측정중"}), 뒷면 비율({result.back.centering.ratio || "측정중"}). {result.front.centering.assessment}
                  </div>
                </div>
              </div>
            );
          })()}

          {/* 2. SURFACE (표면) */}
          {(() => {
            const fSurf = result.front.surface.sub_grade;
            const bSurf = result.back.surface.sub_grade;
            const avgSurf = Math.round((fSurf + bSurf) / 2);
            const markObj = getPsaMark("surface", avgSurf);
            return (
              <div className="bg-white border-2 border-slate-100 hover:border-pokemon-yellow rounded-2xl p-4 shadow-xs transition flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-black text-slate-800 flex items-center gap-1.5 font-display">
                      <CardIcon className="w-3.5 h-3.5 text-pokemon-blue" />
                      2. 표면 (Surface)
                    </span>
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-display font-black text-sm border ${markObj.bgColor} ${markObj.color}`}>
                      {markObj.mark}
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-2.5 text-[10px] mb-3 text-slate-600">
                    <div className="font-bold text-slate-700 mb-1">정밀 검수 통과 항목:</div>
                    <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[9px] font-mono">
                      <span className="flex items-center gap-0.5 text-emerald-600 font-bold">✓ 스크래치 {avgSurf >= 9 ? "안전" : "의심"}</span>
                      <span className="flex items-center gap-0.5 text-emerald-600 font-bold">✓ 프린트라인 {avgSurf >= 9 ? "안전" : "의심"}</span>
                      <span className="flex items-center gap-0.5 text-emerald-600 font-bold">✓ 홀로손상 {avgSurf >= 10 ? "안전" : "의심"}</span>
                      <span className="flex items-center gap-0.5 text-emerald-600 font-bold">✓ 오염/잉크점 {avgSurf >= 9 ? "무결" : "의심"}</span>
                      <span className="flex items-center gap-0.5 text-emerald-600 font-bold">✓ 압흔(Dent) {avgSurf >= 9 ? "안전" : "경고"}</span>
                      <span className="flex items-center gap-0.5 text-emerald-600 font-bold">✓ 광택/휨 {avgSurf >= 9 ? "우수" : "체크"}</span>
                    </div>
                    <div className="mt-1.5 pt-1.5 border-t border-slate-200 text-slate-500 font-semibold">
                      판정: {markObj.text}
                    </div>
                  </div>
                </div>
                <div>
                  <div className="text-[10px] bg-slate-50 p-2 rounded-xl text-slate-500 leading-relaxed font-sans border border-slate-100">
                    <span className="font-black text-slate-700">AI 소견:</span> {result.front.surface.assessment}
                  </div>
                </div>
              </div>
            );
          })()}

          {/* 3. CORNERS (모서리) */}
          {(() => {
            const fCorners = result.front.corners.sub_grade;
            const bCorners = result.back.corners.sub_grade;
            const avgCorners = Math.round((fCorners + bCorners) / 2);
            const markObj = getPsaMark("corners", avgCorners);
            return (
              <div className="bg-white border-2 border-slate-100 hover:border-pokemon-yellow rounded-2xl p-4 shadow-xs transition flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-black text-slate-800 flex items-center gap-1.5 font-display">
                      <CardIcon className="w-3.5 h-3.5 text-pokemon-blue" />
                      3. 모서리 (Corners)
                    </span>
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-display font-black text-sm border ${markObj.bgColor} ${markObj.color}`}>
                      {markObj.mark}
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-2.5 text-[10px] mb-3 text-slate-600">
                    <div className="font-bold text-slate-700 mb-1">네 모서리 정밀 진단:</div>
                    <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[9px] font-mono">
                      <span className="flex items-center gap-0.5 text-emerald-600 font-bold">✓ Whitening {avgCorners >= 10 ? "안전" : avgCorners === 9 ? "미세1곳" : "다수"}</span>
                      <span className="flex items-center gap-0.5 text-emerald-600 font-bold">✓ 모서리찍힘 {avgCorners >= 9 ? "무결" : "발견"}</span>
                      <span className="flex items-center gap-0.5 text-emerald-600 font-bold">✓ 모서리눌림 {avgCorners >= 9 ? "무결" : "주의"}</span>
                      <span className="flex items-center gap-0.5 text-emerald-600 font-bold">✓ 둥글어짐 {avgCorners >= 9 ? "깨끗" : "마모"}</span>
                    </div>
                    <div className="mt-1.5 pt-1.5 border-t border-slate-200 text-slate-500 font-semibold">
                      판정: {markObj.text}
                    </div>
                  </div>
                </div>
                <div>
                  <div className="text-[10px] bg-slate-50 p-2 rounded-xl text-slate-500 leading-relaxed font-sans border border-slate-100">
                    <span className="font-black text-slate-700">AI 소견:</span> {result.front.corners.assessment}
                  </div>
                </div>
              </div>
            );
          })()}

          {/* 4. EDGES (엣지) */}
          {(() => {
            const fEdges = result.front.edges.sub_grade;
            const bEdges = result.back.edges.sub_grade;
            const avgEdges = Math.round((fEdges + bEdges) / 2);
            const markObj = getPsaMark("edges", avgEdges);
            return (
              <div className="bg-white border-2 border-slate-100 hover:border-pokemon-yellow rounded-2xl p-4 shadow-xs transition flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-black text-slate-800 flex items-center gap-1.5 font-display">
                      <CardIcon className="w-3.5 h-3.5 text-pokemon-blue" />
                      4. 테두리 (Edges)
                    </span>
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-display font-black text-sm border ${markObj.bgColor} ${markObj.color}`}>
                      {markObj.mark}
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-2.5 text-[10px] mb-3 text-slate-600">
                    <div className="font-bold text-slate-700 mb-1">사면 테두리 정밀 스캔:</div>
                    <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[9px] font-mono">
                      <span className="flex items-center gap-0.5 text-emerald-600 font-bold">✓ 테두리까짐 {avgEdges >= 9 ? "안전" : "의심"}</span>
                      <span className="flex items-center gap-0.5 text-emerald-600 font-bold">✓ 미세까짐 {avgEdges >= 10 ? "안전" : "미세"}</span>
                      <span className="flex items-center gap-0.5 text-emerald-600 font-bold">✓ 층 분리 {avgEdges >= 8 ? "안전" : "경고"}</span>
                      <span className="flex items-center gap-0.5 text-emerald-600 font-bold">✓ 컷팅 불량 {avgEdges >= 9 ? "안전" : "주의"}</span>
                    </div>
                    <div className="mt-1.5 pt-1.5 border-t border-slate-200 text-slate-500 font-semibold">
                      판정: {markObj.text}
                    </div>
                  </div>
                </div>
                <div>
                  <div className="text-[10px] bg-slate-50 p-2 rounded-xl text-slate-500 leading-relaxed font-sans border border-slate-100">
                    <span className="font-black text-slate-700">AI 소견:</span> {result.front.edges.assessment}
                  </div>
                </div>
              </div>
            );
          })()}

        </div>
      </div>

      {/* 4. VISUAL COMPARE BLOCK: SUBMITTED RAW IMAGE vs 3D HOLOGRAPHIC GRADING SLAB (Centered & size restricted to 1/3) */}
      <div className="bg-white border-2 border-slate-200/80 rounded-3xl p-5 shadow-xs flex flex-col items-center">
        
        {/* Toggle Controls directly above the images */}
        <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 mb-5 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-1.5 text-slate-700">
            <Eye className="w-4 h-4 text-pokemon-blue" />
            <h4 className="text-xs font-mono font-black uppercase tracking-wider">
              실물 원본 이미지 vs AI 3D 홀로그램 슬랩 비교
            </h4>
          </div>

          <div className="flex bg-slate-100 p-1.5 rounded-xl border border-slate-200">
            <button
              onClick={() => setSlabSide("front")}
              className={`px-3.5 py-1.5 text-xs font-black rounded-lg transition cursor-pointer flex items-center gap-1 ${slabSide === "front" ? "bg-pokemon-red text-white shadow-xs" : "text-slate-500 hover:text-slate-800"}`}
            >
              <span>앞면 비교 (Front)</span>
            </button>
            <button
              onClick={() => setSlabSide("back")}
              className={`px-3.5 py-1.5 text-xs font-black rounded-lg transition cursor-pointer flex items-center gap-1 ${slabSide === "back" ? "bg-pokemon-blue text-white shadow-xs" : "text-slate-500 hover:text-slate-800"}`}
            >
              <span>뒷면 비교 (Back)</span>
            </button>
          </div>
        </div>

        {/* The Compact Side-by-side Layout (Centered) */}
        <div className="flex flex-col md:flex-row justify-center items-stretch gap-8 w-full max-w-2xl px-2">
          
          {/* A. Submited Raw Photo Card */}
          <div className="flex-1 bg-slate-50/70 border border-slate-200 rounded-[1.8rem] p-4 flex flex-col items-center justify-between shadow-xs">
            <div className="w-full text-center text-[10px] font-mono font-bold text-slate-400 tracking-wider mb-3">
              ★ SUBMITTED IMAGE (제출 이미지) ★
            </div>

            <div className="w-52 h-[260px] rounded-xl overflow-hidden border border-slate-200 bg-white flex items-center justify-center p-2 shadow-inner">
              <AnimatePresence mode="wait">
                <motion.img
                  key={slabSide}
                  src={slabSide === "front" ? frontImage : backImage}
                  alt={`${slabSide} card view`}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-full object-contain rounded-lg"
                  referrerPolicy="no-referrer"
                />
              </AnimatePresence>
            </div>

            <div className="w-full text-center text-[9px] font-mono font-semibold text-slate-500 mt-3 pt-2.5 border-t border-slate-200/50">
              {slabSide === "front" ? "앞면 원본 (Raw Photo)" : "뒷면 원본 (Raw Photo)"}
            </div>
          </div>

          {/* B. Compact 3D Holographic Slab Card (1/3 or 1/2 of earlier size, max width 240px) */}
          <div className="flex-1 bg-slate-50/70 border border-slate-200 rounded-[1.8rem] p-4 flex flex-col items-center justify-between shadow-xs">
            <div className="w-full text-center text-[10px] font-mono font-bold text-slate-400 tracking-wider mb-3">
              ★ AI GRADED 3D SLAB (감정 슬랩) ★
            </div>

            {/* Interactive 3D Holographic Graded Acrylic Slab */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="relative w-52 h-[260px] rounded-[1.8rem] bg-slate-100 p-2 border-4 border-slate-200 shadow-xl overflow-hidden cursor-pointer select-none text-slate-800 flex flex-col gap-1.5"
              style={{
                perspective: "1000px",
                boxShadow: "0 15px 35px -10px rgba(0,0,0,0.15), inset 0 0 1px 1.5px rgba(255,255,255,0.8)"
              }}
            >
              {/* Holographic shiny light overlay layer */}
              {isHovered && (
                <div
                  className="absolute inset-0 pointer-events-none z-30 opacity-45 transition-opacity duration-200"
                  style={{
                    background: `radial-gradient(circle 180px at ${coords.x}px ${coords.y}px, rgba(255, 203, 5, 0.35) 0%, rgba(59, 76, 202, 0.25) 45%, rgba(255, 28, 28, 0.15) 80%, transparent 100%)`,
                  }}
                />
              )}

              {/* Glowing card border lights */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-slate-200/30 pointer-events-none z-20" />

              {/* Slab Grade Paper Certificate Label */}
              <div className="w-full bg-white border border-pokemon-red rounded-lg p-1.5 flex justify-between items-center z-10 shadow-2xs font-sans">
                <div className="flex flex-col text-left leading-none">
                  <span className="text-[7px] font-black tracking-tight text-pokemon-blue font-mono flex items-center gap-0.5">
                    <Sparkle className="w-2 h-2 text-pokemon-yellow fill-pokemon-yellow animate-spin" style={{ animationDuration: "6s" }} />
                    Card-RANK AI
                  </span>
                  <span className="text-[5px] font-mono text-slate-400 font-extrabold tracking-wider mt-0.5">PSA Pre-grader</span>
                </div>
                <div className="flex items-center gap-1 pl-1 border-l border-slate-100">
                  <div className="flex flex-col text-right leading-none">
                    <span className="text-[10px] font-black text-pokemon-red font-display">PSA</span>
                    <span className="text-[4px] font-mono text-slate-400 font-extrabold">EST</span>
                  </div>
                  <div className="w-5 h-5 rounded-full border border-pokemon-red flex items-center justify-center bg-pokemon-red/5">
                    <span className="text-xs font-black text-pokemon-red tracking-tighter">{result.estimated_psa}</span>
                  </div>
                </div>
              </div>

              {/* Inner display of the card inside the physical slab */}
              <div className="relative flex-1 rounded-lg overflow-hidden border border-slate-300 shadow-inner bg-slate-950 flex items-center justify-center group">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={slabSide}
                    src={slabSide === "front" ? frontImage : backImage}
                    alt="Card inside Slab"
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ duration: 0.3 }}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
                    referrerPolicy="no-referrer"
                  />
                </AnimatePresence>

                {/* Overlay Holographic Stamp */}
                <div className="absolute bottom-1.5 right-1.5 bg-white/95 border border-pokemon-yellow px-1 py-0.5 rounded text-[5px] font-mono text-pokemon-blue font-extrabold shadow-2xs flex items-center gap-0.5 z-10">
                  <Sparkles className="w-2 h-2 text-pokemon-yellow fill-pokemon-yellow" />
                  <span>GRADED COPY</span>
                </div>
              </div>

              <div className="w-full text-center text-[6px] font-mono font-black text-slate-400 tracking-wider uppercase">
                ★ GRADED ACRYLIC CASE ★
              </div>
            </motion.div>

            <div className="w-full text-center text-[9px] font-mono font-semibold text-slate-500 mt-3 pt-2.5 border-t border-slate-200/50">
              {slabSide === "front" ? "앞면 3D 슬랩 (Holo Slab)" : "뒷면 3D 슬랩 (Holo Slab)"}
            </div>
          </div>

        </div>

        <p className="text-[10px] text-slate-400 leading-relaxed text-center flex items-center justify-center gap-1 bg-slate-50 py-1.5 px-3 rounded-xl border border-slate-200 mt-5 w-full">
          <Info className="w-3.5 h-3.5 text-pokemon-blue flex-shrink-0" />
          <span>오른쪽 슬랩 영역에 마우스를 대면 3D 자이로스코프 광택과 은은한 은박 홀로그램 효과가 활성화됩니다.</span>
        </p>
      </div>

      {/* 5. PSA GENERAL GRADING TABLE (종합 등급 판정 기준표) */}
      <div className="bg-white border-2 border-slate-200/80 rounded-3xl p-5 shadow-xs">
        <h4 className="text-xs font-mono font-black text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-pokemon-blue" />
          <span>PSA 종합 등급 판정 기준표</span>
        </h4>
        <div className="overflow-hidden border border-slate-200 rounded-xl text-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-[10px] font-mono text-slate-500 font-extrabold border-b border-slate-200">
                <th className="p-2 w-1/4">예상 등급 (PSA)</th>
                <th className="p-2 w-2/3">세부 충족 기준</th>
                <th className="p-2 text-center">나의 판정</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              <tr className={`transition-colors ${result.estimated_psa >= 10 ? "bg-pokemon-yellow/15 border-l-4 border-l-pokemon-yellow font-extrabold" : "text-slate-600"}`}>
                <td className="p-2.5 font-display font-black text-pokemon-blue">PSA 10</td>
                <td className="p-2.5">모든 서브 항목이 대부분 ◎ (거의 완벽), 치명적 결함 없음</td>
                <td className="p-2.5 text-center">
                  {result.estimated_psa >= 10 && <span className="bg-pokemon-yellow text-pokemon-blue text-[9px] font-black px-2 py-0.5 rounded-full border border-pokemon-blue/20">CURRENT</span>}
                </td>
              </tr>
              <tr className={`transition-colors ${result.estimated_psa === 9 ? "bg-pokemon-yellow/15 border-l-4 border-l-pokemon-yellow font-extrabold" : "text-slate-600"}`}>
                <td className="p-2.5 font-display font-black text-pokemon-blue">PSA 9</td>
                <td className="p-2.5">○ (약간의 미세 결함)가 1~2개 허용되는 수준</td>
                <td className="p-2.5 text-center">
                  {result.estimated_psa === 9 && <span className="bg-pokemon-yellow text-pokemon-blue text-[9px] font-black px-2 py-0.5 rounded-full border border-pokemon-blue/20">CURRENT</span>}
                </td>
              </tr>
              <tr className={`transition-colors ${result.estimated_psa === 8 ? "bg-pokemon-yellow/15 border-l-4 border-l-pokemon-yellow font-extrabold" : "text-slate-600"}`}>
                <td className="p-2.5 font-display font-black text-pokemon-blue">PSA 8</td>
                <td className="p-2.5">△ (눈에 띄는 미세 화이트닝 또는 센터링 오차)가 일부 존재</td>
                <td className="p-2.5 text-center">
                  {result.estimated_psa === 8 && <span className="bg-pokemon-yellow text-pokemon-blue text-[9px] font-black px-2 py-0.5 rounded-full border border-pokemon-blue/20">CURRENT</span>}
                </td>
              </tr>
              <tr className={`transition-colors ${result.estimated_psa <= 7 ? "bg-pokemon-yellow/15 border-l-4 border-l-pokemon-yellow font-extrabold" : "text-slate-600"}`}>
                <td className="p-2.5 font-display font-black text-pokemon-blue">PSA 7 이하</td>
                <td className="p-2.5">✕ (심한 마모/손상) 또는 복수의 △(눈에 띄는 흠집) 존재</td>
                <td className="p-2.5 text-center">
                  {result.estimated_psa <= 7 && <span className="bg-pokemon-yellow text-pokemon-blue text-[9px] font-black px-2 py-0.5 rounded-full border border-pokemon-blue/20">CURRENT</span>}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 6. 치명적 결함 (CRITICAL DEFECTS) STATUS BOX */}
      <div className="bg-white border-2 border-slate-200/80 rounded-3xl p-5 shadow-xs">
        <div className="flex justify-between items-center mb-3">
          <h4 className="text-xs font-mono font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-pokemon-red" />
            <span>치명적 감점 결함 (Critical Defects) 정밀 검사</span>
          </h4>
          <span className={`text-[9px] font-black px-2.5 py-0.5 rounded-full ${detectedCount > 0 ? "bg-pokemon-red text-white" : "bg-emerald-100 text-emerald-800"}`}>
            {detectedCount > 0 ? `${detectedCount}개 의심 검출` : "결함 미검출 (안전)"}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {criticalDefects.map((defect, idx) => (
            <div 
              key={idx} 
              className={`p-2 rounded-xl border flex flex-col justify-between text-left transition ${defect.isDetected ? "border-pokemon-red/30 bg-red-50/20" : "border-slate-200 bg-slate-50/50"}`}
            >
              <span className="text-[10px] font-black text-slate-800">{defect.name}</span>
              <div className="flex items-center justify-between mt-1 pt-1 border-t border-slate-100">
                <span className="text-[8px] text-slate-400 font-semibold">{defect.desc}</span>
                <span className={`text-[8px] font-black uppercase px-1 rounded ${defect.isDetected ? "bg-pokemon-red text-white" : "bg-emerald-50 text-emerald-600"}`}>
                  {defect.isDetected ? "Detected" : "Clean"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 7. COLLAPSIBLE PSA GRADE SIMULATOR SANDBOX */}
      <div className="bg-white border-2 border-slate-200/80 rounded-3xl p-6 shadow-sm">
        <button
          onClick={() => setShowSimulator(!showSimulator)}
          className="w-full flex items-center justify-between text-slate-800 hover:text-pokemon-blue transition cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-pokemon-blue animate-pulse" />
            <h3 className="text-sm md:text-base font-display font-black text-slate-800">
              ⚡ PSA 실시간 감정 시뮬레이터 (Interactive sandbox)
            </h3>
          </div>
          {showSimulator ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
        </button>

        <p className="text-xs text-slate-500 mt-1.5 leading-relaxed font-sans">
          4대 항목(센터링, 코너, 엣지, 표면)의 세부 감정 점수를 실시간으로 조율하여 최종 변동되는 예상 등급과 공식 가중치 계산법을 확인해 보세요.
        </p>

        <AnimatePresence>
          {showSimulator && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="pt-6 border-t border-slate-100 mt-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Front Simulator Sliders */}
                <div className="space-y-4">
                  <h4 className="text-xs font-mono font-black text-pokemon-red uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-pokemon-red" />
                    앞면 (Front) 서브 등급 세팅
                  </h4>

                  {/* Centering */}
                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                      <span>앞면 센터링: {simCenteringFront}점</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={simCenteringFront}
                      onChange={(e) => setSimCenteringFront(parseInt(e.target.value))}
                      className="w-full accent-pokemon-red bg-slate-100 rounded-lg appearance-none h-1.5 cursor-pointer"
                    />
                  </div>

                  {/* Corners */}
                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                      <span>앞면 코너 마모: {simCornersFront}점</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={simCornersFront}
                      onChange={(e) => setSimCornersFront(parseInt(e.target.value))}
                      className="w-full accent-pokemon-red bg-slate-100 rounded-lg appearance-none h-1.5 cursor-pointer"
                    />
                  </div>

                  {/* Edges */}
                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                      <span>앞면 테두리 엣지: {simEdgesFront}점</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={simEdgesFront}
                      onChange={(e) => setSimEdgesFront(parseInt(e.target.value))}
                      className="w-full accent-pokemon-red bg-slate-100 rounded-lg appearance-none h-1.5 cursor-pointer"
                    />
                  </div>

                  {/* Surface */}
                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                      <span>앞면 표면 흠집: {simSurfaceFront}점</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={simSurfaceFront}
                      onChange={(e) => setSimSurfaceFront(parseInt(e.target.value))}
                      className="w-full accent-pokemon-red bg-slate-100 rounded-lg appearance-none h-1.5 cursor-pointer"
                    />
                  </div>
                </div>

                {/* Back Simulator Sliders */}
                <div className="space-y-4">
                  <h4 className="text-xs font-mono font-black text-pokemon-blue uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-pokemon-blue" />
                    뒷면 (Back) 서브 등급 세팅
                  </h4>

                  {/* Centering */}
                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                      <span>뒷면 센터링: {simCenteringBack}점</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={simCenteringBack}
                      onChange={(e) => setSimCenteringBack(parseInt(e.target.value))}
                      className="w-full accent-pokemon-blue bg-slate-100 rounded-lg appearance-none h-1.5 cursor-pointer"
                    />
                  </div>

                  {/* Corners */}
                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                      <span>뒷면 코너 마모: {simCornersBack}점</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={simCornersBack}
                      onChange={(e) => setSimCornersBack(parseInt(e.target.value))}
                      className="w-full accent-pokemon-blue bg-slate-100 rounded-lg appearance-none h-1.5 cursor-pointer"
                    />
                  </div>

                  {/* Edges */}
                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                      <span>뒷면 테두리 엣지: {simEdgesBack}점</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={simEdgesBack}
                      onChange={(e) => setSimEdgesBack(parseInt(e.target.value))}
                      className="w-full accent-pokemon-blue bg-slate-100 rounded-lg appearance-none h-1.5 cursor-pointer"
                    />
                  </div>

                  {/* Surface */}
                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                      <span>뒷면 표면 흠집: {simSurfaceBack}점</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={simSurfaceBack}
                      onChange={(e) => setSimSurfaceBack(parseInt(e.target.value))}
                      className="w-full accent-pokemon-blue bg-slate-100 rounded-lg appearance-none h-1.5 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Simulation Result Area */}
              <div className="mt-8 bg-slate-50 rounded-2xl p-4 border border-slate-200/60 flex flex-col md:flex-row items-center gap-6">
                <div className="flex-shrink-0 flex flex-col items-center justify-center p-4 bg-pokemon-yellow/15 rounded-xl border-2 border-pokemon-yellow w-36 h-28 shadow-xs">
                  <span className="text-[10px] font-mono text-pokemon-blue font-black tracking-wider text-center">SIMULATED GRADE</span>
                  <span className="text-3xl font-display font-black text-pokemon-blue mt-1">PSA {liveGrade}</span>
                </div>
                <div className="flex-1">
                  <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5 text-emerald-600 font-black" />
                    <span>실시간 산출 공식 설명</span>
                  </h4>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed font-mono">
                    {liveExplanation}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 8. DISCLAIMER */}
      <div className="bg-pokemon-yellow/5 border-2 border-pokemon-yellow/30 rounded-2xl p-4 flex gap-3 text-xs text-slate-600 leading-relaxed shadow-xs">
        <ShieldAlert className="w-5 h-5 text-pokemon-red flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-extrabold text-slate-800">면책 고지 (Disclaimer):</span> 본 Card-RANK 인공지능 그레이더 서비스에서 도출된 예상 등급은 사용자가 전송한 이미지를 토대로 분석한 보조적 참고용(Pre-grade) 지표입니다. 실제 오프라인 전문 감정 기관(PSA, BGS 등)의 정식 감정서 및 거래 가치 보장을 대행하지 않으며, 촬영 환경에 따라 오차가 있을 수 있으므로 수집 소장품 보호 보관을 위한 가이드용으로 사용해 주시기를 바랍니다.
        </div>
      </div>
    </div>
  );
}
