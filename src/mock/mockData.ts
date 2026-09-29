import {
  User,
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

export const MOCK_USERS: User[] = [
  {
    id: 'u1',
    name: 'Rajesh Kumar',
    employeeId: 'EMP-7809',
    role: 'Supervisor',
    department: 'Pit Operations',
    mineName: 'Jharia Coalfield Pit #4B',
    shift: 'Shift A (06:00 - 14:00)',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
  },
  {
    id: 'u2',
    name: 'Anil Deshmukh',
    employeeId: 'EMP-3204',
    role: 'Safety Officer',
    department: 'Safety & DGMS Compliance',
    mineName: 'Jharia Coalfield Pit #4B',
    shift: 'Shift A (06:00 - 14:00)',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
  },
  {
    id: 'u3',
    name: 'Dr. Sunita Rao',
    employeeId: 'EMP-4421',
    role: 'Environment Officer',
    department: 'Environmental Management',
    mineName: 'Jharia Coalfield Pit #4B',
    shift: 'Shift A (06:00 - 14:00)',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
  },
  {
    id: 'u4',
    name: 'Vikram Singh',
    employeeId: 'EMP-9912',
    role: 'Production Officer',
    department: 'Mining Operations',
    mineName: 'Jharia Coalfield Pit #4B',
    shift: 'Shift A (06:00 - 14:00)',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
  },
  {
    id: 'u5',
    name: 'Suresh Patil',
    employeeId: 'EMP-6150',
    role: 'Maintenance Engineer',
    department: 'Mechanical Maintenance',
    mineName: 'Jharia Coalfield Pit #4B',
    shift: 'Shift A (06:00 - 14:00)',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
  },
];

export const MOCK_ATTENDANCE_SUMMARY: AttendanceSummary = {
  mineName: 'Jharia Coalfield Pit #4B',
  date: '29 Sep 2026',
  shift: 'Shift A (06:00 - 14:00)',
  totalWorkers: 42,
  presentCount: 38,
  absentCount: 4,
  gpsLocation: '23.8103° N, 86.4412° E (Gate 2 Checkpoint)',
  lastUpdated: '06:15 AM today',
};

export const MOCK_WORKERS: Worker[] = [
  { id: 'w1', name: 'Ramesh Sharma', workerId: 'WRK-101', contractor: 'Eastern Mining Services', status: 'Present', entryTime: '05:48 AM', role: 'Excavator Operator', contactNumber: '+91 98765 43210' },
  { id: 'w2', name: 'Sanjay Yadav', workerId: 'WRK-102', contractor: 'Eastern Mining Services', status: 'Present', entryTime: '05:52 AM', role: 'Haul Truck Driver', contactNumber: '+91 98765 43211' },
  { id: 'w3', name: 'Manoj Verma', workerId: 'WRK-103', contractor: 'Bharat Infra Works', status: 'Absent', entryTime: '--', role: 'Blasting Helper', contactNumber: '+91 98765 43212' },
  { id: 'w4', name: 'Amitabh Sen', workerId: 'WRK-104', contractor: 'Bharat Infra Works', status: 'Present', entryTime: '06:01 AM', role: 'Conveyor Technician', contactNumber: '+91 98765 43213' },
  { id: 'w5', name: 'Prakash Mahato', workerId: 'WRK-105', contractor: 'Eastern Mining Services', status: 'Present', entryTime: '05:55 AM', role: 'Gas Monitor Operator', contactNumber: '+91 98765 43214' },
  { id: 'w6', name: 'Dharmendra Bauri', workerId: 'WRK-106', contractor: 'Coal Logistics Ltd', status: 'Absent', entryTime: '--', role: 'Pit Loader Specialist', contactNumber: '+91 98765 43215' },
  { id: 'w7', name: 'Deepak Roy', workerId: 'WRK-107', contractor: 'Coal Logistics Ltd', status: 'Present', entryTime: '05:50 AM', role: 'Safety Steward', contactNumber: '+91 98765 43216' },
  { id: 'w8', name: 'Subhash Mondal', workerId: 'WRK-108', contractor: 'Bharat Infra Works', status: 'Absent', entryTime: '--', role: 'Electrician', contactNumber: '+91 98765 43217' },
];

export const MOCK_INSPECTIONS: Inspection[] = [
  {
    id: 'insp-101',
    title: 'Pre-Shift Safety Audit - Underground Shaft 3',
    type: 'Safety',
    mineArea: 'Shaft 3 Pit Bottom',
    status: 'Completed',
    severity: 'High',
    checklists: [
      { id: 'chk-1', label: 'PPE Compliance (Helmet, Boots, Gas Detector)', passed: true },
      { id: 'chk-2', label: 'Machinery Guarding on Crusher B-4', passed: false, comment: 'Guard mesh loose near belt intake' },
      { id: 'chk-3', label: 'Electrical Switchgear Insulation & Earthing', passed: true },
      { id: 'chk-4', label: 'Emergency Evacuation Siren Test', passed: true },
      { id: 'chk-5', label: 'Work Area Gas Levels (Methane < 0.5%)', passed: true },
    ],
    observation: 'Crusher B-4 guarding requires immediate tightening before shift peak.',
    photoPlaceholder: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500',
    gpsPlaceholder: '23.8115° N, 86.4428° E (Elevation -180m)',
    timestamp: '2026-09-29 07:15 AM',
    inspectorName: 'Anil Deshmukh',
  },
  {
    id: 'insp-102',
    title: 'Environmental Compliance Audit - Settling Pond B',
    type: 'Environmental',
    mineArea: 'Effluent Treatment & Discharge Unit',
    status: 'Completed',
    severity: 'Medium',
    checklists: [
      { id: 'chk-21', label: 'Dust Suppression Cannon Sprays Active', passed: true },
      { id: 'chk-22', label: 'Water Discharge pH Balance (Target 6.5 - 7.5)', passed: true },
      { id: 'chk-23', label: 'Pollution Filter Sludge Accumulation Level', passed: false, comment: 'Sediment buildup exceeds 70%' },
      { id: 'chk-24', label: 'Waste Disposal & Hazardous Oil Trap Integrity', passed: true },
      { id: 'chk-25', label: 'Ambient Air Particulate PM10 Concentration', passed: true },
    ],
    observation: 'Sediment buildup in Settling Pond B filter bed requires desilting by evening.',
    photoPlaceholder: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500',
    gpsPlaceholder: '23.8090° N, 86.4390° E (Surface Area)',
    timestamp: '2026-09-29 08:30 AM',
    inspectorName: 'Dr. Sunita Rao',
  },
];

export const MOCK_VIOLATIONS: Violation[] = [
  {
    id: 'viol-501',
    title: 'Conveyor C-12 Safety Guard Damaged',
    category: 'Safety',
    location: 'Main Transfer Tower - Level 2',
    description: 'Steel safety mesh over drive pulley C-12 torn off. Exposes high-speed belt gear.',
    severity: 'High',
    status: 'In Progress',
    responsibleDepartment: 'Mechanical Maintenance',
    responsiblePerson: 'Suresh Patil (Maintenance Eng.)',
    deadline: '30 Sep 2026',
    photoPlaceholder: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=500',
    newEvidencePlaceholder: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500',
    correctiveActionNote: 'Replacement guard mesh cut and welded; securing lockbolts under installation.',
    date: '28 Sep 2026 14:20',
  },
  {
    id: 'viol-502',
    title: 'Uncontrolled Dust Cloud Near Haul Road 4',
    category: 'Environment',
    location: 'Haul Road Junction 4 West',
    description: 'Sprinkler truck #2 breakdown led to severe airborne coal dust during haulage.',
    severity: 'Medium',
    status: 'Assigned',
    responsibleDepartment: 'Environmental Management',
    responsiblePerson: 'Dr. Sunita Rao (Env Officer)',
    deadline: '29 Sep 2026',
    photoPlaceholder: 'https://images.unsplash.com/photo-1584467735815-f778f274e296?w=500',
    date: '29 Sep 2026 06:45',
  },
  {
    id: 'viol-503',
    title: 'Hydraulic Oil Leak on Excavator EX-04',
    category: 'Maintenance',
    location: 'Coal Bench #3 North',
    description: 'High pressure hydraulic hose weeping oil near exhaust manifold. Fire risk!',
    severity: 'Critical',
    status: 'Open',
    responsibleDepartment: 'Mechanical Maintenance',
    responsiblePerson: 'Suresh Patil (Maintenance Eng.)',
    deadline: '29 Sep 2026',
    photoPlaceholder: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=500',
    date: '29 Sep 2026 07:30',
  },
  {
    id: 'viol-504',
    title: 'Worker Without Respirator in High-Dust Zone',
    category: 'Safety',
    location: 'Crushing Plant Yard B',
    description: 'Contract worker observed operating bagging unit without N95 dust respirator.',
    severity: 'Low',
    status: 'Completed',
    responsibleDepartment: 'Safety & DGMS Compliance',
    responsiblePerson: 'Anil Deshmukh (Safety Off.)',
    deadline: '28 Sep 2026',
    photoPlaceholder: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=500',
    newEvidencePlaceholder: 'https://images.unsplash.com/photo-1584467735815-f778f274e296?w=500',
    correctiveActionNote: 'Safety mask issued, worker counseled and verified by Supervisor.',
    reinspectionNote: 'Verified during morning rounds. Worker wearing full gear.',
    date: '27 Sep 2026 11:10',
  },
];

export const MOCK_CORRECTIVE_ACTIONS: CorrectiveAction[] = [
  {
    id: 'ca-101',
    issueId: 'viol-501',
    issueTitle: 'Damaged Conveyor Guard (C-12)',
    responsiblePerson: 'Suresh Patil',
    responsibleDepartment: 'Mechanical Maintenance',
    requiredAction: 'Fabricate and install heavy-duty steel safety guard on drive pulley.',
    deadline: '30 Sep 2026',
    status: 'In Progress',
    evidencePlaceholder: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500',
  },
  {
    id: 'ca-102',
    issueId: 'viol-502',
    issueTitle: 'Uncontrolled Dust Cloud Haul Road 4',
    responsiblePerson: 'Dr. Sunita Rao',
    responsibleDepartment: 'Environmental Management',
    requiredAction: 'Deploy backup mist cannon vehicle and re-establish 15-min spraying cycle.',
    deadline: '29 Sep 2026',
    status: 'Open',
  },
  {
    id: 'ca-103',
    issueId: 'viol-503',
    issueTitle: 'Hydraulic Oil Leak Excavator EX-04',
    responsiblePerson: 'Suresh Patil',
    responsibleDepartment: 'Mechanical Maintenance',
    requiredAction: 'Lockout/Tagout machine EX-04, replace hydraulic high-temp hose assemblies.',
    deadline: '29 Sep 2026',
    status: 'Open',
  },
  {
    id: 'ca-104',
    issueId: 'viol-504',
    issueTitle: 'PPE Respirator Non-Compliance',
    responsiblePerson: 'Rajesh Kumar',
    responsibleDepartment: 'Pit Operations',
    requiredAction: 'Provide fresh N95 respirators to Crushing Plant team and re-verify PPE audit.',
    deadline: '28 Sep 2026',
    status: 'Completed',
    evidencePlaceholder: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=500',
  },
];

export const MOCK_MACHINERY_ISSUES: MachineryIssue[] = [
  {
    id: 'mach-1',
    machineId: 'C-12',
    machineName: 'Main Belt Conveyor C-12',
    location: 'Transfer Tower 2',
    issueTitle: 'Safety Guard Damaged & Vibration High',
    description: 'Drive motor bearing noise detected by AI sensor along with missing mesh guard.',
    priority: 'High',
    status: 'In Progress',
    assignedTo: 'Suresh Patil',
    evidencePlaceholder: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500',
    date: '28 Sep 2026',
    overdue: false,
  },
  {
    id: 'mach-2',
    machineId: 'EX-04',
    machineName: 'CAT 390F Heavy Excavator',
    location: 'Bench #3 Pit B',
    issueTitle: 'Hydraulic Pressure Fluctuation & Hose Leak',
    description: 'Main boom cylinder line leaking oil. Machine stopped for safety.',
    priority: 'Critical',
    status: 'Assigned',
    assignedTo: 'Suresh Patil',
    date: '29 Sep 2026',
    overdue: true,
  },
  {
    id: 'mach-3',
    machineId: 'DT-08',
    machineName: 'Volvo FMX 440 Dumper Truck',
    location: 'Workshop Bay 2',
    issueTitle: 'Brake Lining Wear Warning',
    description: 'Scheduled preventive brake pad replacement after 1000 hrs operation.',
    priority: 'Medium',
    status: 'Completed',
    assignedTo: 'Suresh Patil',
    evidencePlaceholder: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=500',
    date: '27 Sep 2026',
    overdue: false,
  },
];

export const MOCK_PRODUCTION_SUMMARY: ProductionSummary = {
  mineArea: 'Coal Seam #4 (Pit B Operations)',
  shift: 'Shift A (06:00 - 14:00)',
  dailyTargetTonnes: 10000,
  actualProductionTonnes: 8500,
  deviationTonnes: -1500,
  status: 'Behind Schedule',
};

export const MOCK_TRUCK_DISPATCHES: TruckDispatch[] = [
  { id: 'td-1', truckId: 'JH-10-AX-8912', driverName: 'Sanjay Yadav', loadingStatus: 'In Transit', weightTonnes: 32.4, destination: 'Thermal Power Station Unit 2', status: 'Normal', time: '07:45 AM' },
  { id: 'td-2', truckId: 'JH-10-AX-9001', driverName: 'Ranjeet Singh', loadingStatus: 'Weighed', weightTonnes: 34.1, destination: 'Coal Washery Yard B', status: 'Normal', time: '08:10 AM' },
  { id: 'td-3', truckId: 'JH-10-BX-4310', driverName: 'Sunil Paswan', loadingStatus: 'Loading', weightTonnes: 18.0, destination: 'Railway Siding #1', status: 'Delayed', time: '08:25 AM' },
  { id: 'td-4', truckId: 'JH-10-AX-7745', driverName: 'Vikas Kumar', loadingStatus: 'Dispatched', weightTonnes: 33.8, destination: 'Steel Plant Siding', status: 'Completed', time: '06:50 AM' },
];

export const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n1',
    type: 'critical',
    title: '🔴 Critical Safety Issue Assigned',
    message: 'Hydraulic oil leak detected on Excavator EX-04 near Coal Bench 3. Immediate repair required.',
    timestamp: '10 mins ago',
    isRead: false,
    targetScreen: 'Machinery',
  },
  {
    id: 'n2',
    type: 'warning',
    title: '🟡 Corrective Action Deadline Approaching',
    message: 'Dust suppression cycle on Haul Road 4 due by 12:00 PM today.',
    timestamp: '25 mins ago',
    isRead: false,
    targetScreen: 'Actions',
  },
  {
    id: 'n3',
    type: 'info',
    title: '🔵 Re-Inspection Required',
    message: 'Safety Guard repair on Conveyor C-12 ready for Safety Officer verification.',
    timestamp: '1 hour ago',
    isRead: true,
    targetScreen: 'ReInspection',
  },
  {
    id: 'n4',
    type: 'success',
    title: '🟢 Inspection Completed',
    message: 'Pre-shift Safety Audit for Shaft 3 submitted successfully with 92% compliance score.',
    timestamp: '2 hours ago',
    isRead: true,
    targetScreen: 'Inspection',
  },
];

export const MOCK_DOCUMENTS: ComplianceDocument[] = [
  {
    id: 'doc-001',
    title: 'DGMS Safety Standard Audit Report Q3',
    fileName: 'DGMS_Safety_Audit_Q3_2026.pdf',
    fileSize: '2.4 MB',
    uploadedAt: '28 Sep 2026',
    category: 'DGMS Compliance',
    documentType: 'PDF Document',
    extractedText: `DIRECTORATE GENERAL OF MINES SAFETY (DGMS) COMPLIANCE AUDIT
Mine Name: Jharia Coalfield Pit #4B
Date of Audit: 25 September 2026
Auditor: DGMS Regional Inspector Region 2

KEY FINDINGS & AI OCR ANALYSIS:
1. Gas Detection Protocol: Methane sensor calibration records verified up to 24/09/2026. Compliance status: PASSED.
2. Emergency Haulage Brakes: 4 dump trucks inspected. Secondary emergency brake system responsive.
3. Dust Suppression System: Airborne dust level recorded at 2.1 mg/m3 (Permissible < 3.0 mg/m3).
4. Recommendation: Maintain weekly re-inspection of Conveyor C-12 motor housing mesh.`,
  },
  {
    id: 'doc-002',
    title: 'Environmental Impact & Effluent Clearance',
    fileName: 'Env_Clearance_Discharge_Cert.pdf',
    fileSize: '1.8 MB',
    uploadedAt: '20 Sep 2026',
    category: 'Environmental Monitoring',
    documentType: 'PDF Document',
    extractedText: `STATE POLLUTION CONTROL BOARD - EFFLUENT MONITORING REPORT
Sample Location: Settling Pond #2 Discharge Channel
pH Value: 7.2 (Standard 6.5 - 8.5)
Total Suspended Solids (TSS): 35 mg/L (Limit 100 mg/L)
Heavy Metals Trace: Within permissible safety limits.
AI Summary: Environment clearance valid for Q4 operation without penalty.`,
  },
  {
    id: 'doc-003',
    title: 'CAT 390F Excavator Maintenance Log',
    fileName: 'Excavator_EX04_Maintenance_History.pdf',
    fileSize: '3.1 MB',
    uploadedAt: '15 Sep 2026',
    category: 'Equipment Manual',
    documentType: 'PDF Document',
    extractedText: `EQUIPMENT PREVENTIVE MAINTENANCE LOG SHEET
Machine Tag: EX-04 (CAT 390F)
Serial: #9821-EX-CAT
Engine Hours: 4,210 hrs
Recent Repairs: Replaced hydraulic main hose at 4,150 hrs.
Warning Note: Inspect high pressure seal every 50 operating hours due to high ambient thermal stress in Pit B.`,
  },
];
