export type MembersData = {
  userId: string;
  username: string;
  email: string;
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
