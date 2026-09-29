import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { Colors } from '../theme/colors';
import { ComplianceDocument } from '../types';

export const DocumentOCRScreen: React.FC = () => {
  const { documents, addMockDocument } = useApp();
  const [selectedDoc, setSelectedDoc] = useState<ComplianceDocument | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  const handleScan = async (title: string, category: ComplianceDocument['category']) => {
    setIsScanning(true);
    setTimeout(async () => {
      await addMockDocument(title, category);
      setIsScanning(false);
    }, 800);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.headerTitle}>COMPLIANCE DOCUMENTS & AI OCR</Text>
        <Text style={styles.headerSub}>
          Digitize DGMS permits, environmental clearances & field audit scans
        </Text>

        {/* Scan / Upload Actions */}
        <View style={styles.actionGrid}>
          <TouchableOpacity
            style={styles.actionCardPrimary}
            onPress={() => handleScan('DGMS Weekly Belt Audit', 'DGMS Compliance')}
            disabled={isScanning}
            activeOpacity={0.85}
          >
            <View style={styles.actionIconCircle}>
              <Ionicons name="camera" size={24} color={Colors.textDark} />
            </View>
            <Text style={styles.actionTitle}>SCAN DOCUMENT</Text>
            <Text style={styles.actionSub}>Simulate Field Camera Scan & AI OCR</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCardSecondary}
            onPress={() => handleScan('Environmental Clearance Pond #2', 'Environmental Monitoring')}
            disabled={isScanning}
            activeOpacity={0.85}
          >
            <View style={[styles.actionIconCircle, { backgroundColor: 'rgba(245, 158, 11, 0.2)' }]}>
              <Ionicons name="cloud-upload" size={24} color={Colors.primary} />
            </View>
            <Text style={styles.actionTitleSec}>UPLOAD DOCUMENT</Text>
            <Text style={styles.actionSub}>Select PDF / Image File</Text>
          </TouchableOpacity>
        </View>

        {isScanning && (
          <View style={styles.scanningBanner}>
            <Ionicons name="hardware-chip-outline" size={20} color={Colors.primary} />
            <Text style={styles.scanningText}>AI Optical Character Recognition (OCR) Processing...</Text>
          </View>
        )}

        {/* Recent Documents List */}
        <Text style={styles.sectionHeading}>RECENT COMPLIANCE ARCHIVE ({documents.length})</Text>

        {documents.map((doc) => (
          <TouchableOpacity
            key={doc.id}
            style={styles.docCard}
            onPress={() => setSelectedDoc(doc)}
            activeOpacity={0.8}
          >
            <View style={styles.docIconBox}>
              <Ionicons name="document-text" size={24} color={Colors.primary} />
            </View>

            <View style={styles.docInfo}>
              <Text style={styles.docTitle}>{doc.title}</Text>
              <Text style={styles.docMeta}>
                {doc.fileName} • {doc.fileSize} • Uploaded {doc.uploadedAt}
              </Text>
              <View style={styles.catPill}>
                <Text style={styles.catPillText}>{doc.category}</Text>
              </View>
            </View>

            <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* OCR Preview Modal */}
      <Modal visible={!!selectedDoc} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            {selectedDoc && (
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>AI OCR Extracted View</Text>
                  <TouchableOpacity onPress={() => setSelectedDoc(null)}>
                    <Ionicons name="close-circle" size={24} color={Colors.textMuted} />
                  </TouchableOpacity>
                </View>

                {/* Simulated Document Header */}
                <View style={styles.previewDocHeader}>
                  <Ionicons name="document" size={32} color={Colors.primary} />
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={styles.previewDocTitle}>{selectedDoc.title}</Text>
                    <Text style={styles.previewDocMeta}>{selectedDoc.fileName} ({selectedDoc.fileSize})</Text>
                  </View>
                </View>

                {/* Simulated Extracted Text Box */}
                <Text style={styles.extractedLabel}>SIMULATED AI OCR EXTRACTED TEXT:</Text>
                <View style={styles.ocrBox}>
                  <Text style={styles.ocrText}>{selectedDoc.extractedText}</Text>
                </View>

                <View style={styles.modalActionRow}>
                  <TouchableOpacity
                    style={styles.copyBtn}
                    onPress={() => setSelectedDoc(null)}
                  >
                    <Ionicons name="copy-outline" size={16} color={Colors.textPrimary} />
                    <Text style={styles.copyBtnText}>Copy Extracted Data</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.closeModalBtn}
                    onPress={() => setSelectedDoc(null)}
                  >
                    <Text style={styles.closeModalText}>DONE</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  headerTitle: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: '800',
  },
  headerSub: {
    color: Colors.textMuted,
    fontSize: 11,
    marginBottom: 14,
  },
  actionGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  actionCardPrimary: {
    flex: 1,
    backgroundColor: Colors.primary,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
  },
  actionCardSecondary: {
    flex: 1,
    backgroundColor: Colors.cardBg,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  actionIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionTitle: {
    color: Colors.textDark,
    fontSize: 12,
    fontWeight: '900',
  },
  actionTitleSec: {
    color: Colors.textPrimary,
    fontSize: 12,
    fontWeight: '900',
  },
  actionSub: {
    color: Colors.textMuted,
    fontSize: 9,
    textAlign: 'center',
    marginTop: 2,
  },
  scanningBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.primary,
    marginBottom: 14,
    gap: 10,
  },
  scanningText: {
    color: Colors.primary,
    fontSize: 12,
    fontWeight: '700',
  },
  sectionHeading: {
    color: Colors.textPrimary,
    fontSize: 13,
    fontWeight: '800',
    marginVertical: 10,
    letterSpacing: 0.3,
  },
  docCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    flexDirection: 'row',
    alignItems: 'center',
  },
  docIconBox: {
    width: 42,
    height: 42,
    borderRadius: 10,
    backgroundColor: Colors.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  docInfo: {
    flex: 1,
  },
  docTitle: {
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
  },
  docMeta: {
    color: Colors.textMuted,
    fontSize: 10,
    marginTop: 2,
  },
  catPill: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 4,
  },
  catPillText: {
    color: Colors.primary,
    fontSize: 9,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    padding: 16,
  },
  modalCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: 16,
    padding: 18,
    maxHeight: '85%',
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalTitle: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: '800',
  },
  previewDocHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceLight,
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },
  previewDocTitle: {
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: '800',
  },
  previewDocMeta: {
    color: Colors.textMuted,
    fontSize: 11,
  },
  extractedLabel: {
    color: Colors.primary,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  ocrBox: {
    backgroundColor: Colors.inputBg,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
    marginBottom: 14,
  },
  ocrText: {
    color: Colors.textPrimary,
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    lineHeight: 18,
  },
  modalActionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  copyBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surfaceLight,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  copyBtnText: {
    color: Colors.textPrimary,
    fontSize: 12,
    fontWeight: '700',
  },
  closeModalBtn: {
    flex: 1,
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeModalText: {
    color: Colors.textDark,
    fontSize: 12,
    fontWeight: '900',
  },
});
