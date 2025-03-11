import { ProjectsService } from "../../Services/ProjectsService";

export class ProjectsCreateNewController {
  title: string = "";
  description: string = "";
  icon: string = "";
  projectId: string = "";

  createProject() {
    console.log("da");
  }

  async fetchUserProject() {
    let apiCall = new ProjectsService(
      "http://localhost:3000/get-user-project"
    ) as ProjectsService | null;
    await (apiCall as ProjectsService).fetchUserProject(this.projectId);
    apiCall = null;
  }
}
