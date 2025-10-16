// Patient interface
export interface Patient {
  id: string;
  name: string;
  refNo: string;
  completed: boolean;
  registeredAt?: string;
}

// Mock patients data - replace with real data from API
export const MOCK_PATIENTS: Patient[] = [
  {
    id: '002',
    name: 'Nur Aisyah binti Rahman',
    refNo: 'SKTP-20250803-002',
    completed: true,
  },
  {
    id: '003',
    name: 'Lim Wei Xuan',
    refNo: 'SKTP-20250803-003',
    completed: false,
  },
  {
    id: '004',
    name: 'Faris Hakim bin Azman',
    refNo: 'SKTP-20250803-004',
    completed: true,
  },
  {
    id: '005',
    name: 'Arvind Raj a/l Kumar',
    refNo: 'SKTP-20250803-005',
    completed: true,
  },
  {
    id: '006',
    name: 'Siti Nur Syafiqah bt Zulkifli',
    refNo: 'SKTP-20250803-006',
    completed: false,
  },
];
