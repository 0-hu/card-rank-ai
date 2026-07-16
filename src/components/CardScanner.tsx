import React, { useRef, useState, useEffect } from "react";
import { Camera, Upload, RefreshCw, ArrowRight, ChevronLeft, Image as ImageIcon, Sparkles, SwitchCamera } from "lucide-react";
import { motion } from "motion/react";
import { resizeImage } from "../utils";

interface CardScannerProps {
  frontImage: string;
  backImage: string;
  setFrontImage: (val: string) => void;
  setBackImage: (val: string) => void;
  onBack: () => void;
  onAnalyze: () => void;
}

export default function CardScanner({
  frontImage,
  backImage,
  setFrontImage,
  setBackImage,
  onBack,
  onAnalyze,
}: CardScannerProps) {
  const [activeSide, setActiveSide] = useState<"front" | "back">("front");
  const [isDragging, setIsDragging] = useState(false);
  const [loadingFile, setLoadingFile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Advanced camera control states
  const [scanMode, setScanMode] = useState<"upload" | "camera">("upload");
  const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState("");

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const processFile = async (file: File) => {
    setLoadingFile(true);
    try {
      const base64 = await resizeImage(file);
      if (activeSide === "front") {
        setFrontImage(base64);
      } else {
        setBackImage(base64);
      }
    } catch (err) {
      console.error("Error resizing image:", err);
      alert("이미지를 처리하는 중 오류가 발생했습니다. 다른 사진을 시도해보세요.");
    } finally {
      setLoadingFile(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      await processFile(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      await processFile(files[0]);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Camera handling functions
  const startCamera = async (mode: "environment" | "user" = facingMode) => {
    setCameraError("");
    stopCamera();

    try {
      const constraints = {
        video: {
          facingMode: mode,
          width: { ideal: 1280 },
          height: { ideal: 960 },
        },
        audio: false,
      };
      
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = mediaStream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        // Wait for metadata before playing
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play().catch((playErr) => console.error("Video play failed:", playErr));
        };
      }
      setIsCameraActive(true);
    } catch (err: any) {
      console.error("Error starting camera stream:", err);
      setCameraError("카메라 스트림을 열 수 없습니다. 권한 승인 여부를 확인해주세요.");
      setScanMode("upload"); // Automatic fallback
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && isCameraActive) {
      const video = videoRef.current;
      const canvas = document.createElement("canvas");
      
      // Keep captured photo at optimal resolution
      canvas.width = video.videoWidth || 960;
      canvas.height = video.videoHeight || 1280;
      
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const base64 = canvas.toDataURL("image/jpeg", 0.9);
        
        if (activeSide === "front") {
          setFrontImage(base64);
        } else {
          setBackImage(base64);
        }
        
        stopCamera();
      }
    }
  };

  const toggleFacingMode = () => {
    const newMode = facingMode === "environment" ? "user" : "environment";
    setFacingMode(newMode);
    if (scanMode === "camera") {
      startCamera(newMode);
    }
  };

  const currentSideImage = activeSide === "front" ? frontImage : backImage;

  // Manage camera lifecycle based on state changes
  useEffect(() => {
    if (scanMode === "camera" && !currentSideImage) {
      startCamera(facingMode);
    } else {
      stopCamera();
    }
    
    return () => {
      stopCamera();
    };
  }, [scanMode, activeSide, currentSideImage, facingMode]);

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-6 space-y-6">
      {/* Back to intro */}
      <button
        onClick={() => {
          stopCamera();
          onBack();
        }}
        className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-pokemon-blue hover:border-pokemon-blue/40 transition mb-2 font-sans bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-xs font-bold cursor-pointer active:scale-95"
      >
        <ChevronLeft className="w-4 h-4 text-pokemon-blue" />
        <span>처음 화면으로 (Intro)</span>
      </button>

      {/* Step Indicator */}
      <div className="flex items-center justify-between bg-white border-2 border-slate-100 rounded-2xl p-2.5 shadow-xs">
        <button
          onClick={() => {
            setActiveSide("front");
            setCameraError("");
          }}
          className={`flex-1 text-center py-2.5 rounded-xl font-display text-xs font-black transition flex items-center justify-center gap-2 cursor-pointer ${
            activeSide === "front"
              ? "bg-pokemon-red/10 text-pokemon-red border border-pokemon-red/20"
              : "text-slate-400 hover:text-slate-600"
          }`}
        >
          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${activeSide === "front" ? "bg-pokemon-red text-white" : "bg-slate-200 text-slate-500"}`}>1</span>
          <span>카드 앞면 (Front)</span>
          {frontImage && <span className="text-emerald-600 font-extrabold ml-1">✓</span>}
        </button>

        <button
          onClick={() => {
            setActiveSide("back");
            setCameraError("");
          }}
          className={`flex-1 text-center py-2.5 rounded-xl font-display text-xs font-black transition flex items-center justify-center gap-2 cursor-pointer ${
            activeSide === "back"
              ? "bg-pokemon-blue/10 text-pokemon-blue border border-pokemon-blue/20"
              : "text-slate-400 hover:text-slate-600"
          }`}
        >
          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${activeSide === "back" ? "bg-pokemon-blue text-white" : "bg-slate-200 text-slate-500"}`}>2</span>
          <span>카드 뒷면 (Back)</span>
          {backImage && <span className="text-emerald-600 font-extrabold ml-1">✓</span>}
        </button>
      </div>

      {/* Segmented Control for Upload vs Live Camera */}
      {!currentSideImage && (
        <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 max-w-xs mx-auto">
          <button
            type="button"
            onClick={() => setScanMode("upload")}
            className={`flex-1 py-2 text-[11px] font-black rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 ${
              scanMode === "upload"
                ? "bg-white text-slate-800 shadow-xs border border-slate-200/50"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>사진 업로드</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setScanMode("camera");
              startCamera(facingMode);
            }}
            className={`flex-1 py-2 text-[11px] font-black rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 ${
              scanMode === "camera"
                ? "bg-white text-slate-800 shadow-xs border border-slate-200/50"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>실시간 카메라</span>
          </button>
        </div>
      )}

      {/* Main Interactive Scanner Container */}
      <motion.div
        layout
        onDragOver={scanMode === "upload" ? handleDragOver : undefined}
        onDragLeave={scanMode === "upload" ? handleDragLeave : undefined}
        onDrop={scanMode === "upload" ? handleDrop : undefined}
        onClick={!currentSideImage && scanMode === "upload" ? triggerFileInput : undefined}
        className={`relative aspect-[3/4.2] rounded-3xl border-3 border-dashed flex flex-col items-center justify-center overflow-hidden transition duration-300 ${
          currentSideImage
            ? "border-slate-200 bg-white"
            : isDragging
            ? "border-pokemon-blue bg-pokemon-blue/5"
            : activeSide === "front"
            ? "border-pokemon-red/40 hover:border-pokemon-red bg-white cursor-pointer shadow-xs"
            : "border-pokemon-blue/40 hover:border-pokemon-blue bg-white cursor-pointer shadow-xs"
        }`}
      >
        {/* Live Camera Stream View */}
        {scanMode === "camera" && !currentSideImage && (
          <div className="absolute inset-0 w-full h-full bg-black z-10 flex items-center justify-center">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="absolute inset-0 w-full h-full object-cover"
            />
            
            {/* Shutter Camera Overlay controls */}
            <div className="absolute bottom-6 left-0 right-0 flex justify-between items-center px-10 z-20 pointer-events-auto">
              <button
                type="button"
                onClick={toggleFacingMode}
                className="w-11 h-11 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition active:scale-90 shadow-md cursor-pointer"
                title="카메라 전환"
              >
                <SwitchCamera className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={capturePhoto}
                className="w-16 h-16 rounded-full bg-white hover:scale-105 active:scale-90 border-4 border-slate-300 shadow-xl flex items-center justify-center transition cursor-pointer relative"
                title="촬영하기"
              >
                <div className="w-11 h-11 rounded-full bg-pokemon-red animate-pulse" />
              </button>

              <button
                type="button"
                onClick={() => setScanMode("upload")}
                className="px-3 py-1.5 rounded-full bg-black/60 hover:bg-black/80 text-white text-[10px] font-bold backdrop-blur-md border border-white/20 transition active:scale-90 shadow-md cursor-pointer"
              >
                업로드로 전환
              </button>
            </div>

            {/* Live capture guidelines */}
            <div className="absolute top-4 left-4 bg-black/60 text-white text-[9px] font-mono font-bold px-2.5 py-1 rounded-full backdrop-blur-xs z-20 flex items-center gap-1.5 border border-white/10">
              <span className="w-1.5 h-1.5 bg-pokemon-red rounded-full animate-ping" />
              <span>LIVE VIEW ({facingMode === "environment" ? "BACK" : "FRONT"})</span>
            </div>
          </div>
        )}

        {/* Layout framing guides (Pulsing yellow/blue bounds) - ALWAYS visible to guide alignment */}
        <div className="absolute inset-4 rounded-2xl border border-slate-200/40 pointer-events-none flex items-center justify-center z-20">
          <div className={`absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 ${activeSide === "front" ? "border-pokemon-red/60" : "border-pokemon-blue/60"}`} />
          <div className={`absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 ${activeSide === "front" ? "border-pokemon-red/60" : "border-pokemon-blue/60"}`} />
          <div className={`absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 ${activeSide === "front" ? "border-pokemon-red/60" : "border-pokemon-blue/60"}`} />
          <div className={`absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 ${activeSide === "front" ? "border-pokemon-red/60" : "border-pokemon-blue/60"}`} />

          {/* Subtly show card layout outline border for visual alignment - NO TEXT to prevent overlap */}
          {!currentSideImage && (
            <div className="w-4/5 h-4/5 border-2 border-dashed border-white/20 rounded-2xl" />
          )}
        </div>

        {/* Display Image Preview */}
        {currentSideImage ? (
          <div className="absolute inset-0 w-full h-full flex items-center justify-center p-3.5 z-20 bg-white">
            <img
              src={currentSideImage}
              alt={`${activeSide} card preview`}
              className="w-full h-full object-contain rounded-2xl shadow-md"
              referrerPolicy="no-referrer"
            />
            <div className="absolute top-4 right-4 flex gap-2">
              <button
                onClick={() => {
                  if (scanMode === "camera") {
                    // Reset and start camera again
                    if (activeSide === "front") setFrontImage("");
                    else setBackImage("");
                    startCamera(facingMode);
                  } else {
                    triggerFileInput();
                  }
                }}
                className="bg-white/95 hover:bg-white text-slate-700 p-2.5 rounded-xl border border-slate-200 shadow-md backdrop-blur-xs transition active:scale-95 flex items-center gap-1.5 text-xs font-bold cursor-pointer"
              >
                <RefreshCw className="w-4 h-4 text-pokemon-blue" />
                <span>재스캔 (Retry)</span>
              </button>
            </div>
          </div>
        ) : (
          /* File Upload view when no image is registered yet */
          scanMode === "upload" && (
            <div className="text-center p-6 pointer-events-none z-10 space-y-4">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto border-2 shadow-xs ${activeSide === "front" ? "bg-pokemon-red/10 border-pokemon-red/30 text-pokemon-red" : "bg-pokemon-blue/10 border-pokemon-blue/30 text-pokemon-blue"}`}>
                <Upload className="w-6 h-6 animate-bounce" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-800">
                  {activeSide === "front" ? "TCG 카드 앞면 업로드" : "TCG 카드 뒷면 업로드"}
                </h3>
                <p className="text-xs text-slate-500 mt-2 max-w-xs mx-auto leading-relaxed">
                  여기를 터치해 스마트폰에서 카드를 업로드하거나 파일을 이 위치로 드래그하세요.
                </p>
              </div>
              <div className="inline-flex items-center gap-1 bg-slate-50 text-slate-500 border border-slate-200 px-3 py-1 rounded-full text-[9px] font-mono font-bold">
                <ImageIcon className="w-3.5 h-3.5 text-pokemon-blue" />
                <span>PNG, JPEG 최적화 압축 지원</span>
              </div>
            </div>
          )
        )}

        {/* Loading Spinner during compression */}
        {loadingFile && (
          <div className="absolute inset-0 bg-white/95 backdrop-blur-xs flex flex-col items-center justify-center z-30">
            <div className={`w-8 h-8 border-3 border-t-transparent rounded-full animate-spin mb-3 ${activeSide === "front" ? "border-pokemon-red" : "border-pokemon-blue"}`} />
            <span className="text-xs text-slate-700 font-extrabold font-mono">이미지 정밀 최적화 중...</span>
          </div>
        )}
      </motion.div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Camera Access/Error Notification */}
      {cameraError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-sans text-center">
          {cameraError}
        </div>
      )}

      {/* Action Buttons */}
      <div className="mt-8 flex gap-4">
        {activeSide === "front" ? (
          <button
            disabled={!frontImage}
            onClick={() => {
              stopCamera();
              setActiveSide("back");
            }}
            className="w-full bg-pokemon-blue hover:bg-pokemon-blue/95 disabled:opacity-50 text-white font-display font-black py-3.5 px-5 rounded-2xl transition flex items-center justify-center gap-2 cursor-pointer active:scale-98 shadow-md border-2 border-pokemon-yellow btn-shine"
          >
            <span>다음 단계: 뒷면 등록 (Step 2)</span>
            <ArrowRight className="w-4 h-4 text-pokemon-yellow" />
          </button>
        ) : (
          <div className="w-full flex gap-3">
            <button
              onClick={() => {
                stopCamera();
                setActiveSide("front");
              }}
              className="flex-1 bg-slate-100 border-2 border-slate-200 text-slate-700 py-3.5 px-4 rounded-2xl font-display font-black hover:bg-slate-200 transition text-xs active:scale-98 cursor-pointer"
            >
              앞면 수정
            </button>
            <button
              disabled={!frontImage || !backImage}
              onClick={() => {
                stopCamera();
                onAnalyze();
              }}
              className="flex-[2] bg-pokemon-blue hover:bg-pokemon-blue/95 text-white font-display font-black py-3.5 px-5 rounded-2xl transition flex items-center justify-center gap-2 shadow-md disabled:opacity-50 disabled:cursor-not-allowed active:scale-98 cursor-pointer border-2 border-pokemon-yellow btn-shine"
            >
              <Sparkles className="w-4 h-4 text-pokemon-yellow animate-pulse" />
              <span>AI 등급 스캔 및 감정 시작</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
