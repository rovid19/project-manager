import { ProjectsService } from "../../../Services/ProjectsService";
import { createElement } from "../../../Utils/Helpers";
import "../../../Styles/Project.css";
import "../../../Styles/SharedStylings/SectionHeader.css";
import "../../../Styles/SharedStylings/UpperInnerSection.css";
import { ProjectData } from "../../../Store/UserStore";
import { router } from "../../../main";
import { ProjectPopupView } from "./ProjectPopups/ProjectViewPopup";
import { store } from "../../../Store/Store";
import type { ProjectViewTaskManager } from "./ProjectViewTaskManager";
import type { ProjectViewMemberManager } from "./ProjectViewMemberManager";
import type { ProjectViewInfoManager } from "./ProjectViewInfoManager";
import { MembersData, Task } from "../../../Types/ProjectsTypes";

export class ProjectView {
  title: string = "";
  description: string = "";
  icon: string = "";
  projectId: string = "";
  form: HTMLElement | null = null;
  members: string[] = [];
  membersData: MembersData[] = [];
  mainDiv: HTMLElement | null = null;
  popupState: string = "";
  popupController: ProjectPopupView | null = null;
  removeProjectMemberId: string = "";
  projectMembersParentElement: HTMLElement | null = null;
  projectTasks: Task[] | null = null;
  taskContainer: HTMLElement | null = null;
  taskId: string = "";
  memberManagerController: ProjectViewMemberManager | null = null;
  infoManagerController: ProjectViewInfoManager | null = null;
  taskManagerController: ProjectViewTaskManager | null = null;
  projectContainerElement: HTMLElement | null = null;

  //UI RENDER------------------------------------------------------
  delete() {
    const upperSection = document.querySelector(
      ".upper-section"
    ) as HTMLElement;

    upperSection.remove();
  }

  async renderProjectPage() {
    const currentState = store.getState();
    const project = createElement({
      tag: "div",
      className: "upper-section",
    }) as HTMLElement;
    const innerProject = createElement({
      tag: "div",
      className: "inner-section",
    }) as HTMLElement;
    const pageHeader = createElement({
      tag: "div",
      className: "section-header",
      children: [
        createElement({
          tag: "h3",
          text: `Projects / ${this.title}`,
          className: "section-title",
        }),
        createElement({
          tag: "button",
          className: "project-delete-btn",
          innerText: "Delete Project",
          onClick: async (e: Event) => {
            e.preventDefault();
            await this.handleDeleteProject();
          },
        }),
      ],
    });

    this.handleSetCustomCss(project, innerProject, pageHeader.children[0]);
    currentState.mainSection?.appendChild(project);
    project.appendChild(innerProject);
    innerProject.appendChild(pageHeader);
    this.projectContainerElement = innerProject;
    this.handleManagerClassSetup();
  }

  //CORE LOGIC-----------------------------------------------------
  async handleManagerClassSetup() {
    console.log("yoyoyo");
    const { ProjectViewInfoManager } = await import("./ProjectViewInfoManager");
    const { ProjectViewMemberManager } = await import(
      "./ProjectViewMemberManager"
    );
    const { ProjectViewTaskManager } = await import("./ProjectViewTaskManager");

    await this.fetchUserProject();
    this.infoManagerController = new ProjectViewInfoManager(
      this.projectId,
      this.title,
      this.description,
      this.projectContainerElement as HTMLElement,
      this.handleManagerClassReset
    );
    this.memberManagerController = new ProjectViewMemberManager(
      this.membersData,
      this.projectId,
      this.projectContainerElement as HTMLElement,
      this.handleOpenPopup,
      this.handleChangePopupValue,
      this.handleManagerClassReset
    );
    this.taskManagerController = new ProjectViewTaskManager(
      this.projectTasks as Task[],
      this.projectContainerElement as HTMLElement,
      this.fetchUserProject,
      this.handleOpenPopup,
      this.handleChangePopupValue,
      this.handleManagerClassReset
    );
  }

  handleManagerClassReset = async () => {
    document.querySelector(".project-info-section")?.remove();
    document.querySelector(".project-task-section")?.remove();
    document.querySelector(".project-members-div")?.remove();
    this.infoManagerController = null;
    this.memberManagerController = null;
    this.taskManagerController = null;
    await this.handleManagerClassSetup();
  };

  handleSetCustomCss(
    upperSection: HTMLElement,
    innerSection: HTMLElement,
    sectionHeader: HTMLElement
  ) {
    upperSection.style.backgroundColor = "#f5f7f9";
    innerSection.style.width = "40%";
    innerSection.style.margin = "0 auto";
    sectionHeader.style.fontWeight = "400";
  }

  handleSetProjectData = (projectData: ProjectData) => {
    this.title = projectData.project.title;
    this.description = projectData.project.description;
    this.icon = projectData.project.icon;
    this.projectId = projectData.project.projectId;
    this.members = JSON.parse(projectData.project.members);
    this.membersData = projectData.membersData;
    this.projectTasks = projectData.taskData;
  };

  redirectBackToProjects() {
    history.pushState("", "", "/projects");
    router.route("projects");
  }

  handleOpenPopup = () => {
    this.popupController = new ProjectPopupView(
      this.popupState,
      this.projectId,
      this.members,
      () => {},
      (
        this.memberManagerController as ProjectViewMemberManager
      ).renderProjectMember,
      this.fetchUserProject,
      (this.taskManagerController as ProjectViewTaskManager).renderProjectTasks,
      this.membersData,
      this.handleClosePopup,
      this.handleManagerClassReset
    );
  };

  handleClosePopup = () => {
    this.popupController = null;
    document.querySelector(".popup-overlay")?.remove();
  };

  handleChangePopupValue = (value: string) => {
    this.popupState = value;
  };

  cardDeleteAni(removedCard: HTMLElement) {
    removedCard.id = "card-delete-animation";
  }

  //API CALLS--------------------------------------------------------
  async handleDeleteProject() {
    let apiCall = new ProjectsService(
      `http://localhost:3000/handle-delete-project/${this.projectId}`
    );
    await apiCall.delete();

    this.redirectBackToProjects();
  }

  fetchUserProject = async () => {
    const projectId = window.location.pathname.split("/")[2];

    let apiCall = new ProjectsService(
      `http://localhost:3000/get-project/${projectId}`
    ) as ProjectsService | null;
    const projectData = await (apiCall as ProjectsService).fetchUserProject();
    this.handleSetProjectData(projectData);
  };
}
