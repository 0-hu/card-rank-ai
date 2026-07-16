export const generateMockCardBase64 = (type: "charizard" | "pikachu", side: "front" | "back"): string => {
  const canvas = document.createElement("canvas");
  canvas.width = 400;
  canvas.height = 560; // Standard TCG card aspect ratio
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  // Outer border (classic yellow or silver)
  ctx.fillStyle = type === "charizard" ? "#d69e2e" : "#ffd700"; // gold border
  ctx.fillRect(0, 0, 400, 560);

  // Inner card background
  if (side === "front") {
    // Inner area border
    ctx.fillStyle = type === "charizard" ? "#1e0c0c" : "#1a1a00";
    ctx.fillRect(15, 15, 370, 530);

    // Header gradient
    const grad = ctx.createLinearGradient(0, 0, 400, 0);
    grad.addColorStop(0, type === "charizard" ? "#e53e3e" : "#f6e05e");
    grad.addColorStop(1, type === "charizard" ? "#dd6b20" : "#d69e2e");
    ctx.fillStyle = grad;
    ctx.fillRect(25, 25, 350, 45);

    // Text name & HP
    ctx.fillStyle = type === "charizard" ? "#ffffff" : "#000000";
    ctx.font = "bold 18px 'Space Grotesk', sans-serif";
    ctx.fillText(type === "charizard" ? "리자몽 (Charizard)" : "피카츄 (Pikachu)", 40, 55);
    ctx.font = "bold 15px 'Space Grotesk', sans-serif";
    ctx.fillText(type === "charizard" ? "HP 120 🔥" : "HP 60 ⚡", 300, 55);

    // Image slot
    const imgGrad = ctx.createRadialGradient(200, 200, 20, 200, 200, 150);
    imgGrad.addColorStop(0, type === "charizard" ? "#feb2b2" : "#fffbeb");
    imgGrad.addColorStop(1, type === "charizard" ? "#742a2a" : "#b7791f");
    ctx.fillStyle = imgGrad;
    ctx.fillRect(35, 80, 330, 240);

    // Render character art
    if (type === "charizard") {
      ctx.fillStyle = "#f56565";
      ctx.beginPath();
      ctx.arc(200, 190, 50, 0, Math.PI * 2);
      ctx.fill();
      // Eyes
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(180, 185, 8, 0, Math.PI * 2);
      ctx.arc(220, 185, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#000000";
      ctx.beginPath();
      ctx.arc(182, 185, 4, 0, Math.PI * 2);
      ctx.arc(218, 185, 4, 0, Math.PI * 2);
      ctx.fill();
      // Horns
      ctx.fillStyle = "#ed8936";
      ctx.beginPath();
      ctx.moveTo(170, 150);
      ctx.lineTo(150, 110);
      ctx.lineTo(190, 145);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(230, 150);
      ctx.lineTo(250, 110);
      ctx.lineTo(210, 145);
      ctx.fill();
      // Mouth fire
      ctx.fillStyle = "#ed8936";
      ctx.beginPath();
      ctx.moveTo(190, 210);
      ctx.quadraticCurveTo(200, 240, 210, 210);
      ctx.fill();
    } else {
      // Pikachu
      ctx.fillStyle = "#f6e05e";
      ctx.beginPath();
      ctx.arc(200, 200, 60, 0, Math.PI * 2);
      ctx.fill();
      // Red cheeks
      ctx.fillStyle = "#e53e3e";
      ctx.beginPath();
      ctx.arc(160, 215, 12, 0, Math.PI * 2);
      ctx.arc(240, 215, 12, 0, Math.PI * 2);
      ctx.fill();
      // Eyes
      ctx.fillStyle = "#000000";
      ctx.beginPath();
      ctx.arc(175, 185, 7, 0, Math.PI * 2);
      ctx.arc(225, 185, 7, 0, Math.PI * 2);
      ctx.fill();
      // Pupils
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(177, 183, 3, 0, Math.PI * 2);
      ctx.arc(227, 183, 3, 0, Math.PI * 2);
      ctx.fill();
      // Ears
      ctx.fillStyle = "#f6e05e";
      ctx.beginPath();
      ctx.moveTo(150, 160);
      ctx.lineTo(115, 100);
      ctx.lineTo(170, 150);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(250, 160);
      ctx.lineTo(285, 100);
      ctx.lineTo(230, 150);
      ctx.fill();
      // Black tips on ears
      ctx.fillStyle = "#000000";
      ctx.beginPath();
      ctx.moveTo(115, 100);
      ctx.lineTo(125, 115);
      ctx.lineTo(140, 135);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(285, 100);
      ctx.lineTo(275, 115);
      ctx.lineTo(260, 135);
      ctx.fill();
    }

    // Attacks & Description Area
    ctx.fillStyle = "#2d3748";
    ctx.fillRect(35, 335, 330, 190);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 15px 'Space Grotesk', sans-serif";
    ctx.fillText(type === "charizard" ? "회오리불꽃 (Fire Spin)" : "백만볼트 (Thunderbolt)", 50, 370);
    ctx.fillText(type === "charizard" ? "100" : "50", 320, 370);

    ctx.fillStyle = "#cbd5e0";
    ctx.font = "12px 'Inter', sans-serif";
    ctx.fillText(type === "charizard" ? "화염 에너지를 폭발시켜 방출합니다." : "번개 전하를 모아 충격을 가합니다.", 50, 395);

    // Print details (some simulation lines)
    ctx.fillStyle = "#4a5568";
    ctx.fillRect(35, 430, 330, 1);
    ctx.font = "italic 9px 'JetBrains Mono', sans-serif";
    ctx.fillStyle = "#a0aec0";
    ctx.fillText("Card-RANK PSA Grader Demo v0.2", 50, 455);
    ctx.fillText("©2026 Card-RANK / AI Studio Grader", 50, 475);

    // Add visual defects for authentic simulation grading!
    // E.g. minor centering shifted slightly to the right, some minor edge speckles
    if (type === "charizard") {
      // Off-center representation: let's draw some yellow border wider
      ctx.strokeStyle = "rgba(255,255,255,0.05)";
      ctx.lineWidth = 1;
      ctx.strokeRect(0, 0, 400, 560);
    } else {
      // Pikachu perfect mock
    }
  } else {
    // Pokemon Card Back
    ctx.fillStyle = "#1a365d"; // Blue
    ctx.fillRect(15, 15, 370, 530);

    // Swirly background or geometric shapes
    ctx.strokeStyle = "#2b6cb0";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(200, 280, 120, 0, Math.PI * 2);
    ctx.stroke();

    // Pokeball circle
    ctx.fillStyle = "#e53e3e"; // Red top half
    ctx.beginPath();
    ctx.arc(200, 280, 80, Math.PI, 0, false);
    ctx.fill();

    ctx.fillStyle = "#ffffff"; // White bottom half
    ctx.beginPath();
    ctx.arc(200, 280, 80, 0, Math.PI, false);
    ctx.fill();

    // Black line separator
    ctx.fillStyle = "#000000";
    ctx.fillRect(115, 275, 170, 10);

    // Center button
    ctx.fillStyle = "#000000";
    ctx.beginPath();
    ctx.arc(200, 280, 30, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(200, 280, 18, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(200, 280, 8, 0, Math.PI * 2);
    ctx.stroke();

    // Add a couple of extremely subtle "whitening" dots on the back edges for realistic grading
    if (type === "charizard") {
      ctx.fillStyle = "#e2e8f0";
      ctx.beginPath();
      ctx.arc(10, 80, 1.5, 0, Math.PI * 2); // left edge whitening
      ctx.arc(390, 400, 2, 0, Math.PI * 2); // right edge whitening
      ctx.fill();
    }
  }

  // Lighting overlay
  const photoGrad = ctx.createLinearGradient(0, 0, 400, 560);
  photoGrad.addColorStop(0, "rgba(255,255,255,0.08)");
  photoGrad.addColorStop(0.5, "rgba(255,255,255,0)");
  photoGrad.addColorStop(1, "rgba(0,0,0,0.15)");
  ctx.fillStyle = photoGrad;
  ctx.fillRect(0, 0, 400, 560);

  return canvas.toDataURL("image/jpeg", 0.9);
};

export const resizeImage = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const maxDim = 1200; // Optimal for Gemini details
        let width = img.width;
        let height = img.height;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL("image/jpeg", 0.85));
        } else {
          resolve(e.target?.result as string);
        }
      };
      img.onerror = () => reject(new Error("Failed to parse image file."));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error("Failed to read file."));
    reader.readAsDataURL(file);
  });
};
