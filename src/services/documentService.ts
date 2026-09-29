import { MOCK_DOCUMENTS } from '../mock/mockData';
import { ComplianceDocument } from '../types';

export const documentService = {
  async getDocuments(): Promise<ComplianceDocument[]> {
    return [...MOCK_DOCUMENTS];
  },

  async scanOrUploadDocument(title: string, category: ComplianceDocument['category']): Promise<ComplianceDocument> {
    const newDoc: ComplianceDocument = {
      id: `doc-${Date.now()}`,
      title,
      fileName: `${title.toLowerCase().replace(/\s+/g, '_')}.pdf`,
      fileSize: '1.2 MB',
      uploadedAt: 'Just now',
      category,
      documentType: 'Scanned Document (AI OCR Analyzed)',
      extractedText: `SIMULATED AI OCR EXTRACTION RESULT FOR "${title.toUpperCase()}"
Location Tag: Pit 4B Mine Complex
Extraction Time: ${new Date().toLocaleString()}

KEY COMPLIANCE DATA DETECTED:
- Gas Sensor Calibration: PASS (Methane: 0.2%, CO: 5 ppm)
- Structural Integrity Check: Verified compliant with DGMS Circular 4/2024.
- AI Risk Score: 0.04 (Low Risk)
- Action Items: None required immediately. Central audit archive updated.`,
    };
    MOCK_DOCUMENTS.unshift(newDoc);
    return newDoc;
  },
};
