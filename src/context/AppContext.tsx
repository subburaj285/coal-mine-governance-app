import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  UserRole,
  Worker,
  AttendanceSummary,
  Inspection,
  Violation,
  CorrectiveAction,
  MachineryIssue,
  ProductionSummary,
  TruckDispatch,
  NotificationItem,
  ComplianceDocument,
} from '../types';
import {
  MOCK_USERS,
  MOCK_ATTENDANCE_SUMMARY,
  MOCK_WORKERS,
  MOCK_INSPECTIONS,
  MOCK_VIOLATIONS,
  MOCK_CORRECTIVE_ACTIONS,
  MOCK_MACHINERY_ISSUES,
  MOCK_PRODUCTION_SUMMARY,
  MOCK_TRUCK_DISPATCHES,
  MOCK_NOTIFICATIONS,
  MOCK_DOCUMENTS,
} from '../mock/mockData';
import { authService } from '../services/authService';
import { attendanceService } from '../services/attendanceService';
import { inspectionService } from '../services/inspectionService';
import { violationService } from '../services/violationService';
import { correctiveActionService } from '../services/correctiveActionService';
import { machineryService } from '../services/machineryService';
import { documentService } from '../services/documentService';
import { notificationService } from '../services/notificationService';

interface AppContextType {
  currentUser: User | null;
  activeRole: UserRole;
  activeScreen: string;
  workers: Worker[];
  attendanceSummary: AttendanceSummary;
  inspections: Inspection[];
  violations: Violation[];
  correctiveActions: CorrectiveAction[];
  machineryIssues: MachineryIssue[];
  productionSummary: ProductionSummary;
  dispatches: TruckDispatch[];
  notifications: NotificationItem[];
  documents: ComplianceDocument[];
  toastMessage: string | null;
  toastType: 'success' | 'info' | 'warning' | 'error' | null;

  // Actions
  login: (employeeId: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  setActiveScreen: (screen: string) => void;
  toggleWorkerAttendance: (workerId: string) => void;
  submitInspection: (data: Omit<Inspection, 'id' | 'timestamp'>) => Promise<void>;
  addViolation: (data: Omit<Violation, 'id' | 'date'>) => Promise<void>;
  updateActionStatus: (actionId: string, status: CorrectiveAction['status'], evidence?: string) => Promise<void>;
  reinspectIssue: (issueId: string, isSolved: boolean, note?: string) => Promise<void>;
  updateMachineryRepair: (issueId: string, status: MachineryIssue['status'], evidence?: string) => Promise<void>;
  addMockDocument: (title: string, category: ComplianceDocument['category']) => Promise<void>;
  markNotificationRead: (id: string) => void;
  showToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  hideToast: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(MOCK_USERS[0]);
  const [activeRole, setActiveRole] = useState<UserRole>('Supervisor');
  const [activeScreen, setActiveScreen] = useState<string>('Home');

  const [workers, setWorkers] = useState<Worker[]>(MOCK_WORKERS);
  const [attendanceSummary, setAttendanceSummary] = useState<AttendanceSummary>(MOCK_ATTENDANCE_SUMMARY);
  const [inspections, setInspections] = useState<Inspection[]>(MOCK_INSPECTIONS);
  const [violations, setViolations] = useState<Violation[]>(MOCK_VIOLATIONS);
  const [correctiveActions, setCorrectiveActions] = useState<CorrectiveAction[]>(MOCK_CORRECTIVE_ACTIONS);
  const [machineryIssues, setMachineryIssues] = useState<MachineryIssue[]>(MOCK_MACHINERY_ISSUES);
  const [productionSummary] = useState<ProductionSummary>(MOCK_PRODUCTION_SUMMARY);
  const [dispatches] = useState<TruckDispatch[]>(MOCK_TRUCK_DISPATCHES);
  const [notifications, setNotifications] = useState<NotificationItem[]>(MOCK_NOTIFICATIONS);
  const [documents, setDocuments] = useState<ComplianceDocument[]>(MOCK_DOCUMENTS);

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'info' | 'warning' | 'error' | null>(null);

  const showToast = (msg: string, type: 'success' | 'info' | 'warning' | 'error' = 'info') => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => {
      setToastMessage(null);
      setToastType(null);
    }, 3000);
  };

  const hideToast = () => {
    setToastMessage(null);
    setToastType(null);
  };

  const login = async (employeeId: string, password: string, role: UserRole) => {
    const user = await authService.login(employeeId, password, role);
    setCurrentUser(user);
    setActiveRole(role);
    setActiveScreen('Home');
    showToast(`Welcome back, ${user.name}! Switched to ${role} interface.`, 'success');
  };

  const logout = () => {
    authService.logout();
    setCurrentUser(null);
    setActiveScreen('Login');
    showToast('Logged out successfully', 'info');
  };

  const switchRole = (role: UserRole) => {
    const user = MOCK_USERS.find((u) => u.role === role) || MOCK_USERS[0];
    setCurrentUser(user);
    setActiveRole(role);
    setActiveScreen('Home');
    showToast(`Role view switched to ${role}`, 'info');
  };

  const toggleWorkerAttendance = async (workerId: string) => {
    const target = workers.find((w) => w.id === workerId);
    if (!target) return;
    const newStatus = target.status === 'Present' ? 'Absent' : 'Present';
    const updated = await attendanceService.updateWorkerStatus(workerId, newStatus);
    setWorkers(updated);

    const presentCount = updated.filter((w) => w.status === 'Present').length;
    const absentCount = updated.filter((w) => w.status === 'Absent').length;
    setAttendanceSummary((prev) => ({
      ...prev,
      presentCount,
      absentCount,
      lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }));

    showToast(`Worker ${target.name} marked as ${newStatus}`, 'success');
  };

  const submitInspection = async (data: Omit<Inspection, 'id' | 'timestamp'>) => {
    const newInsp = await inspectionService.submitInspection(data);
    setInspections([newInsp, ...inspections]);
    
    // Add a notification
    const newNotif: NotificationItem = {
      id: `n-${Date.now()}`,
      type: 'success',
      title: '🟢 Inspection Submitted',
      message: `New ${data.type} inspection logged for ${data.mineArea}.`,
      timestamp: 'Just now',
      isRead: false,
    };
    setNotifications([newNotif, ...notifications]);
    showToast(`${data.type} inspection submitted successfully!`, 'success');
  };

  const addViolation = async (data: Omit<Violation, 'id' | 'date'>) => {
    const newViol = await violationService.addViolation(data);
    setViolations([newViol, ...violations]);

    // Also create corresponding corrective action entry
    const newAction: CorrectiveAction = {
      id: `ca-${Date.now()}`,
      issueId: newViol.id,
      issueTitle: newViol.title,
      responsiblePerson: newViol.responsiblePerson,
      responsibleDepartment: newViol.responsibleDepartment,
      requiredAction: `Address non-compliance: ${newViol.description}`,
      deadline: newViol.deadline,
      status: 'Open',
    };
    setCorrectiveActions([newAction, ...correctiveActions]);

    showToast(`New ${newViol.severity} risk violation reported & logged`, 'warning');
  };

  const updateActionStatus = async (actionId: string, status: CorrectiveAction['status'], evidence?: string) => {
    const updated = await correctiveActionService.updateActionStatus(actionId, status, evidence);
    if (updated) {
      setCorrectiveActions(correctiveActions.map((ca) => (ca.id === actionId ? updated : ca)));
      // Update parent violation status
      setViolations(
        violations.map((v) => {
          if (v.id === updated.issueId) {
            return {
              ...v,
              status: status === 'Completed' ? 'Completed' : status === 'In Progress' ? 'In Progress' : v.status,
              correctiveActionNote: updated.requiredAction,
              newEvidencePlaceholder: evidence || v.newEvidencePlaceholder,
            };
          }
          return v;
        })
      );
      showToast(`Corrective action status updated to "${status}"`, 'success');
    }
  };

  const reinspectIssue = async (issueId: string, isSolved: boolean, note?: string) => {
    const target = violations.find((v) => v.id === issueId);
    if (!target) return;

    const newStatus: Violation['status'] = isSolved ? 'Verified' : 'Reopened';
    const updatedViol = await violationService.updateViolationStatus(
      issueId,
      newStatus,
      note || (isSolved ? 'Issue verified resolved in field re-inspection.' : 'Re-inspection failed. Issue remains unresolved.')
    );

    if (updatedViol) {
      setViolations(violations.map((v) => (v.id === issueId ? updatedViol : v)));
      // Also update corrective action status
      setCorrectiveActions(
        correctiveActions.map((ca) => {
          if (ca.issueId === issueId) {
            return { ...ca, status: isSolved ? 'Verified' : 'Reopened' };
          }
          return ca;
        })
      );
      if (isSolved) {
        showToast(`Issue ${target.title} verified & marked SOLVED (Closed)`, 'success');
      } else {
        showToast(`Issue ${target.title} marked NOT SOLVED (Reopened)`, 'error');
      }
    }
  };

  const updateMachineryRepair = async (issueId: string, status: MachineryIssue['status'], evidence?: string) => {
    const updated = await machineryService.updateRepairStatus(issueId, status, evidence);
    if (updated) {
      setMachineryIssues(machineryIssues.map((m) => (m.id === issueId ? updated : m)));
      showToast(`Machinery repair status updated to "${status}"`, 'success');
    }
  };

  const addMockDocument = async (title: string, category: ComplianceDocument['category']) => {
    const doc = await documentService.scanOrUploadDocument(title, category);
    setDocuments([doc, ...documents]);
    showToast(`Document "${doc.title}" processed with AI OCR!`, 'success');
  };

  const markNotificationRead = (id: string) => {
    notificationService.markAsRead(id);
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        activeRole,
        activeScreen,
        workers,
        attendanceSummary,
        inspections,
        violations,
        correctiveActions,
        machineryIssues,
        productionSummary,
        dispatches,
        notifications,
        documents,
        toastMessage,
        toastType,
        login,
        logout,
        switchRole,
        setActiveScreen,
        toggleWorkerAttendance,
        submitInspection,
        addViolation,
        updateActionStatus,
        reinspectIssue,
        updateMachineryRepair,
        addMockDocument,
        markNotificationRead,
        showToast,
        hideToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
