/**
 * Assignments TypeScript Types
 * Type definitions for the assignments system
 */

export interface Assignment {
  id: string;
  title: string;
  module: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  xpReward: number;
  deadline: string;
  estimatedTime: number; // in hours
  status: 'Not Started' | 'In Progress' | 'Submitted' | 'Under Review' | 'Completed' | 'Overdue';
  progress: number; // 0-100
  tags: string[];
  fullDescription?: string;
  rubric?: RubricItem[];
  resources?: Resource[];
}

interface RubricItem {
  id: string;
  criterion: string;
  maxPoints: number;
  description: string;
}

interface Resource {
  id: string;
  title: string;
  type: 'link' | 'document' | 'video' | 'example';
  url: string;
}

export interface AssignmentStats {
  totalAssignments: number;
  completedAssignments: number;
  pendingReview: number;
  totalXpEarned: number;
}

interface AssignmentSubmission {
  id: string;
  assignmentId: string;
  userId: string;
  submittedAt: string;
  content: string;
  status: 'submitted' | 'under_review' | 'accepted' | 'revision_requested';
  feedback?: string;
  score?: number;
}

interface AssignmentFilter {
  status: string;
  difficulty: string;
  module: string;
  searchQuery: string;
  sortBy: string;
}

interface Feedback {
  id: string;
  assignment: string;
  mentor: string;
  content: string;
  status: 'positive' | 'neutral' | 'critical';
  createdAt: string;
}

interface AssignmentCardProps {
  assignment: Assignment;
}

interface AssignmentFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: string;
  onStatusChange: (status: string) => void;
  difficultyFilter: string;
  onDifficultyChange: (difficulty: string) => void;
  moduleFilter: string;
  onModuleChange: (module: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
}

interface AssignmentStatsProps {
  stats: AssignmentStats;
}

interface DeadlineWidgetProps {
  assignments: Assignment[];
}

interface XPProgressWidgetProps {
  stats: AssignmentStats;
}

interface FeedbackWidgetProps {
  feedbacks?: Feedback[];
}