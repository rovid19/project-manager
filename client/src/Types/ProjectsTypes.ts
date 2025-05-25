export type MembersData = {
  userId: string;
  username: string;
  email: string;
  isAdmin: number;
};

export type Task = {
  taskId: string;
  title: string;
  description: string;
  deadline: string;
  assignee: string;
  userId: string;
  username: string;
};

export type User = {
  userId: string;
  username: string;
  email: string;
  password: string;
};

export type Project = {
  title: string;
  description: string;
  icon: string;
  projectId: string;
  teamId?: string;
  userId?: string;
  members?: string[];
};

export type ProjectData = {
  project: Project;
  membersData: MembersData[];
  taskData: Task[];
};
