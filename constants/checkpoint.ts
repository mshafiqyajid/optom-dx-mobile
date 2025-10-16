// Checkpoint step status enum
export enum CheckpointStepStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
}

// Checkpoint step interface
export interface CheckpointStep {
  id: number;
  title: string;
  status: CheckpointStepStatus;
  completedAt?: string;
}
