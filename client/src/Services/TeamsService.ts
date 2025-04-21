import { Team } from "../Types/TeamsTypes";
import { SelectedMember } from "../Views/Teams/TeamsPage/CreateNewTeamPopup";
import { BaseApi } from "./BaseService";

export type TeamData = {
  teamName: string;
  teamDescription: string;
  selectedMembers: SelectedMember[];
};

export class TeamsService extends BaseApi {
  async handleCreateTeam(teamData: TeamData) {
    await this.post(teamData);
  }

  async fetchAllTeams() {
    return (await this.get()) as Team[];
  }
}
