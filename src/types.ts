export interface GradeComponent {
  ratio?: string; // Optional for centering
  sub_grade: number;
  assessment: string;
}

export interface CardSideGrading {
  centering: GradeComponent;
  corners: GradeComponent;
  edges: GradeComponent;
  surface: GradeComponent;
}

export interface GradingResult {
  front: CardSideGrading;
  back: CardSideGrading;
  estimated_psa: number;
  estimated_range: string;
  disclaimer: string;
}

export type AppStep = "INTRO" | "FRONT_UPLOAD" | "BACK_UPLOAD" | "ANALYZING" | "RESULT";
