import { Project, ProjectData, userStore } from "../Store/UserStore";
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

  async fetchUserProject(): Promise<ProjectData> {
    const result = await this.get();
    return result;
  }

  async submitNewProjectDetails(projectData: {
    title: string;
    description: string;
  }): Promise<any> {
    const result = await this.put(projectData);
    return result;
  }

  async deleteProject() {
    await this.delete();
  }

  async getAllUsers(members: string[]) {
    const result = await this.post(members);

    return result;
  }

  async handleAddMember(memberId: string, projectId: string) {
    await this.put({ memberId, projectId });
  }

  async removeMemberFromProject(projectId: string, projectMemberId: string) {
    await this.put({ projectId, projectMemberId });
  }
}
