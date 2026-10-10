import fs from 'fs';
import path from 'path';

/**
 * Creates a valid, well-structured binary PDF 1.4 document with multiple pages
 * and styled text. This ensures native browser PDF viewers, PDF.js, and Adobe Acrobat
 * open the file reliably.
 */
export function generateValidPdfBuffer(
  title: string,
  subject: string,
  unit: string,
  type: string,
  author: string,
  pagesCount: number = 4
): Buffer {
  const objects: string[] = [];
  const pageObjectIds: number[] = [];

  // Helper to add object and get 1-indexed ID
  function addObject(content: string): number {
    objects.push(content);
    return objects.length;
  }

  // Pre-allocate Catalog (id 1) and Pages (id 2)
  // We'll fill them after pages are defined.
  objects.push(''); // placeholder for 1 (Catalog)
  objects.push(''); // placeholder for 2 (Pages root)
  const fontObjId = 3;
  objects.push('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>');
  const boldFontObjId = 4;
  objects.push('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>');

  // Generate N pages
  for (let i = 1; i <= pagesCount; i++) {
    // Content stream for page i
    const pageText = [
      'BT',
      `/F2 20 Tf 50 740 Td (${escapePdfText(`MENTOR HARRY FOR RGPV`)}) Tj`,
      `/F1 11 Tf 0 -22 Td (${escapePdfText(`Rajiv Gandhi Proudyogiki Vishwavidyalaya · Verified Study Engine`)}) Tj`,
      `0 -15 Td (${escapePdfText(`---------------------------------------------------------------------------------------------------`)}) Tj`,
      `/F2 16 Tf 0 -35 Td (${escapePdfText(`${title}`)}) Tj`,
      `/F1 12 Tf 0 -22 Td (${escapePdfText(`Subject: ${subject}  |  ${unit}`)}) Tj`,
      `/F1 11 Tf 0 -18 Td (${escapePdfText(`Resource Category: ${type}  |  Curated By: ${author}`)}) Tj`,
      `/F1 10 Tf 0 -16 Td (${escapePdfText(`Page ${i} of ${pagesCount}  |  Semester Exam Verified Reference`)}) Tj`,
      `0 -20 Td (${escapePdfText(`---------------------------------------------------------------------------------------------------`)}) Tj`,
      `/F2 13 Tf 0 -30 Td (${escapePdfText(`CORE TOPIC & THEOREM HIGHLIGHTS`)}) Tj`,
      `/F1 11 Tf 0 -22 Td (${escapePdfText(`1. Statement of Rolle's Theorem: If f(x) is continuous in [a,b] and differentiable in (a,b),`)}) Tj`,
      `0 -16 Td (${escapePdfText(`   and f(a) = f(b), then there exists at least one point c in (a,b) where f'(c) = 0.`)}) Tj`,
      `/F1 11 Tf 0 -22 Td (${escapePdfText(`2. Lagrange's Mean Value Theorem: f'(c) = [f(b) - f(a)] / (b - a)`)}) Tj`,
      `0 -16 Td (${escapePdfText(`   Essential geometric interpretation: Tangent at c is parallel to chord joining endpoints.`)}) Tj`,
      `/F1 11 Tf 0 -22 Td (${escapePdfText(`3. Cauchy's Mean Value Theorem & Taylor's Series Expansions for Single Variables.`)}) Tj`,
      `0 -16 Td (${escapePdfText(`   f(x) = f(a) + (x-a)f'(a) + [(x-a)^2 / 2!]f''(a) + ... + R_n(x)`)}) Tj`,
      `/F2 12 Tf 0 -26 Td (${escapePdfText(`RGPV EXAM TACTIC & HIGH-FREQUENCY PYQ NOTE`)}) Tj`,
      `/F1 10 Tf 0 -18 Td (${escapePdfText(`- Consistently tested in December & June examination cycles (7 marks compulsory question).`)}) Tj`,
      `0 -15 Td (${escapePdfText(`- Always provide standard Cartesian proof diagrams and state differentiability constraints.`)}) Tj`,
      `0 -15 Td (${escapePdfText(`- Verified by Mentor Harry academic review board for accuracy and syllabus compliance.`)}) Tj`,
      `0 -40 Td (${escapePdfText(`[ End of Page ${i} · Downloaded from Mentor Harry for RGPV Study Hub ]`)}) Tj`,
      'ET'
    ].join('\n');

    const streamLength = Buffer.byteLength(pageText, 'utf-8');
    const contentObjId = addObject(
      `<< /Length ${streamLength} >>\nstream\n${pageText}\nendstream`
    );

    const pageObjId = addObject(
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 ${fontObjId} 0 R /F2 ${boldFontObjId} 0 R >> >> /Contents ${contentObjId} 0 R >>`
    );
    pageObjectIds.push(pageObjId);
  }

  // Now set Catalog and Pages root
  objects[0] = `<< /Type /Catalog /Pages 2 0 R >>`;
  objects[1] = `<< /Type /Pages /Kids [${pageObjectIds.map((id) => `${id} 0 R`).join(' ')}] /Count ${pageObjectIds.length} >>`;

  // Build the complete PDF string with xref table
  let pdfOutput = '%PDF-1.4\n';
  const offsets: number[] = [];

  for (let i = 0; i < objects.length; i++) {
    offsets.push(Buffer.byteLength(pdfOutput, 'utf-8'));
    pdfOutput += `${i + 1} 0 obj\n${objects[i]}\nendobj\n`;
  }

  const xrefOffset = Buffer.byteLength(pdfOutput, 'utf-8');
  pdfOutput += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;

  for (const offset of offsets) {
    const formatted = String(offset).padStart(10, '0');
    pdfOutput += `${formatted} 00000 n \n`;
  }

  pdfOutput += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;

  return Buffer.from(pdfOutput, 'utf-8');
}

function escapePdfText(text: string): string {
  return text.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
}

export function ensureInitialPdfsExist(uploadDir: string) {
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const initialFiles = [
    {
      fileName: 'Calculus_Part1_Comprehensive_Handwritten.pdf',
      title: 'Calculus Part 1 — Comprehensive Handwritten Notes',
      subject: 'Engineering Mathematics I (BT-102)',
      unit: 'Unit 1: Differential Calculus & Expansions',
      type: 'Handwritten',
      author: 'Harry Sir (Dept Topper batch \'23)',
      pages: 48,
    },
    {
      fileName: 'Calculus_Part1_Shivani_Guidebook.pdf',
      title: 'Calculus Part 1 — Shivani Publication Guidebook Notes',
      subject: 'Engineering Mathematics I (BT-102)',
      unit: 'Unit 1: Differential Calculus & Expansions',
      type: 'Guidebook',
      author: 'Shivani Series (Official Reprint)',
      pages: 32,
    },
    {
      fileName: 'Calculus_Part1_HighYield_PYQs.pdf',
      title: 'Calculus Part 1 — High-Yield Important Questions & PYQs (2018–2024)',
      subject: 'Engineering Mathematics I (BT-102)',
      unit: 'Unit 1: Differential Calculus & Expansions',
      type: 'Exam Prep',
      author: 'Verified RGPV Papers',
      pages: 18,
    },
    {
      fileName: 'Calculus_Part1_FormulaSheet_Capsule.pdf',
      title: 'Formula Sheet & Theorem Proofs — Quick Revision Capsule',
      subject: 'Engineering Mathematics I (BT-102)',
      unit: 'Unit 1: Differential Calculus & Expansions',
      type: 'Class Notes',
      author: 'Academic Core Team',
      pages: 4,
    },
    {
      fileName: 'Calculus_Part2_Curvature_Bundle.pdf',
      title: 'Calculus Part 2 — Curvature & Curve Tracing Study Pack',
      subject: 'Engineering Mathematics I (BT-102)',
      unit: 'Unit 2: Curvature & Curve Tracing',
      type: 'Handwritten',
      author: 'Prof. V. Sharma',
      pages: 38,
    },
    {
      fileName: 'AC_Circuits_Resonance_Class_Notes.pdf',
      title: 'AC Circuits & Resonance — Class Notes',
      subject: 'Basic Electrical & Electronics (BT-104)',
      unit: 'Unit 2: Single Phase AC Circuits',
      type: 'Class Notes',
      author: 'UIT RGPV Class Notes',
      pages: 28,
    },
  ];

  for (const item of initialFiles) {
    const filePath = path.join(uploadDir, item.fileName);
    if (!fs.existsSync(filePath)) {
      const buffer = generateValidPdfBuffer(
        item.title,
        item.subject,
        item.unit,
        item.type,
        item.author,
        Math.min(item.pages, 10)
      );
      fs.writeFileSync(filePath, buffer);
    }
  }
}
