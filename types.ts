export enum TaskStatus {
  TODO = 'CHUA_LAM',
  IN_PROGRESS = 'DANG_LAM',
  DONE = 'HOAN_THANH'
}

export interface Attachment {
  id: string;
  name: string;
  type: string;
  url?: string;
}

export interface Note {
  id: string;
  content: string;
  createdAt: number;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: number;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  assignee: string;
  description: string;
  // removed isConfirmed
  status: TaskStatus;
  notes: Note[]; // Changed from progressNotes string to Note array
  attachments: Attachment[];
  deadline?: number;
  createdAt: number;
  updatedAt: number;
}

export type TaskFilter = 'ALL' | TaskStatus;

export const STATUS_LABELS: Record<TaskStatus, string> = {
  [TaskStatus.TODO]: 'Chưa làm',
  [TaskStatus.IN_PROGRESS]: 'Đang làm',
  [TaskStatus.DONE]: 'Hoàn thành'
};

export const STATUS_COLORS: Record<TaskStatus, string> = {
  [TaskStatus.TODO]: 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600',
  [TaskStatus.IN_PROGRESS]: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800',
  [TaskStatus.DONE]: 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800'
};