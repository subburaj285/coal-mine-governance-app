import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { Colors } from '../theme/colors';
import { StatusBadge } from '../components/StatusBadge';
import { GPSBadge } from '../components/GPSBadge';
import { Worker } from '../types';

export const AttendanceScreen: React.FC = () => {
  const { workers, attendanceSummary, toggleWorkerAttendance } = useApp();
  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterContractor, setFilterContractor] = useState('All');

  const contractors = ['All', ...Array.from(new Set(workers.map((w) => w.contractor)))];

  const filteredWorkers = workers.filter((w) => {
    const matchesSearch =
      w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.workerId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.role.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesContractor = filterContractor === 'All' || w.contractor === filterContractor;
    return matchesSearch && matchesContractor;
  });

  const presentCount = workers.filter((w) => w.status === 'Present').length;
  const absentCount = workers.filter((w) => w.status === 'Absent').length;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Top Shift Header */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryTopRow}>
            <View>
              <Text style={styles.summaryTitle}>SHIFT A ATTENDANCE REGISTER</Text>
              <Text style={styles.summaryMine}>{attendanceSummary.mineName}</Text>
            </View>
            <View style={styles.dateTag}>
              <Ionicons name="calendar-outline" size={14} color={Colors.primary} />
              <Text style={styles.dateText}>{attendanceSummary.date}</Text>
            </View>
          </View>

          {/* GPS Info */}
          <GPSBadge location={attendanceSummary.gpsLocation} />

          {/* Counter Badges */}
          <View style={styles.counterRow}>
            <View style={[styles.counterBox, { borderColor: Colors.cardBorder }]}>
              <Text style={styles.counterLabel}>Total Roster</Text>
              <Text style={[styles.counterValue, { color: Colors.textPrimary }]}>
                {workers.length}
              </Text>
            </View>

            <View style={[styles.counterBox, { borderColor: 'rgba(22, 163, 74, 0.4)' }]}>
              <Text style={styles.counterLabel}>Present</Text>
              <Text style={[styles.counterValue, { color: Colors.success }]}>{presentCount}</Text>
            </View>

            <View style={[styles.counterBox, { borderColor: 'rgba(220, 38, 38, 0.4)' }]}>
              <Text style={styles.counterLabel}>Absent</Text>
              <Text style={[styles.counterValue, { color: Colors.critical }]}>{absentCount}</Text>
            </View>
          </View>
        </View>

        {/* Search & Contractor Filter */}
        <View style={styles.searchSection}>
          <View style={styles.searchBox}>
            <Ionicons name="search-outline" size={18} color={Colors.textMuted} />
            <TextInput
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search worker by name, ID or role..."
              placeholderTextColor={Colors.textMuted}
            />
            {searchQuery !== '' && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={18} color={Colors.textMuted} />
              </TouchableOpacity>
            )}
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.contractorScroll}>
            {contractors.map((c) => (
              <TouchableOpacity
                key={c}
                style={[styles.cChip, filterContractor === c && styles.cChipActive]}
                onPress={() => setFilterContractor(c)}
              >
                <Text style={[styles.cChipText, filterContractor === c && styles.cChipTextActive]}>
                  {c}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Worker List Section */}
        <View style={styles.listHeaderRow}>
          <Text style={styles.sectionHeading}>PIT WORKERS & CONTRACTORS ({filteredWorkers.length})</Text>
          <Text style={styles.subText}>Tap toggle button to mark attendance</Text>
        </View>

        {filteredWorkers.map((worker) => {
          const isPresent = worker.status === 'Present';
          return (
            <View key={worker.id} style={styles.workerCard}>
              <TouchableOpacity
                style={styles.workerInfoArea}
                onPress={() => setSelectedWorker(worker)}
                activeOpacity={0.7}
              >
                <View style={styles.avatarBox}>
                  <Text style={styles.avatarInitial}>{worker.name.charAt(0)}</Text>
                </View>

                <View style={styles.workerDetails}>
                  <View style={styles.workerNameRow}>
                    <Text style={styles.workerName}>{worker.name}</Text>
                    <Text style={styles.workerId}>({worker.workerId})</Text>
                  </View>
                  <Text style={styles.contractorText}>
                    <Ionicons name="business-outline" size={11} color={Colors.textMuted} />{' '}
                    {worker.contractor}
                  </Text>
                  <View style={styles.entryRow}>
                    <Ionicons name="time-outline" size={11} color={Colors.textMuted} />
                    <Text style={styles.entryText}>
                      Entry: <Text style={{ color: isPresent ? Colors.success : Colors.textMuted }}>{worker.entryTime}</Text>
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>

              <View style={styles.actionColumn}>
                <StatusBadge label={worker.status} type="status" size="small" />
                <TouchableOpacity
                  style={[
                    styles.toggleBtn,
                    isPresent ? styles.toggleBtnAbsent : styles.toggleBtnPresent,
                  ]}
                  onPress={() => toggleWorkerAttendance(worker.id)}
                  activeOpacity={0.8}
                >
                  <Ionicons
                    name={isPresent ? 'close' : 'checkmark'}
                    size={14}
                    color="#FFF"
                  />
                  <Text style={styles.toggleBtnText}>
                    {isPresent ? 'Mark Absent' : 'Mark Present'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      </ScrollView>

      {/* Worker Detail Modal */}
      <Modal visible={!!selectedWorker} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            {selectedWorker && (
              <>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Worker Field Profile</Text>
                  <TouchableOpacity onPress={() => setSelectedWorker(null)}>
                    <Ionicons name="close-circle" size={24} color={Colors.textMuted} />
                  </TouchableOpacity>
                </View>

                <View style={styles.profileHeader}>
                  <View style={styles.largeAvatar}>
                    <Text style={styles.largeAvatarText}>{selectedWorker.name.charAt(0)}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.modalWorkerName}>{selectedWorker.name}</Text>
                    <Text style={styles.modalWorkerRole}>{selectedWorker.role}</Text>
                    <StatusBadge label={selectedWorker.status} type="status" size="small" />
                  </View>
                </View>

                <View style={styles.infoGrid}>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Worker ID:</Text>
                    <Text style={styles.infoVal}>{selectedWorker.workerId}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Contractor Agency:</Text>
                    <Text style={styles.infoVal}>{selectedWorker.contractor}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Entry Timestamp:</Text>
                    <Text style={styles.infoVal}>{selectedWorker.entryTime}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Contact Number:</Text>
                    <Text style={styles.infoVal}>{selectedWorker.contactNumber}</Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.modalCloseBtn}
                  onPress={() => setSelectedWorker(null)}
                >
                  <Text style={styles.modalCloseText}>CLOSE PROFILE</Text>
                </TouchableOpacity>
              </>
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
    padding: 14,
    paddingBottom: 40,
  },
  summaryCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    marginBottom: 12,
  },
  summaryTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  summaryTitle: {
    color: Colors.primary,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  summaryMine: {
    color: Colors.textPrimary,
    fontSize: 15,
    fontWeight: '700',
    marginTop: 2,
  },
  dateTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  dateText: {
    color: Colors.textSecondary,
    fontSize: 11,
    fontWeight: '600',
  },
  counterRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },
  counterBox: {
    flex: 1,
    backgroundColor: Colors.inputBg,
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  counterLabel: {
    color: Colors.textMuted,
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  counterValue: {
    fontSize: 17,
    fontWeight: '800',
    marginTop: 2,
  },
  searchSection: {
    marginBottom: 12,
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
    marginBottom: 8,
  },
  searchInput: {
    flex: 1,
    color: Colors.textPrimary,
    fontSize: 13,
  },
  contractorScroll: {
    flexDirection: 'row',
    gap: 6,
  },
  cChip: {
    backgroundColor: Colors.cardBg,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    marginRight: 6,
  },
  cChipActive: {
    backgroundColor: 'rgba(217, 119, 6, 0.15)',
    borderColor: Colors.primary,
  },
  cChipText: {
    color: Colors.textMuted,
    fontSize: 11,
    fontWeight: '600',
  },
  cChipTextActive: {
    color: Colors.primary,
    fontWeight: '800',
  },
  listHeaderRow: {
    marginBottom: 10,
  },
  sectionHeading: {
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  subText: {
    color: Colors.textMuted,
    fontSize: 11,
    marginTop: 1,
  },
  workerCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  workerInfoArea: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  avatarBox: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    marginRight: 10,
  },
  avatarInitial: {
    color: Colors.primary,
    fontSize: 15,
    fontWeight: '800',
  },
  workerDetails: {
    flex: 1,
  },
  workerNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  workerName: {
    color: Colors.textPrimary,
    fontSize: 13,
    fontWeight: '700',
  },
  workerId: {
    color: Colors.textMuted,
    fontSize: 11,
  },
  contractorText: {
    color: Colors.textSecondary,
    fontSize: 11,
    marginTop: 1,
  },
  entryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 1,
  },
  entryText: {
    color: Colors.textMuted,
    fontSize: 10,
  },
  actionColumn: {
    alignItems: 'flex-end',
    gap: 6,
  },
  toggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 6,
    gap: 4,
  },
  toggleBtnPresent: {
    backgroundColor: Colors.success,
  },
  toggleBtnAbsent: {
    backgroundColor: Colors.critical,
  },
  toggleBtnText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    justifyContent: 'center',
    padding: 16,
  },
  modalCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  modalTitle: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: '800',
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  largeAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  largeAvatarText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '900',
  },
  modalWorkerName: {
    color: Colors.textPrimary,
    fontSize: 15,
    fontWeight: '700',
  },
  modalWorkerRole: {
    color: Colors.primary,
    fontSize: 12,
    marginBottom: 4,
  },
  infoGrid: {
    gap: 8,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.04)',
  },
  infoLabel: {
    color: Colors.textMuted,
    fontSize: 12,
  },
  infoVal: {
    color: Colors.textPrimary,
    fontSize: 12,
    fontWeight: '600',
  },
  modalCloseBtn: {
    backgroundColor: Colors.surfaceLight,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  modalCloseText: {
    color: Colors.textPrimary,
    fontSize: 12,
    fontWeight: '800',
  },
});
