import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { Colors } from '../theme/colors';
import { StatusBadge } from '../components/StatusBadge';
import { GPSBadge } from '../components/GPSBadge';
import { MetricCard } from '../components/MetricCard';

export const ProductionScreen: React.FC = () => {
  const { productionSummary, dispatches, setActiveScreen } = useApp();
  const [activeTab, setActiveTab] = useState<'Overview' | 'Dispatch' | 'MineArea'>('Overview');

  const planned = productionSummary.dailyTargetTonnes;
  const actual = productionSummary.actualProductionTonnes;
  const deviation = actual - planned;
  const percentage = ((actual / planned) * 100).toFixed(1);

  return (
    <View style={styles.container}>
      {/* Top Segmented Tabs */}
      <View style={styles.topTabs}>
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'Overview' && styles.tabBtnActive]}
          onPress={() => setActiveTab('Overview')}
        >
          <Text style={[styles.tabText, activeTab === 'Overview' && styles.tabTextActive]}>
            Plan vs Actual
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'Dispatch' && styles.tabBtnActive]}
          onPress={() => setActiveTab('Dispatch')}
        >
          <Text style={[styles.tabText, activeTab === 'Dispatch' && styles.tabTextActive]}>
            Truck Dispatch ({dispatches.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'MineArea' && styles.tabBtnActive]}
          onPress={() => setActiveTab('MineArea')}
        >
          <Text style={[styles.tabText, activeTab === 'MineArea' && styles.tabTextActive]}>
            Mine Seams
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {activeTab === 'Overview' && (
          <>
            <GPSBadge location="23.8103° N, 86.4412° E (Coal Seam #4)" />

            {/* Plan vs Actual Hero Card */}
            <View style={styles.heroCard}>
              <View style={styles.heroHeader}>
                <View>
                  <Text style={styles.heroSubTitle}>SHIFT A MINING OUTPUT</Text>
                  <Text style={styles.heroTitle}>{productionSummary.mineArea}</Text>
                </View>
                <StatusBadge label={productionSummary.status} type="status" />
              </View>

              {/* Stat Comparison Big Display */}
              <View style={styles.statGrid}>
                <View style={styles.statBox}>
                  <Text style={styles.statLabel}>PLANNED TARGET</Text>
                  <Text style={styles.statNumber}>{(planned / 1000).toFixed(1)}k <Text style={styles.unitText}>Tonnes</Text></Text>
                </View>

                <View style={styles.statBox}>
                  <Text style={styles.statLabel}>ACTUAL EXTRACTED</Text>
                  <Text style={[styles.statNumber, { color: Colors.production }]}>
                    {(actual / 1000).toFixed(1)}k <Text style={styles.unitText}>Tonnes</Text>
                  </Text>
                </View>
              </View>

              {/* Progress bar */}
              <View style={styles.progressSection}>
                <View style={styles.progressLabelRow}>
                  <Text style={styles.progressText}>Target Achievement: {percentage}%</Text>
                  <Text style={[styles.deviationText, { color: Colors.critical }]}>
                    Deviation: {deviation.toLocaleString()} Tonnes
                  </Text>
                </View>
                <View style={styles.progressBarBg}>
                  <View style={[styles.progressBarFill, { width: `${percentage}%` as any }]} />
                </View>
              </View>

              <View style={styles.noteBox}>
                <Ionicons name="alert-circle-outline" size={16} color={Colors.high} />
                <Text style={styles.noteText}>
                  AI Operations Note: 1,500 tonnes shortfall due to 45-min conveyor C-12 trip earlier.
                </Text>
              </View>
            </View>

            {/* Seam Performance Cards */}
            <Text style={styles.sectionHeading}>PIT SEAM PERFORMANCE</Text>

            <View style={styles.seamCard}>
              <View style={styles.seamHeader}>
                <Text style={styles.seamTitle}>Seam #4 Main Open Cast Bench</Text>
                <Text style={styles.seamStat}>6,200 / 7,000 T</Text>
              </View>
              <Text style={styles.seamSub}>2 EX-04 Heavy Excavators Active • 14 Dumpers</Text>
            </View>

            <View style={styles.seamCard}>
              <View style={styles.seamHeader}>
                <Text style={styles.seamTitle}>Seam #3 South Underground Siding</Text>
                <Text style={styles.seamStat}>2,300 / 3,000 T</Text>
              </View>
              <Text style={styles.seamSub}>Conveyor Line B Active • Continuous Miner Unit 1</Text>
            </View>
          </>
        )}

        {activeTab === 'Dispatch' && (
          <>
            <View style={styles.dispatchHeader}>
              <Text style={styles.sectionHeading}>FLEET DISPATCH LOG</Text>
              <TouchableOpacity style={styles.addDispatchBtn}>
                <Ionicons name="add" size={16} color={Colors.textDark} />
                <Text style={styles.addDispatchText}>Log Truck</Text>
              </TouchableOpacity>
            </View>

            {dispatches.map((truck) => (
              <View key={truck.id} style={styles.truckCard}>
                <View style={styles.truckTop}>
                  <View style={styles.truckIdBox}>
                    <Ionicons name="bus" size={18} color={Colors.primary} />
                    <Text style={styles.truckIdText}>{truck.truckId}</Text>
                  </View>
                  <StatusBadge label={truck.loadingStatus} type="status" size="small" />
                </View>

                <View style={styles.truckGrid}>
                  <Text style={styles.truckLabel}>Driver: <Text style={styles.truckValue}>{truck.driverName}</Text></Text>
                  <Text style={styles.truckLabel}>Weight: <Text style={styles.truckValue}>{truck.weightTonnes} Tonnes</Text></Text>
                  <Text style={styles.truckLabel}>Destination: <Text style={styles.truckValue}>{truck.destination}</Text></Text>
                  <Text style={styles.truckLabel}>Gate Time: <Text style={styles.truckValue}>{truck.time}</Text></Text>
                </View>

                <View style={styles.truckFooter}>
                  <StatusBadge label={truck.status} type="status" size="small" />
                  <TouchableOpacity onPress={() => setActiveScreen('Violations')}>
                    <Text style={styles.reportDelayText}>Report Delay</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </>
        )}

        {activeTab === 'MineArea' && (
          <>
            <Text style={styles.sectionHeading}>MINE AREA SECTORS</Text>
            {[
              { area: 'Pit 4B - Main Bench', status: 'Active Extraction', trucks: 12, supervisor: 'Rajesh Kumar' },
              { area: 'Pit 3 - Underground Shaft', status: 'Maintenance Clearance', trucks: 4, supervisor: 'Anil Deshmukh' },
              { area: 'Washery Siding #1', status: 'Normal Operations', trucks: 8, supervisor: 'Vikram Singh' },
            ].map((a, i) => (
              <View key={i} style={styles.areaCard}>
                <Text style={styles.areaTitle}>{a.area}</Text>
                <Text style={styles.areaSub}>Status: {a.status} • Active Vehicles: {a.trucks}</Text>
                <Text style={styles.areaSup}>Shift Supervisor: {a.supervisor}</Text>
              </View>
            ))}
          </>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  topTabs: {
    flexDirection: 'row',
    backgroundColor: Colors.cardBg,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 6,
    alignItems: 'center',
    borderRadius: 6,
  },
  tabBtnActive: {
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
  },
  tabText: {
    color: Colors.textMuted,
    fontSize: 12,
    fontWeight: '600',
  },
  tabTextActive: {
    color: Colors.production,
    fontWeight: '800',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  heroCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: 14,
    padding: 16,
    marginVertical: 12,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  heroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  heroSubTitle: {
    color: Colors.textMuted,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  heroTitle: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: '800',
    marginTop: 2,
  },
  statGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 14,
  },
  statBox: {
    flex: 1,
    backgroundColor: Colors.inputBg,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  statLabel: {
    color: Colors.textMuted,
    fontSize: 10,
    fontWeight: '700',
  },
  statNumber: {
    color: Colors.primary,
    fontSize: 22,
    fontWeight: '900',
    marginTop: 4,
  },
  unitText: {
    fontSize: 12,
    color: Colors.textMuted,
    fontWeight: '500',
  },
  progressSection: {
    marginVertical: 6,
  },
  progressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  progressText: {
    color: Colors.textPrimary,
    fontSize: 12,
    fontWeight: '700',
  },
  deviationText: {
    fontSize: 11,
    fontWeight: '700',
  },
  progressBarBg: {
    height: 8,
    backgroundColor: Colors.inputBg,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.production,
    borderRadius: 4,
  },
  noteBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(249, 115, 22, 0.12)',
    padding: 10,
    borderRadius: 8,
    marginTop: 12,
    borderWidth: 1,
    borderColor: 'rgba(249, 115, 22, 0.3)',
  },
  noteText: {
    color: Colors.textPrimary,
    fontSize: 11,
    flex: 1,
  },
  sectionHeading: {
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: '800',
    marginVertical: 10,
    letterSpacing: 0.3,
  },
  seamCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  seamHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  seamTitle: {
    color: Colors.textPrimary,
    fontSize: 13,
    fontWeight: '700',
  },
  seamStat: {
    color: Colors.production,
    fontSize: 12,
    fontWeight: '800',
  },
  seamSub: {
    color: Colors.textMuted,
    fontSize: 11,
  },
  dispatchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  addDispatchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    gap: 4,
  },
  addDispatchText: {
    color: Colors.textDark,
    fontSize: 11,
    fontWeight: '800',
  },
  truckCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  truckTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  truckIdBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  truckIdText: {
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: '800',
  },
  truckGrid: {
    gap: 4,
    marginVertical: 6,
  },
  truckLabel: {
    color: Colors.textMuted,
    fontSize: 11,
  },
  truckValue: {
    color: Colors.textSecondary,
    fontWeight: '700',
  },
  truckFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
    paddingTop: 8,
    marginTop: 6,
  },
  reportDelayText: {
    color: Colors.critical,
    fontSize: 11,
    fontWeight: '700',
  },
  areaCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  areaTitle: {
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
  },
  areaSub: {
    color: Colors.textSecondary,
    fontSize: 11,
    marginTop: 2,
  },
  areaSup: {
    color: Colors.textMuted,
    fontSize: 10,
    marginTop: 2,
  },
});
