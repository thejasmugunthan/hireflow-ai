import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import path from 'path';

/**
 * Extracts raw text from uploaded file buffer based on its extension
 */
export const extractTextFromResume = async (file) => {
  try {
    const ext = path.extname(file.originalname).toLowerCase();

    if (ext === '.pdf') {
      const pdfData = await pdfParse(file.buffer);
      return cleanText(pdfData.text);
    } else if (ext === '.docx' || ext === '.doc') {
      const result = await mammoth.extractRawText({ buffer: file.buffer });
      return cleanText(result.value);
    } else {
      // Plain text fallback
      return cleanText(file.buffer.toString('utf-8'));
    }
  } catch (error) {
    console.error('Resume text extraction error:', error.message);
    return '';
  }
};

const cleanText = (text) => {
  if (!text) return '';
  return text
    .replace(/\r\n/g, '\n')
    .replace(/\t/g, ' ')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n\s*\n/g, '\n\n')
    .trim();
};
