import * as pdfjs from "pdfjs-dist";

// Set the worker source path
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

// Extract text from PDF files
export async function extractTextFromPDF(file: File): Promise<string> {
  try {
    // Convert file to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();

    // Load the PDF document
    const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;

    let fullText = "";

    // Extract text from each page
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map((item: any) => item.str).join(" ");

      fullText += pageText + "\n\n";
    }

    return fullText;
  } catch (error) {
    console.error("Error extracting text from PDF:", error);
    throw new Error("Failed to extract text from PDF");
  }
}

// Extract text from image files (placeholder - would use OCR in production)
export function extractTextFromImage(file: File): Promise<string> {
  // In a real app, you would use Tesseract.js or a similar OCR library
  return Promise.resolve(
    `[This is a placeholder for OCR text extraction from ${file.name}. In a production app, we would use Tesseract.js or a similar OCR library to extract text from this image.]`,
  );
}

// Extract text from Word documents (placeholder)
export function extractTextFromDoc(file: File): Promise<string> {
  // In a real app, you would use mammoth.js or similar
  return Promise.resolve(
    `[This is a placeholder for text extraction from ${file.name}. In a production app, we would use mammoth.js or a similar library to extract text from this Word document.]`,
  );
}
