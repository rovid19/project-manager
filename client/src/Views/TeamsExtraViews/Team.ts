type TeamMember = {
  username: string;
  email: string;
  userId: string;
  isAdming: boolean;
};

export class Team {
  teamMembers: TeamMember[] = [];
  teamName: string = "";
  teamDescription: string = "";
  teamId: string = "";

  constructor() {}
}
