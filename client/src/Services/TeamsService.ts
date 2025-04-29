import { Team } from "../Types/TeamsTypes";
import { SelectedMember } from "../Views/Teams/TeamsPage/CreateNewTeamPopup";
import { BaseApi } from "./BaseService";

export type TeamData = {
  teamName: string;
  teamDescription: string;
  selectedMembers: SelectedMember[];
};

export class TeamsService extends BaseApi {
  async createTeam(teamData: TeamData) {
    await this.post(teamData);
  }

  async getAllTeams() {
    return (await this.get()) as Team[];
  }

  async updateTeamDetails(team: Team) {
    await this.put(team);
  }

  async getAllTeamMembers() {
    return await this.get();
  }

  async getTeam() {
    return await this.get();
  }

  async deleteTeam() {
    await this.delete();
  }

  async addMemberToTeam(member: any) {
    await this.post(member);
  }

  async createNewAdmin(userId: string) {
    await this.post(userId);
  }
}
