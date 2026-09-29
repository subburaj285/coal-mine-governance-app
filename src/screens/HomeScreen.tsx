import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { Colors } from '../theme/colors';
import { MetricCard } from '../components/MetricCard';
import { SectionHeader } from '../components/SectionHeader';
import { StatusBadge } from '../components/StatusBadge';
import { GPSBadge } from '../components/GPSBadge';

export const HomeScreen: React.FC = () => {
  const {
    activeRole,
    workers,
    attendanceSummary,
    inspections,
    violations,
    correctiveActions,
    machineryIssues,
    productionSummary,
    dispatches,
    setActiveScreen,
  } = useApp();

  // Helper counts
  const presentCount = workers.filter((w) => w.status === 'Present').length;
  const absentCount = workers.filter((w) => w.status === 'Absent').length;

  const openIssues = violations.filter((v) => v.status === 'Open' || v.status === 'Reopened');
  const highRiskIssues = violations.filter((v) => (v.severity === 'High' || v.severity === 'Critical') && v.status !== 'Closed');
  const pendingActions = correctiveActions.filter((a) => a.status === 'Open' || a.status === 'In Progress');
  const pendingReinspections = violations.filter((v) => v.status === 'Completed');

  const pendingRepairs = machineryIssues.filter((m) => m.status === 'Assigned' || m.status === 'In Progress');
  const overdueRepairs = machineryIssues.filter((m) => m.overdue);
  const completedRepairs = machineryIssues.filter((m) => m.status === 'Completed');

  const renderDashboardCards = () => {
    switch (activeRole) {
      case 'Supervisor':
        return (
          <View style={styles.gridContainer}>
            <View style={styles.gridRow}>
              <MetricCard
                title="Workers Today"
                value={attendanceSummary.totalWorkers}
                subtext="Total Enrolled Shift A"
                iconName="people"
                color={Colors.supervisor}
                onPress={() => setActiveScreen('Attendance')}
              />
              <MetricCard
                title="Present"
                value={presentCount}
                subtext="Shift On-Site"
                iconName="checkmark-circle"
                color={Colors.success}
                onPress={() => setActiveScreen('Attendance')}
              />
            </View>
            <View style={styles.gridRow}>
              <MetricCard
                title="Absent"
                value={absentCount}
                subtext="Requires Backup"
                iconName="close-circle"
                color={Colors.critical}
                onPress={() => setActiveScreen('Attendance')}
              />
              <MetricCard
                title="Open Issues"
                value={openIssues.length}
                subtext="Field Violations"
                iconName="warning"
                color={Colors.high}
                onPress={() => setActiveScreen('Violations')}
              />
            </View>
            <View style={styles.gridRowSingle}>
              <MetricCard
                title="Pending Actions"
                value={pendingActions.length}
                subtext="Assigned Shift Actions"
                iconName="checkbox"
                color={Colors.primary}
                onPress={() => setActiveScreen('Actions')}
              />
            </View>
          </View>
        );

      case 'Safety Officer':
        return (
          <View style={styles.gridContainer}>
            <View style={styles.gridRow}>
              <MetricCard
                title="Today's Audits"
                value={inspections.length}
                subtext="Safety & DGMS Checks"
                iconName="shield-checkmark"
                color={Colors.safety}
                onPress={() => setActiveScreen('SafetyInspection')}
              />
              <MetricCard
                title="Open Safety"
                value={openIssues.length}
                subtext="Unresolved Field Hazards"
                iconName="alert-circle"
                color={Colors.critical}
                onPress={() => setActiveScreen('Violations')}
              />
            </View>
            <View style={styles.gridRow}>
              <MetricCard
                title="High Risk"
                value={highRiskIssues.length}
                subtext="Urgent Attention Required"
                iconName="warning"
                color={Colors.high}
                onPress={() => setActiveScreen('Violations')}
              />
              <MetricCard
                title="Pending Re-inspect"
                value={pendingReinspections.length}
                subtext="Awaiting Verification"
                iconName="git-compare"
                color={Colors.info}
                onPress={() => setActiveScreen('ReInspection')}
              />
            </View>
          </View>
        );

      case 'Environment Officer':
        return (
          <View style={styles.gridContainer}>
            <View style={styles.gridRow}>
              <MetricCard
                title="Env Audits"
                value={inspections.filter((i) => i.type === 'Environmental').length + 2}
                subtext="Air / Water / Sludge"
                iconName="leaf"
                color={Colors.environment}
                onPress={() => setActiveScreen('EnvironmentInspection')}
              />
              <MetricCard
                title="Open Issues"
                value={violations.filter((v) => v.category === 'Environment' && v.status !== 'Closed').length}
                subtext="Non-Compliance Cases"
                iconName="warning"
                color={Colors.high}
                onPress={() => setActiveScreen('Violations')}
              />
            </View>
            <View style={styles.gridRow}>
              <MetricCard
                title="High Risk Areas"
                value={1}
                subtext="Settling Pond Sludge"
                iconName="water"
                color={Colors.critical}
                onPress={() => setActiveScreen('EnvironmentInspection')}
              />
              <MetricCard
                title="Pending Actions"
                value={pendingActions.length}
                subtext="Corrective Measures"
                iconName="checkbox"
                color={Colors.primary}
                onPress={() => setActiveScreen('Actions')}
              />
            </View>
          </View>
        );

      case 'Production Officer':
        return (
          <View style={styles.gridContainer}>
            <View style={styles.gridRow}>
              <MetricCard
                title="Today's Actual"
                value={`${(productionSummary.actualProductionTonnes / 1000).toFixed(1)}k T`}
                subtext="Coal Mined Shift A"
                iconName="bar-chart"
                color={Colors.production}
                onPress={() => setActiveScreen('Production')}
              />
              <MetricCard
                title="Target"
                value={`${(productionSummary.dailyTargetTonnes / 1000).toFixed(1)}k T`}
                subtext="Shift Objective"
                iconName="flag"
                color={Colors.primary}
                onPress={() => setActiveScreen('Production')}
              />
            </View>
            <View style={styles.gridRow}>
              <MetricCard
                title="Dispatch Trucks"
                value={`${dispatches.filter((d) => d.loadingStatus === 'Dispatched' || d.loadingStatus === 'In Transit').length} Active`}
                subtext={`${dispatches.length} Total Vehicles`}
                iconName="bus"
                color={Colors.info}
                onPress={() => setActiveScreen('Dispatch')}
              />
              <MetricCard
                title="Plan Deviation"
                value={`${Math.abs(productionSummary.deviationTonnes)} T`}
                subtext="Behind Schedule (-15%)"
                iconName="trending-down"
                color={Colors.critical}
                onPress={() => setActiveScreen('Production')}
              />
            </View>
          </View>
        );

      case 'Maintenance Engineer':
        return (
          <View style={styles.gridContainer}>
            <View style={styles.gridRow}>
              <MetricCard
                title="Assigned Issues"
                value={machineryIssues.length}
                subtext="Heavy Fleet & Belts"
                iconName="construct"
                color={Colors.maintenance}
                onPress={() => setActiveScreen('Machinery')}
              />
              <MetricCard
                title="Pending Repairs"
                value={pendingRepairs.length}
                subtext="Work Orders Active"
                iconName="build"
                color={Colors.high}
                onPress={() => setActiveScreen('Machinery')}
              />
            </View>
            <View style={styles.gridRow}>
              <MetricCard
                title="Overdue Actions"
                value={overdueRepairs.length}
                subtext="Escalated DGMS Alert"
                iconName="alarm"
                color={Colors.critical}
                onPress={() => setActiveScreen('Machinery')}
              />
              <MetricCard
                title="Completed"
                value={completedRepairs.length}
                subtext="Verified Machinery"
                iconName="checkmark-done"
                color={Colors.success}
                onPress={() => setActiveScreen('Machinery')}
              />
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  const renderQuickActions = () => {
    return (
      <View style={styles.actionCard}>
        <Text style={styles.actionHeaderTitle}>FIELD QUICK OPERATIONS</Text>
        <View style={styles.actionGrid}>
          {activeRole === 'Supervisor' && (
            <>
              <TouchableOpacity style={styles.actionItem} onPress={() => setActiveScreen('Attendance')}>
                <View style={[styles.actionIcon, { backgroundColor: 'rgba(245, 158, 11, 0.15)' }]}>
                  <Ionicons name="clipboard" size={20} color={Colors.supervisor} />
                </View>
                <Text style={styles.actionLabel}>Attendance</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionItem} onPress={() => setActiveScreen('Violations')}>
                <View style={[styles.actionIcon, { backgroundColor: 'rgba(239, 68, 68, 0.15)' }]}>
                  <Ionicons name="warning" size={20} color={Colors.critical} />
                </View>
                <Text style={styles.actionLabel}>Report Issue</Text>
              </TouchableOpacity>
            </>
          )}

          {activeRole === 'Safety Officer' && (
            <>
              <TouchableOpacity style={styles.actionItem} onPress={() => setActiveScreen('SafetyInspection')}>
                <View style={[styles.actionIcon, { backgroundColor: 'rgba(239, 68, 68, 0.15)' }]}>
                  <Ionicons name="shield-checkmark" size={20} color={Colors.safety} />
                </View>
                <Text style={styles.actionLabel}>New Inspection</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionItem} onPress={() => setActiveScreen('ReInspection')}>
                <View style={[styles.actionIcon, { backgroundColor: 'rgba(59, 130, 246, 0.15)' }]}>
                  <Ionicons name="git-compare" size={20} color={Colors.info} />
                </View>
                <Text style={styles.actionLabel}>Re-Inspect</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionItem} onPress={() => setActiveScreen('Documents')}>
                <View style={[styles.actionIcon, { backgroundColor: 'rgba(16, 185, 129, 0.15)' }]}>
                  <Ionicons name="scan" size={20} color={Colors.success} />
                </View>
                <Text style={styles.actionLabel}>Scan Document</Text>
              </TouchableOpacity>
            </>
          )}

          {activeRole === 'Environment Officer' && (
            <>
              <TouchableOpacity style={styles.actionItem} onPress={() => setActiveScreen('EnvironmentInspection')}>
                <View style={[styles.actionIcon, { backgroundColor: 'rgba(16, 185, 129, 0.15)' }]}>
                  <Ionicons name="leaf" size={20} color={Colors.environment} />
                </View>
                <Text style={styles.actionLabel}>Env Audit</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionItem} onPress={() => setActiveScreen('Documents')}>
                <View style={[styles.actionIcon, { backgroundColor: 'rgba(245, 158, 11, 0.15)' }]}>
                  <Ionicons name="document-text" size={20} color={Colors.primary} />
                </View>
                <Text style={styles.actionLabel}>Clearances</Text>
              </TouchableOpacity>
            </>
          )}

          {activeRole === 'Production Officer' && (
            <>
              <TouchableOpacity style={styles.actionItem} onPress={() => setActiveScreen('Production')}>
                <View style={[styles.actionIcon, { backgroundColor: 'rgba(59, 130, 246, 0.15)' }]}>
                  <Ionicons name="bar-chart" size={20} color={Colors.production} />
                </View>
                <Text style={styles.actionLabel}>Log Output</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionItem} onPress={() => setActiveScreen('Dispatch')}>
                <View style={[styles.actionIcon, { backgroundColor: 'rgba(245, 158, 11, 0.15)' }]}>
                  <Ionicons name="bus" size={20} color={Colors.primary} />
                </View>
                <Text style={styles.actionLabel}>Dispatch Log</Text>
              </TouchableOpacity>
            </>
          )}

          {activeRole === 'Maintenance Engineer' && (
            <>
              <TouchableOpacity style={styles.actionItem} onPress={() => setActiveScreen('Machinery')}>
                <View style={[styles.actionIcon, { backgroundColor: 'rgba(139, 92, 246, 0.15)' }]}>
                  <Ionicons name="construct" size={20} color={Colors.maintenance} />
                </View>
                <Text style={styles.actionLabel}>Fleet Issues</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionItem} onPress={() => setActiveScreen('Actions')}>
                <View style={[styles.actionIcon, { backgroundColor: 'rgba(16, 185, 129, 0.15)' }]}>
                  <Ionicons name="camera" size={20} color={Colors.success} />
                </View>
                <Text style={styles.actionLabel}>Upload Repair</Text>
              </TouchableOpacity>
            </>
          )}

          <TouchableOpacity style={styles.actionItem} onPress={() => setActiveScreen('Notifications')}>
            <View style={[styles.actionIcon, { backgroundColor: 'rgba(255, 255, 255, 0.1)' }]}>
              <Ionicons name="notifications" size={20} color={Colors.textPrimary} />
            </View>
            <Text style={styles.actionLabel}>Alert Center</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* Header Info */}
      <GPSBadge />

      {/* Role Dashboard Cards */}
      <SectionHeader
        title={`${activeRole.toUpperCase()} DASHBOARD`}
        subtitle="Real-time field statistics & compliance KPIs"
      />
      {renderDashboardCards()}

      {/* Quick Action Bar */}
      {renderQuickActions()}

      {/* Recent Field Violations & Incidents Stream */}
      <SectionHeader
        title="CRITICAL FIELD INCIDENTS"
        subtitle="Active non-compliance & safety hazard tracking"
        actionLabel="View All"
        actionIcon="arrow-forward"
        onAction={() => setActiveScreen('Violations')}
      />

      {violations.slice(0, 3).map((v) => (
        <TouchableOpacity
          key={v.id}
          style={styles.incidentCard}
          onPress={() => setActiveScreen('Violations')}
          activeOpacity={0.8}
        >
          <View style={styles.incidentTop}>
            <View style={styles.titleWrapper}>
              <Text style={styles.incidentTitle}>{v.title}</Text>
              <Text style={styles.incidentLoc}>
                <Ionicons name="location-outline" size={12} color={Colors.textMuted} /> {v.location}
              </Text>
            </View>
            <StatusBadge label={v.severity} type="severity" size="small" />
          </View>
          <Text style={styles.incidentDesc} numberOfLines={2}>
            {v.description}
          </Text>
          <View style={styles.incidentFooter}>
            <Text style={styles.incidentDept}>{v.responsibleDepartment}</Text>
            <StatusBadge label={v.status} type="status" size="small" />
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
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
  gridContainer: {
    marginVertical: 4,
  },
  gridRow: {
    flexDirection: 'row',
    marginHorizontal: -4,
  },
  gridRowSingle: {
    flexDirection: 'row',
    marginHorizontal: -4,
  },
  actionCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: 14,
    padding: 16,
    marginVertical: 14,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  actionHeaderTitle: {
    color: Colors.textSecondary,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'flex-start',
  },
  actionItem: {
    alignItems: 'center',
    width: '29%',
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  actionLabel: {
    color: Colors.textPrimary,
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
  },
  incidentCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  incidentTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  titleWrapper: {
    flex: 1,
    marginRight: 8,
  },
  incidentTitle: {
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
  },
  incidentLoc: {
    color: Colors.textMuted,
    fontSize: 11,
    marginTop: 2,
  },
  incidentDesc: {
    color: Colors.textSecondary,
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 10,
  },
  incidentFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
    paddingTop: 8,
  },
  incidentDept: {
    color: Colors.textMuted,
    fontSize: 11,
    fontWeight: '500',
  },
});
