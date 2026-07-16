# 🃏 Card-RANK — Pokémon TCG AI Grader

> **Gemini 3.5 Flash 기반의 지능형 트레이딩 카드(TCG) 상태 분석 및 PSA 등급 추정 서비스**

Card-RANK는 스마트폰 카메라 촬영 또는 이미지 업로드를 통해 포켓몬 카드 등 TCG 카드의 보존 상태를 8대 항목별로 정밀 진단하고, 공신력 있는 PSA 등급 기준에 맞추어 예상 등급(1~10)을 추정해 주는 웹 애플리케이션입니다.

AI Studio 환경에 맞춰 최적화되어 있으며, 프론트엔드는 React와 Vite를 기반으로, 백엔드는 Express와 최신 `@google/genai` SDK를 활용하여 구축되었습니다.

---

## ✨ 주요 기능 (Key Features)

1. **📸 편리한 카드 스캔 & 카메라 업로드**
   * 데스크톱 웹 환경 및 모바일 카메라 스트림을 통해 카드의 **앞면(Front)**과 **뒷면(Back)** 이미지를 직관적으로 획득하고 업로드할 수 있습니다.
   
2. **🧠 Gemini 3.5 Flash 시각 분석 (Visual QA)**
   * 최신 Gemini 3.5 Flash 인공지능 모델이 제출된 고해상도 카드 이미지를 분석하여 PSA의 4대 평가 요소(Centering, Corners, Edges, Surface)를 앞/뒷면 각각(총 8대 sub-grade 항목) 개별 측정합니다.

3. **📊 과학적인 PSA 등급 통합 연산 공식**
   * 단순히 평균값을 내는 것이 아닌, 실제 그레이딩 프로세스의 엄격성을 반영한 자체 연산 로직을 적용합니다:
     $$\text{Estimated PSA} = \min(\text{SubGrades})$$
     * 단, **나머지 7개 항목의 평균 점수가 최저점보다 2점 이상 우수할 경우** 최종 점수에 **+0.5점 보너스 보정**을 부여합니다. (최대 10점, 최소 1점 제한)
     * 산출된 예상 등급 기준 $\pm 1$ 범위 내로 예상 등급 범위(Estimated Range)를 제공합니다.

4. **🎛️ 실시간 등급 샌드박스 시뮬레이터 (Sandbox Simulator)**
   * 결과 화면 하단에서 8개 세부 항목의 슬라이더 점수를 사용자가 임의로 조정해 보며 등급 연산 결과가 실시간으로 어떻게 변화하는지 직관적으로 확인할 수 있습니다.

5. **✨ 홀로그래픽 카드 프리뷰 & 샘플 데모**
   * 마우스 움직임에 따라 반응하는 은은한 홀로그램 광택 효과(Holographic Shine Effect)가 적용되어 프리미엄 카드 수집품의 느낌을 제공합니다.
   * 테스트할 실물 카드가 없어도 백그라운드에서 HTML5 Canvas로 정교하게 그려지는 **리자몽(Red Dragon)** 및 **피카츄(Ultra Gold)** 샘플 카드를 사용해 즉시 그레이딩 성능을 테스트할 수 있습니다.

---

## 🛠️ 기술 스택 (Tech Stack)

### **Frontend**
* **Framework**: React 19, TypeScript
* **Build Tool**: Vite 6
* **Styling**: Tailwind CSS v4, Motion (구 Framer Motion)
* **Icons**: Lucide React

### **Backend**
* **Runtime**: Node.js
* **Framework**: Express
* **AI Integration**: `@google/genai` (v2.4.0)
* **Runner/Bundler**: `tsx` (개발용), `esbuild` (프로덕션 빌드용)

---

## 📂 프로젝트 구조 (Project Directory Structure)

```text
card-rank-ai/
├── server.ts            # Express 백엔드 서버 및 Gemini API 연동 API 라우터
├── package.json         # 의존성 설정 및 실행 스크립트
├── vite.config.ts       # Vite 설정 (HMR 비활성화 옵션 포함)
├── index.html           # SPA 메인 엔트리 HTML
├── metadata.json        # AI Studio 앱 설정 메타데이터
├── src/
│   ├── main.tsx         # React 앱 시작점
│   ├── App.tsx          # 단계별 화면 전환 제어 및 비동기 상태 관리
│   ├── types.ts         # TypeScript 인터페이스 정의 (GradingResult, AppStep 등)
│   ├── utils.ts         # 가상 카드 Base64 생성기 및 이미지 리사이징 헬퍼
│   └── components/
│       ├── IntroScreen.tsx        # 메인 진입 화면 & 샘플 선택 영역
│       ├── CardScanner.tsx        # 카메라 스트리밍 및 이미지 수동 드래그 업로드
│       ├── CardGradingResult.tsx  # PSA 분석 진단 결과 & 샌드박스 시뮬레이터
│       └── CardLogo.tsx           # 카드 로고 아이콘 컴포넌트
└── assets/              # 기타 정적 에셋 파일
```

---

## 🚀 로컬 실행 방법 (Getting Started)

### **Prerequisites**
* [Node.js](https://nodejs.org/) (v18 이상 권장) 또는 [Bun](https://bun.sh/)

### **1. 의존성 패키지 설치**
```bash
npm install
```

### **2. 환경 변수 설정**
루트 디렉토리에 `.env` 또는 `.env.local` 파일을 생성한 뒤, Gemini API Key 및 앱 URL을 설정합니다.
```env
GEMINI_API_KEY="본인의_구글_제미나이_API_키_입력"
APP_URL="http://localhost:3000"
```

### **3. 개발 서버 실행**
백엔드 Express API와 Vite 프론트엔드가 동시에 실행되는 로컬 개발 서버를 가동합니다. (기본 포트: `3000`)
```bash
npm run dev
```
브라우저에서 `http://localhost:3000`으로 접속하여 서비스를 확인할 수 있습니다.

### **4. 빌드 및 프로덕션 실행**
```bash
# Vite 및 esbuild를 이용한 배포 파일 번들링
npm run build

# 빌드된 dist 디렉토리 및 서버 파일(dist/server.cjs) 실행
npm run start
```

---

## 🤖 AI 분석 상세 및 프롬프트 로직

백엔드 서버(`server.ts`) 내 `/api/analyze` 엔드포인트는 다음과 같이 정밀한 프롬프트를 구성하여 Gemini 3.5 Flash 모델에 전달합니다:

1. **입력 데이터**: 사용자가 업로드한 카드의 앞면/뒷면 JPEG 이미지를 Base64 형태로 포맷팅하여 Gemini 모델에 다중 모달(Multimodal) 입력값으로 전송합니다.
2. **분석 기준**:
   * **Centering (센터링)**: 테두리 비율(Borders Centering Ratio) 및 1~10 평점 부여
   * **Corners (모서리)**: 미세 닳음(Fraying), 화이트닝, 모서리 눌림 진단
   * **Edges (테두리 엣지)**: 칠 벗겨짐(Chipping), 변색, 찌그러짐 진단
   * **Surface (표면)**: 미세 스크래치, 인쇄 밀림 현상(Print lines), 광택 상태 진단
3. **응답 사양**: JSON Schema 구조에 명확히 들어맞도록 엄격히 통제(Response MIME Type을 `application/json`으로 명시)하여 수신 즉시 에러 없이 파싱할 수 있습니다.

---

## ⚖️ 면책 사항 (Disclaimer)

Card-RANK는 트레이딩 카드 수집가들의 편의를 돕는 자가 진단/사전 예측(Pre-grading) 도구입니다. 인공지능 분석 결과는 이미지 촬영 시 조명, 각도, 해상도 등에 따라 다를 수 있으며, 실제 PSA, BGS, CGC 등 글로벌 공인 평가사들의 등급 판정 결과와는 무관하므로 상업적 거래 등의 직접적인 신용 가치 척도로 사용해서는 안 됩니다.

