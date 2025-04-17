import { Team } from "../Views/App/TeamsView";
import { SelectedMember } from "../Views/TeamsExtraViews/TeamsPopupView";
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
