import { BaseApi } from "./ApiService";

export type ProjectInfo = {
  title: string;
  description: string;
  teams: string;
  icon: string;
};

export class ProjectsService extends BaseApi {
  async createNewProject(projectInfo: ProjectInfo) {
    console.log(projectInfo);
    const response = await this.post(projectInfo);

    const result = await response.json();

    console.log(result);
  }
}
