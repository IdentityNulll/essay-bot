import pdf from 'pdf-parse';
import mammoth from 'mammoth';

/**
 * Extracts plain text from a PDF file buffer.
 * 
 * @param {Buffer} buffer - File buffer
 * @returns {Promise<string>} Extracted text
 */
export async function parsePdf(buffer) {
  try {
    const data = await pdf(buffer);
    if (!data || !data.text) {
      throw new Error('No text content found in PDF.');
    }
    return data.text.trim();
  } catch (error) {
    console.error('Error parsing PDF:', error);
    throw new Error('Failed to parse PDF document: ' + error.message);
  }
}

/**
 * Extracts plain text from a DOCX file buffer.
 * 
 * @param {Buffer} buffer - File buffer
 * @returns {Promise<string>} Extracted text
 */
export async function parseDocx(buffer) {
  try {
    const result = await mammoth.extractRawText({ buffer });
    if (!result || !result.value) {
      throw new Error('No text content found in DOCX.');
    }
    return result.value.trim();
  } catch (error) {
    console.error('Error parsing DOCX:', error);
    throw new Error('Failed to parse DOCX document: ' + error.message);
  }
}
