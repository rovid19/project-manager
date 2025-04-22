export type Team = {
  teamName?: string;
  teamDescription?: string;
  teamId?: string;
  isAdmin?: boolean;
};

export type TeamMember = {
  username: string;
  email: string;
  userId: string;
  isAdmin: boolean;
};
