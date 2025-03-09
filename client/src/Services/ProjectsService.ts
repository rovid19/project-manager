import { BaseApi } from "./ApiService";

export type ProjectInfo = {
  title: string;
  description: string;
  teams: string;
  icon: string;
};

export class ProjectsService extends BaseApi {
  async createNewProject(projectInfo: ProjectInfo) {
    await this.post(projectInfo);
  }

  async fetchAllUserProjects() {
    const result = await this.get();

    console.log(result);
  }
}
