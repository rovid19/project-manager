import { ProjectsService } from "../../../Services/ProjectsService";
import { createElement } from "../../../Utils/Helpers";
import "../../../Styles/Views/Projects/Project/Project.css";
import { ProjectData, userStore } from "../../../Store/UserStore";
import { router } from "../../../main";
import { ProjectViewPopup } from "./ProjectPopups/ProjectViewPopup";
import { store } from "../../../Store/Store";
import type { ProjectViewTaskManager } from "./ProjectViewTaskManager";
import type { ProjectViewMemberManager } from "./ProjectViewMemberManager";
import type { ProjectViewInfoManager } from "./ProjectViewInfoManager";
import { MembersData, Task } from "../../../Types/ProjectsTypes";
import { iconArray } from "../../../Assets/Icons";

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
  popupController: ProjectViewPopup | null = null;
  removeProjectMemberId: string = "";
  projectMembersParentElement: HTMLElement | null = null;
  projectTasks: Task[] | null = null;
  taskContainer: HTMLElement | null = null;
  taskId: string = "";
  teamId: string = "";
  memberManagerController: ProjectViewMemberManager | null = null;
  infoManagerController: ProjectViewInfoManager | null = null;
  taskManagerController: ProjectViewTaskManager | null = null;
  projectContainerElement: HTMLElement | null = null;

  //UI RENDER------------------------------------------------------
  delete() {
    const upperSection = document.querySelector(".upperSection") as HTMLElement;

    upperSection?.remove();
  }

  renderProjectPage = async () => {
    const currentScreen = document.querySelector(".upperSection");
    if (currentScreen) currentScreen.remove();

    await this.fetchUserProject();

    const currentState = store.getState();
    const project = createElement({
      tag: "div",
      className: "upperSection",
    }) as HTMLElement;

    const innerProject = createElement({
      tag: "div",
      className: "innerSection",
    }) as HTMLElement;

    // Create header with breadcrumb and actions
    const pageHeader = createElement({
      tag: "div",
      className: "projectHeader",
      children: [
        createElement({
          tag: "div",
          className: "headerLeft",
          children: [
            createElement({
              tag: "div",
              className: "breadcrumb",
              children: [
                createElement({
                  tag: "a",
                  className: "breadcrumbLink",
                  text: "Projects",
                  onClick: (e: Event) => {
                    e.preventDefault();
                    this.redirectBackToProjects();
                  },
                }),
                createElement({
                  tag: "span",
                  className: "breadcrumbSeparator",
                  text: "/",
                }),
                createElement({
                  tag: "span",
                  className: "breadcrumbCurrent",
                  text: this.title,
                }),
              ],
            }),
            createElement({
              tag: "h1",
              className: "projectTitle",
              text: this.title,
            }),
            createElement({
              tag: "p",
              className: "projectDescription",
              text: this.description || "No description provided",
            }),
          ],
        }),
        createElement({
          tag: "div",
          className: "headerActions",
          children: [
            createElement({
              tag: "button",
              className: "deleteProjectBtn",
              children: [
                createElement({
                  tag: "span",
                  className: "btnIcon",
                  html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>`,
                }),
                createElement({
                  tag: "span",
                  className: "btnText",
                  text: "Delete Project",
                }),
              ],
              onClick: async (e: Event) => {
                e.preventDefault();
                if (confirm("Are you sure you want to delete this project?")) {
                  await this.handleDeleteProject();
                }
              },
            }),
          ],
        }),
      ],
    });

    currentState.mainSection?.appendChild(project);
    project.appendChild(innerProject);
    innerProject.appendChild(pageHeader);

    // Create content container
    const contentContainer = createElement({
      tag: "div",
      className: "projectContent",
    });
    innerProject.appendChild(contentContainer);

    this.projectContainerElement = contentContainer;
    await this.handleManagerClassSetup();
  };

  //CORE LOGIC-----------------------------------------------------
  async handleManagerClassSetup() {
    console.log(this.teamId);
    const { ProjectViewInfoManager } = await import("./ProjectViewInfoManager");
    const { ProjectViewMemberManager } = await import(
      "./ProjectViewMemberManager"
    );
    const { ProjectViewTaskManager } = await import("./ProjectViewTaskManager");

    // Create sections with cards
    const tasksSection = createElement({
      tag: "div",
      className: "projectSection",
    });

    const infoSection = createElement({
      tag: "div",
      className: "projectSection",
    });

    const membersSection = createElement({
      tag: "div",
      className: "projectSection",
    });
    this.projectContainerElement?.appendChild(infoSection);
    this.projectContainerElement?.appendChild(tasksSection);
    this.projectContainerElement?.appendChild(membersSection);

    this.infoManagerController = new ProjectViewInfoManager(
      this.projectId,
      this.title,
      this.description,
      infoSection,
      this.renderProjectPage
    );

    this.memberManagerController = new ProjectViewMemberManager(
      this.membersData,
      this.projectId,
      membersSection,
      this.teamId,
      this.openPopup,
      this.handleChangePopupValue,
      this.renderProjectPage
    );

    this.taskManagerController = new ProjectViewTaskManager(
      this.projectTasks as Task[],
      tasksSection,
      this.fetchUserProject,
      this.openPopup,
      this.handleChangePopupValue,
      this.renderProjectPage
    );
  }

  handleManagerClassReset = async () => {
    if (this.projectContainerElement) {
      this.projectContainerElement.innerHTML = "";
    }

    this.infoManagerController = null;
    this.memberManagerController = null;
    this.taskManagerController = null;
    await this.handleManagerClassSetup();
  };

  setProjectData = (projectData: ProjectData) => {
    this.teamId = projectData.project.teamId as string;
    this.title = projectData.project.title;
    this.description = projectData.project.description;
    this.icon = projectData.project.icon;
    this.projectId = projectData.project.projectId;
    this.members = [];
    projectData.membersData.forEach((member) =>
      this.members.push(member.userId)
    );
    this.membersData = projectData.membersData;
    this.projectTasks = projectData.taskData;
  };

  redirectBackToProjects() {
    history.pushState("", "", "/projects");
    router.route("projects");
  }

  openPopup = () => {
    this.popupController = new ProjectViewPopup(
      this.popupState,
      this.projectId,
      this.members,
      this.teamId,
      () => {},
      this.fetchUserProject,
      this.membersData,
      this.closePopup,
      this.renderProjectPage
    );
  };

  closePopup = () => {
    console.log("ddd");
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
    const teamId = window.location.pathname.split("/")[3];
    this.teamId = teamId;

    console.log(this.teamId);

    let apiCall = new ProjectsService(
      `http://localhost:3000/projects/get/${projectId}/team/${teamId}`
    ) as ProjectsService | null;
    const projectData = await (apiCall as ProjectsService).fetchUserProject();
    this.setProjectData(projectData);
  };
}
