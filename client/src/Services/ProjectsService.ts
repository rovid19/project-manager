import { store } from "../Store/Store";
import { userStore } from "../Store/UserStore";
import { BaseApi } from "./ApiService";

export type ProjectInfo = {
  title: string;
  description: string;
  teams: string;
  icon: string;
};

export class ProjectsService extends BaseApi {
  async createNewProject(projectInfo: ProjectInfo) {
    console.log("da");
    await this.post(projectInfo);
  }

  async fetchAllUserProjects() {
    const result = (await this.get()) as ProjectInfo[];
    const projectArray: ProjectInfo[] = [];

    result.forEach((project) => {
      projectArray.push({
        title: project.title,
        description: project.description,
        teams: "",
        icon: project.icon,
      });
    });

    userStore.setState({ projects: projectArray });
  }
}
