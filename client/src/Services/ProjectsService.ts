import { Project, userStore } from "../Store/UserStore";
import { BaseApi } from "./ApiService";

export class ProjectsService extends BaseApi {
  async createNewProject(projectInfo: Project) {
    await this.post(projectInfo);
  }

  async fetchAllUserProjects() {
    const result = (await this.get()) as Project[];
    const projectArray: Project[] = [];

    result.forEach((project) => {
      projectArray.push({
        title: project.title,
        description: project.description,
        icon: project.icon,
        projectId: project.projectId,
      });
    });

    userStore.setState({ projects: projectArray });
  }

  async fetchUserProject(projectId: string) {
    await this.get();
  }
}
