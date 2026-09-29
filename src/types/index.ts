export type UserRole =
  | 'Supervisor'
  | 'Safety Officer'
  | 'Environment Officer'
  | 'Production Officer'
  | 'Maintenance Engineer';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  employeeId: string;
  department: string;
  mineName: string;
  shift: string;
  avatarUrl?: string;
}

export interface Worker {
  id: string;
  name: string;
  workerId: string;
  contractor: string;
  status: 'Present' | 'Absent';
  entryTime: string;
  role: string;
  contactNumber: string;
}

export interface AttendanceSummary {
  mineName: string;
  date: string;
  shift: string;
  totalWorkers: number;
  presentCount: number;
  absentCount: number;
  gpsLocation: string;
  lastUpdated: string;
}

export interface InspectionCheckitem {
  id: string;
  label: string;
  passed: boolean;
  comment?: string;
}

export interface Inspection {
  id: string;
  title: string;
  type: 'Safety' | 'Environmental';
  mineArea: string;
  status: 'Completed' | 'Draft' | 'Pending Review';
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  checklists: InspectionCheckitem[];
  observation: string;
  photoPlaceholder: string;
  gpsPlaceholder: string;
  timestamp: string;
  inspectorName: string;
}

export interface Violation {
  id: string;
  title: string;
  category: 'Safety' | 'Environment' | 'Production' | 'Maintenance';
  location: string;
  description: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Open' | 'Assigned' | 'In Progress' | 'Completed' | 'Verified' | 'Closed' | 'Reopened';
  responsibleDepartment: string;
  responsiblePerson: string;
  deadline: string;
  photoPlaceholder?: string;
  newEvidencePlaceholder?: string;
  correctiveActionNote?: string;
  reinspectionNote?: string;
  date: string;
}

export interface CorrectiveAction {
  id: string;
  issueId: string;
  issueTitle: string;
  responsiblePerson: string;
  responsibleDepartment: string;
  requiredAction: string;
  deadline: string;
  status: 'Open' | 'In Progress' | 'Completed' | 'Verified' | 'Reopened';
  evidencePlaceholder?: string;
}

export interface MachineryIssue {
  id: string;
  machineId: string;
  machineName: string;
  location: string;
  issueTitle: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Assigned' | 'In Progress' | 'Completed';
  assignedTo: string;
  evidencePlaceholder?: string;
  date: string;
  overdue: boolean;
}

export interface TruckDispatch {
  id: string;
  truckId: string;
  driverName: string;
  loadingStatus: 'Loading' | 'Weighed' | 'In Transit' | 'Dispatched' | 'Delivered';
  weightTonnes: number;
  destination: string;
  status: 'Normal' | 'Delayed' | 'Completed';
  time: string;
}

export interface ProductionSummary {
  mineArea: string;
  shift: string;
  dailyTargetTonnes: number;
  actualProductionTonnes: number;
  deviationTonnes: number;
  status: 'On Target' | 'Behind Schedule' | 'Exceeded';
}

export interface NotificationItem {
  id: string;
  type: 'critical' | 'warning' | 'info' | 'success';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  targetScreen?: string;
}

export interface ComplianceDocument {
  id: string;
  title: string;
  fileName: string;
  fileSize: string;
  uploadedAt: string;
  category: 'Safety Audit' | 'Environmental Monitoring' | 'DGMS Compliance' | 'Equipment Manual';
  extractedText: string;
  documentType: string;
}
