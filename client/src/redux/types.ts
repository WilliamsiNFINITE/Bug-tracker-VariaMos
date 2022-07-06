export interface UserState {
  id: string;
  username: string;
  token: string;
  isAdmin: boolean;
  email: string;
  notificationsOn: boolean;
}

export type BugPriority = 'low' | 'medium' | 'high';

export interface User {
  id: string;
  username: string;
  isAdmin: boolean;
  email: string;
  notificationsOn: boolean;
}

export interface Note {
  id: number;
  bugId: string;
  body: string;
  author: User;
  createdAt: Date;
  updatedAt: Date;
}

export interface AssignedAdmins {
  id: number;
  bugId: string;
  adminId: string;
  joinedAt: Date;
}

export interface BugState {
  id: string;
  title: string;
  description: string;
  priority: BugPriority;
  notes: Note[];
  isResolved: boolean;
  createdBy: User;
  updatedBy?: User;
  closedBy?: User;
  reopenedBy?: User;
  closedAt?: Date;
  reopenedAt?: Date;
  updatedAt?: Date;
  createdAt: Date;
  assignments: AssignedAdmins[];
  filePath: string;
}

export type BugSortValues =
  | 'newest'
  | 'oldest'
  | 'a-z'
  | 'z-a'
  | 'closed'
  | 'reopened'
  | 'h-l'
  | 'l-h'
  | 'updated'
  | 'most-notes'
  | 'least-notes';

export type BugFilterValues = 'all' | 'closed' | 'open' | 'myBugs';

export interface CredentialsPayload {
  username: string;
  password: string;
  email?: string;
}

export interface BugPayload {
  title: string;
  description: string;
  priority: BugPriority;
}

export interface SettingsPayload {
  email: string;
  notificationsOn: boolean;
  newPassword: string;
  oldPassword: string;
}

export interface InviteAdminPayload {
  email: string;
  login: string;
}

export interface EditedBugData extends BugPayload {
  updatedAt: Date;
  updatedBy: User;
}

export interface ClosedReopenedBugData {
  isResolved: boolean;
  closedAt: Date;
  closedBy: User;
  reopenedAt: Date;
  reopenedBy: User;
}

export interface NotifPayload {
  message: string;
  type: 'success' | 'error';
}
