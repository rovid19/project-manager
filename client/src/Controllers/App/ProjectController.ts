import { ProjectsService } from "../../Services/ProjectsService";

export class ProjectController {
  title: string = "";
  description: string = "";
  icon: string = "";
  projectId: string = "";

  delete() {}

  async createProject() {
    await this.fetchUserProject();
  }

  async fetchUserProject() {
    const projectId = window.location.pathname.split("/")[2];
    console.log(projectId);
    let apiCall = new ProjectsService(
      `http://localhost:3000/get-project/${projectId}`
    ) as ProjectsService | null;
    await (apiCall as ProjectsService).fetchUserProject(this.projectId);
    apiCall = null;
  }
}
