import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { Colors } from '../theme/colors';
import { StatusBadge } from '../components/StatusBadge';
import { PhotoPlaceholderPicker } from '../components/PhotoPlaceholderPicker';
import { Violation } from '../types';

export const ViolationsScreen: React.FC = () => {
  const { violations, addViolation, setActiveScreen } = useApp();
  const [activeTab, setActiveTab] = useState<'All' | 'Open' | 'High Risk' | 'Resolved'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const [selectedViolation, setSelectedViolation] = useState<Violation | null>(null);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);

  // New incident form state
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<Violation['category']>('Safety');
  const [newLocation, setNewLocation] = useState('Bench #3 West Pit');
  const [newDesc, setNewDesc] = useState('');
  const [newSeverity, setNewSeverity] = useState<Violation['severity']>('High');
  const [newDept, setNewDept] = useState('Mechanical Maintenance');
  const [newPhoto, setNewPhoto] = useState('');

  const filteredViolations = violations.filter((v) => {
    const matchesTab =
      activeTab === 'All' ||
      (activeTab === 'Open' && (v.status === 'Open' || v.status === 'Assigned' || v.status === 'Reopened')) ||
      (activeTab === 'High Risk' && (v.severity === 'High' || v.severity === 'Critical') && v.status !== 'Closed') ||
      (activeTab === 'Resolved' && (v.status === 'Completed' || v.status === 'Verified' || v.status === 'Closed'));

    const matchesSearch =
      v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.responsibleDepartment.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
  });

  const handleCreateViolation = async () => {
    if (!newTitle) return;
    await addViolation({
      title: newTitle,
      category: newCategory,
      location: newLocation,
      description: newDesc || 'Incident observed during field round.',
      severity: newSeverity,
      status: 'Open',
      responsibleDepartment: newDept,
      responsiblePerson: 'Unassigned (Pending Chief Officer)',
      deadline: '29 Sep 2026',
      photoPlaceholder: newPhoto || 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=500',
    });
    setNewTitle('');
    setNewDesc('');
    setIsLogModalOpen(false);
  };

  return (
    <View style={styles.container}>
      {/* Tab bar */}
      <View style={styles.tabContainer}>
        {(['All', 'Open', 'High Risk', 'Resolved'] as const).map((t) => {
          const isActive = activeTab === t;
          return (
            <TouchableOpacity
              key={t}
              style={[styles.tabItem, isActive && styles.tabItemActive]}
              onPress={() => setActiveTab(t)}
            >
              <Text style={[styles.tabText, isActive && styles.tabTextActive]}>{t}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Search Bar */}
        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={18} color={Colors.textMuted} />
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search field violations by title, location or dept..."
            placeholderTextColor={Colors.textMuted}
          />
          {searchQuery !== '' && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color={Colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>

        {/* Log New Incident Header Button */}
        <TouchableOpacity
          style={styles.logNewBtn}
          onPress={() => setIsLogModalOpen(true)}
          activeOpacity={0.85}
        >
          <Ionicons name="add-circle" size={20} color={Colors.textDark} />
          <Text style={styles.logNewBtnText}>REPORT FIELD VIOLATION / INCIDENT</Text>
        </TouchableOpacity>

        {filteredViolations.length === 0 ? (
          <View style={styles.emptyCard}>
            <Ionicons name="checkmark-circle-outline" size={40} color={Colors.success} />
            <Text style={styles.emptyTitle}>No Incidents Found</Text>
            <Text style={styles.emptySub}>All safety & compliance criteria in this filter are clear.</Text>
          </View>
        ) : (
          filteredViolations.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.card}
              onPress={() => setSelectedViolation(item)}
              activeOpacity={0.8}
            >
              <View style={styles.cardHeader}>
                <View style={styles.catBadge}>
                  <Text style={styles.catText}>{item.category}</Text>
                </View>
                <View style={{ flexDirection: 'row', gap: 6 }}>
                  <StatusBadge label={item.severity} type="severity" size="small" />
                  <StatusBadge label={item.status} type="status" size="small" />
                </View>
              </View>

              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardLoc}>
                <Ionicons name="location-outline" size={12} color={Colors.textMuted} /> {item.location}
              </Text>
              <Text style={styles.cardDesc} numberOfLines={2}>
                {item.description}
              </Text>

              {item.photoPlaceholder && (
                <View style={styles.thumbWrapper}>
                  <Image source={{ uri: item.photoPlaceholder }} style={styles.thumbnail} />
                  <View style={styles.photoTag}>
                    <Ionicons name="camera" size={10} color="#FFF" />
                    <Text style={styles.photoTagText}>Photo Attached</Text>
                  </View>
                </View>
              )}

              <View style={styles.cardFooter}>
                <Text style={styles.deptText}>Dept: {item.responsibleDepartment}</Text>
                <Text style={styles.dateText}>{item.date}</Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* Violation Detail Modal */}
      <Modal visible={!!selectedViolation} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedViolation && (
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Violation Detail</Text>
                  <TouchableOpacity onPress={() => setSelectedViolation(null)}>
                    <Ionicons name="close-circle" size={24} color={Colors.textMuted} />
                  </TouchableOpacity>
                </View>

                <View style={styles.modalHeaderRow}>
                  <StatusBadge label={selectedViolation.severity} type="severity" />
                  <StatusBadge label={selectedViolation.status} type="status" />
                </View>

                <Text style={styles.modalIssueTitle}>{selectedViolation.title}</Text>
                <Text style={styles.modalLoc}>Location: {selectedViolation.location}</Text>
                <Text style={styles.modalDesc}>{selectedViolation.description}</Text>

                {selectedViolation.photoPlaceholder && (
                  <View style={styles.largeImgWrapper}>
                    <Image source={{ uri: selectedViolation.photoPlaceholder }} style={styles.largeImg} />
                    <Text style={styles.imgCaption}>Initial Field Inspection Evidence</Text>
                  </View>
                )}

                <View style={styles.modalInfoGrid}>
                  <Text style={styles.infoLabel}>Category: <Text style={styles.infoValue}>{selectedViolation.category}</Text></Text>
                  <Text style={styles.infoLabel}>Responsible Dept: <Text style={styles.infoValue}>{selectedViolation.responsibleDepartment}</Text></Text>
                  <Text style={styles.infoLabel}>Assigned Person: <Text style={styles.infoValue}>{selectedViolation.responsiblePerson}</Text></Text>
                  <Text style={styles.infoLabel}>Target Deadline: <Text style={styles.infoValue}>{selectedViolation.deadline}</Text></Text>
                </View>

                {selectedViolation.correctiveActionNote && (
                  <View style={styles.noteBox}>
                    <Text style={styles.noteTitle}>CORRECTIVE ACTION NOTE:</Text>
                    <Text style={styles.noteText}>{selectedViolation.correctiveActionNote}</Text>
                  </View>
                )}

                <View style={styles.modalActionRow}>
                  <TouchableOpacity
                    style={styles.actionBtnPrimary}
                    onPress={() => {
                      setSelectedViolation(null);
                      setActiveScreen('Actions');
                    }}
                  >
                    <Ionicons name="checkbox-outline" size={16} color={Colors.textDark} />
                    <Text style={styles.actionBtnPrimaryText}>MANAGE CORRECTIVE ACTION</Text>
                  </TouchableOpacity>

                  {selectedViolation.status === 'Completed' && (
                    <TouchableOpacity
                      style={styles.actionBtnSecondary}
                      onPress={() => {
                        setSelectedViolation(null);
                        setActiveScreen('ReInspection');
                      }}
                    >
                      <Ionicons name="git-compare-outline" size={16} color={Colors.primary} />
                      <Text style={styles.actionBtnSecondaryText}>CONDUCT RE-INSPECTION</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>

      {/* Log New Violation Modal */}
      <Modal visible={isLogModalOpen} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Report Field Incident</Text>
                <TouchableOpacity onPress={() => setIsLogModalOpen(false)}>
                  <Ionicons name="close-circle" size={24} color={Colors.textMuted} />
                </TouchableOpacity>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Incident / Issue Title</Text>
                <TextInput
                  style={styles.textInput}
                  value={newTitle}
                  onChangeText={setNewTitle}
                  placeholder="e.g. Unsecured Cable on Bench 2"
                  placeholderTextColor={Colors.textMuted}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Category</Text>
                <View style={styles.chipRow}>
                  {(['Safety', 'Environment', 'Production', 'Maintenance'] as const).map((cat) => (
                    <TouchableOpacity
                      key={cat}
                      style={[styles.miniChip, newCategory === cat && styles.miniChipActive]}
                      onPress={() => setNewCategory(cat)}
                    >
                      <Text style={[styles.miniChipText, newCategory === cat && styles.miniChipTextActive]}>{cat}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Mine Location</Text>
                <TextInput
                  style={styles.textInput}
                  value={newLocation}
                  onChangeText={setNewLocation}
                  placeholder="e.g. Haul Road Junction 4"
                  placeholderTextColor={Colors.textMuted}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Description</Text>
                <TextInput
                  style={[styles.textInput, { height: 70 }]}
                  value={newDesc}
                  onChangeText={setNewDesc}
                  multiline
                  placeholder="Detailed observations..."
                  placeholderTextColor={Colors.textMuted}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Severity Level</Text>
                <View style={styles.chipRow}>
                  {(['Low', 'Medium', 'High', 'Critical'] as const).map((sev) => (
                    <TouchableOpacity key={sev} onPress={() => setNewSeverity(sev)} style={{ flex: 1 }}>
                      <StatusBadge label={sev} type="severity" size="small" />
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <PhotoPlaceholderPicker
                label="Attach Photo Evidence"
                initialPhoto={newPhoto}
                onPhotoSelected={setNewPhoto}
              />

              <TouchableOpacity style={styles.submitBtn} onPress={handleCreateViolation}>
                <Text style={styles.submitBtnText}>LOG VIOLATION TO SYSTEM</Text>
              </TouchableOpacity>
            </ScrollView>
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
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.cardBg,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
  },
  tabItem: {
    flex: 1,
    paddingVertical: 6,
    alignItems: 'center',
    borderRadius: 6,
  },
  tabItemActive: {
    backgroundColor: 'rgba(217, 119, 6, 0.15)',
  },
  tabText: {
    color: Colors.textMuted,
    fontSize: 12,
    fontWeight: '600',
  },
  tabTextActive: {
    color: Colors.primary,
    fontWeight: '800',
  },
  scrollContent: {
    padding: 14,
    paddingBottom: 40,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBg,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
    paddingHorizontal: 12,
    height: 42,
    gap: 8,
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    color: Colors.textPrimary,
    fontSize: 13,
  },
  logNewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 11,
    borderRadius: 10,
    marginBottom: 12,
    gap: 8,
  },
  logNewBtnText: {
    color: Colors.textDark,
    fontSize: 12,
    fontWeight: '900',
  },
  emptyCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: 12,
    padding: 30,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    marginTop: 20,
  },
  emptyTitle: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
    marginTop: 10,
  },
  emptySub: {
    color: Colors.textMuted,
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
  },
  card: {
    backgroundColor: Colors.cardBg,
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  catBadge: {
    backgroundColor: Colors.surfaceLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  catText: {
    color: Colors.textSecondary,
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  cardTitle: {
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
  },
  cardLoc: {
    color: Colors.textMuted,
    fontSize: 11,
    marginTop: 2,
  },
  cardDesc: {
    color: Colors.textSecondary,
    fontSize: 12,
    lineHeight: 16,
    marginTop: 4,
    marginBottom: 8,
  },
  thumbWrapper: {
    position: 'relative',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 8,
  },
  thumbnail: {
    width: '100%',
    height: 90,
  },
  photoTag: {
    position: 'absolute',
    bottom: 4,
    left: 4,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  photoTagText: {
    color: '#FFF',
    fontSize: 9,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
    paddingTop: 6,
  },
  deptText: {
    color: Colors.textMuted,
    fontSize: 11,
  },
  dateText: {
    color: Colors.textMuted,
    fontSize: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    justifyContent: 'center',
    padding: 16,
  },
  modalContent: {
    backgroundColor: Colors.cardBg,
    borderRadius: 16,
    padding: 18,
    maxHeight: '90%',
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
    fontSize: 17,
    fontWeight: '800',
  },
  modalHeaderRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  modalIssueTitle: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: '800',
  },
  modalLoc: {
    color: Colors.primary,
    fontSize: 12,
    marginTop: 2,
  },
  modalDesc: {
    color: Colors.textSecondary,
    fontSize: 13,
    marginVertical: 10,
    lineHeight: 18,
  },
  largeImgWrapper: {
    borderRadius: 10,
    overflow: 'hidden',
    marginVertical: 8,
  },
  largeImg: {
    width: '100%',
    height: 140,
  },
  imgCaption: {
    backgroundColor: Colors.surfaceLight,
    color: Colors.textMuted,
    fontSize: 10,
    padding: 4,
    textAlign: 'center',
  },
  modalInfoGrid: {
    backgroundColor: Colors.inputBg,
    padding: 12,
    borderRadius: 8,
    marginVertical: 10,
    gap: 4,
  },
  infoLabel: {
    color: Colors.textMuted,
    fontSize: 11,
  },
  infoValue: {
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  noteBox: {
    backgroundColor: 'rgba(217, 119, 6, 0.1)',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(217, 119, 6, 0.3)',
    marginVertical: 8,
  },
  noteTitle: {
    color: Colors.primary,
    fontSize: 11,
    fontWeight: '800',
  },
  noteText: {
    color: Colors.textPrimary,
    fontSize: 12,
    marginTop: 2,
  },
  modalActionRow: {
    gap: 8,
    marginTop: 14,
  },
  actionBtnPrimary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 6,
  },
  actionBtnPrimaryText: {
    color: Colors.textDark,
    fontSize: 12,
    fontWeight: '900',
  },
  actionBtnSecondary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(217, 119, 6, 0.15)',
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.primary,
    gap: 6,
  },
  actionBtnSecondaryText: {
    color: Colors.primary,
    fontSize: 12,
    fontWeight: '800',
  },
  inputGroup: {
    marginBottom: 10,
  },
  inputLabel: {
    color: Colors.textSecondary,
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  textInput: {
    backgroundColor: Colors.inputBg,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
    paddingHorizontal: 10,
    paddingVertical: 8,
    color: Colors.textPrimary,
    fontSize: 13,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  miniChip: {
    backgroundColor: Colors.inputBg,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
  },
  miniChipActive: {
    backgroundColor: 'rgba(217, 119, 6, 0.2)',
    borderColor: Colors.primary,
  },
  miniChipText: {
    color: Colors.textMuted,
    fontSize: 11,
  },
  miniChipTextActive: {
    color: Colors.primary,
    fontWeight: '800',
  },
  submitBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  submitBtnText: {
    color: Colors.textDark,
    fontSize: 13,
    fontWeight: '900',
  },
});
