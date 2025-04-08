import { ProjectsService } from "../../Services/ProjectsService";
import { store } from "../../Store/Store";
import { createElement } from "../../Utils/Helpers";
import "../../Styles/Projects.css";
import "../../Styles/Project.css";
import { ProjectData } from "../../Store/UserStore";
import { router } from "../../main";
import { ProjectPopupController } from "../ProjectPopupControllers/ProjectPopupController";
import { removeMemberBtn } from "../../Assets/Icons";

export type MembersData = {
  userId: string;
  username: string;
  email: string;
};

export class ProjectController {
  title: string = "";
  description: string = "";
  icon: string = "";
  projectId: string = "";
  form: HTMLElement | null = null;
  members: string[] = [""];
  membersData: MembersData[] = [];
  mainDiv: HTMLElement | null = null;
  popupState: string = "";
  popupController: ProjectPopupController | null = null;
  removeProjectMemberId: string = "";
  projectMembersParentElement: HTMLElement | null = null;

  constructor() {
    this.setProjectData = this.setProjectData.bind(this);
  }

  delete() {
    document.querySelector(".projects")?.remove();
  }

  async createProject() {
    await this.fetchUserProject();

    const currentState = store.getState();
    const project = createElement({ tag: "div", className: "projects" });
    const innerProject = createElement({
      tag: "div",
      className: "inner-project",
    });
    const pageHeader = createElement({
      tag: "div",
      className: "page-header",
      children: [
        createElement({
          tag: "h3",
          text: `Projects / ${this.title}`,
          className: "page-title",
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

    currentState.mainSection?.appendChild(project);
    project.appendChild(innerProject);
    innerProject.appendChild(pageHeader);

    this.createProjectInfo(innerProject);
    this.createProjectTasks(innerProject);
  }

  createProjectInfo(mainSection: HTMLElement) {
    const projectInfo = createElement({
      tag: "div",
      className: "project-info-section",
      children: [
        createElement({
          tag: "div",
          className: "project-info-div",
          children: [
            createElement({
              tag: "form",
              className: "project-info-form",
              children: [
                createElement({
                  tag: "div",
                  className: "input-group",
                  children: [
                    createElement({
                      tag: "label",
                      className: "title-label",
                      innerText: "Project title:",
                    }),
                    createElement({
                      tag: "input",
                      className: "project-input-title",
                      placeholder: `${this.title}`,
                      name: "title",
                    }),
                  ],
                }),
                createElement({
                  tag: "div",
                  className: "input-group",
                  children: [
                    createElement({
                      tag: "label",
                      className: "description-label",
                      innerText: "Project description:",
                    }),
                    createElement({
                      tag: "input",
                      className: "project-input-description",
                      placeholder: `${this.description}`,
                      name: "description",
                    }),
                  ],
                }),

                createElement({
                  tag: "button",
                  className: "project-info-submit-button",
                  innerText: "Save Changes",
                  onClick: (e: Event) => {
                    e.preventDefault();
                    this.handleProjectSubmission();
                  },
                }),
              ],
            }),

            createElement({
              tag: "div",
              className: "project-icon-div",
              innerHTML: `${this.icon}`,
            }),
          ],
        }),
        createElement({
          tag: "div",
          className: "project-members-div",
          children: [
            createElement({
              tag: "div",
              className: "project-member-btn-div",
              children: [
                createElement({
                  tag: "button",
                  className: "add-team",
                  innerText: "Add Team",
                  onClick: (e: Event) => {
                    e.preventDefault();
                    this.popupState = "team";
                    this.createPopup();
                  },
                }),
                createElement({
                  tag: "button",
                  className: "add-member",
                  innerText: "Add Member",
                  onClick: (e: Event) => {
                    e.preventDefault();
                    this.popupState = "member";
                    this.createPopup();
                  },
                }),
              ],
            }),
          ],
        }),
      ],
    });
    this.projectMembersParentElement = projectInfo.children[1];
    this.renderProjectMemeber();
    mainSection.appendChild(projectInfo);
    this.projectDetailsEventDelegation(projectInfo.children[0].children[0]);
    this.form = projectInfo.children[0].children[0];
  }

  renderProjectMemeber = () => {
    console.log("yoyoyoyoyo");
    if (document.querySelector(".project-member")) {
      const allMembers = document.querySelectorAll(".project-member");
      allMembers.forEach((member) => {
        member.remove();
      });
      this.renderProjectMemeber();
    } else {
      this.membersData.forEach((member) => {
        const element = createElement({
          tag: "div",
          className: "project-member",
          data: member.userId,
          children: [
            createElement({
              tag: "div",
              className: "project-member-name",
              children: [
                createElement({
                  tag: "label",
                  className: "project-member-name-label",
                  innerText: "Project member:",
                }),
                createElement({
                  tag: "h3",
                  className: "project-member-name-name",
                  innerText: member.username,
                }),
              ],
            }),
            createElement({
              tag: "div",
              className: "project-member-remove",
              innerHTML: removeMemberBtn,
              onClick: (e: Event) => {
                const target = e.target as HTMLElement;
                const memberElement = target.closest(
                  ".project-member"
                ) as HTMLElement | null;

                if (memberElement) {
                  this.removeProjectMemberId = memberElement.dataset
                    .projectId as string;
                } else {
                  console.warn("No .project-member element found.");
                }
                this.removeMemberFromProject();
                this.memberRemoveAnimation(element);
              },
            }),
          ],
        });

        (this.projectMembersParentElement as HTMLElement).appendChild(element);
      });
    }
  };

  createProjectTasks(mainSection: HTMLElement) {
    const tasksDiv = createElement({
      tag: "div",
      className: "project-task-section",
      children: [
        createElement({
          tag: "button",
          className: "project-add-task-btn",
          innerText: "Add Task",
          onClick: (e: Event) => {
            e.preventDefault();
            this.popupState = "task";
            this.createPopup();
          },
        }),
      ],
    });

    mainSection.appendChild(tasksDiv);
  }

  setProjectData = (projectData: ProjectData) => {
    this.title = projectData.project.title;
    this.description = projectData.project.description;
    this.icon = projectData.project.icon;
    this.projectId = projectData.project.projectId;
    this.members = projectData.project.members as string[];
    this.membersData = projectData.membersData;
  };

  updateProjectInfoInputFields() {
    const title = document.querySelector(
      ".project-input-title"
    ) as HTMLInputElement;
    const description = document.querySelector(
      ".project-input-description"
    ) as HTMLInputElement;

    title.value = "";
    title.placeholder = this.title;
    description.value = "";
    description.placeholder = this.description;

    (
      document.querySelector(".page-title") as HTMLElement
    ).innerText = `Projects / ${this.title}`;
  }

  async handleProjectSubmission() {
    let apiCall = new ProjectsService(
      `http://localhost:3000/handle-project-submissions/${this.projectId}`
    );
    const data = await apiCall.submitNewProjectDetails({
      title: this.title,
      description: this.description,
    });

    this.title = data[0].title;
    this.description = data[0].description;

    this.setProjectData(data[0]);
    this.updateProjectInfoInputFields();
  }

  projectDetailsEventDelegation(form: HTMLElement) {
    form.addEventListener("change", (e: Event) => {
      const target = e.target as HTMLInputElement;

      if (target.matches("input")) {
        switch (target.name) {
          case "title":
            this.title = target.value;
            break;
          case "description":
            this.description = target.value;
            break;
        }
      }
    });
  }

  async handleDeleteProject() {
    let apiCall = new ProjectsService(
      `http://localhost:3000/handle-delete-project/${this.projectId}`
    );
    await apiCall.delete();

    this.redirectBackToProjects();
  }

  redirectBackToProjects() {
    history.pushState("", "", "/projects");
    router.route("projects");
  }

  async fetchUserProject() {
    const projectId = window.location.pathname.split("/")[2];

    let apiCall = new ProjectsService(
      `http://localhost:3000/get-project/${projectId}`
    ) as ProjectsService | null;
    const projectData = await (apiCall as ProjectsService).fetchUserProject();
    this.setProjectData(projectData);
  }

  createPopup() {
    this.popupController = new ProjectPopupController(
      this.popupState,
      this.projectId,
      this.members,
      this.setProjectData,
      this.renderProjectMemeber
    );
  }

  closePopup() {
    this.popupController = null;
    document.querySelector(".popup-overlay")?.remove();
  }

  async removeMemberFromProject() {
    await new ProjectsService(
      "http://localhost:3000/handle-remove-member"
    ).removeMemberFromProject(this.projectId, this.removeProjectMemberId);

    await this.fetchUserProject();
    setTimeout(() => {
      this.renderProjectMemeber();
    }, 300);
  }

  memberRemoveAnimation(removedMemberDiv: HTMLElement) {
    removedMemberDiv.id = "member-delete-animation";
  }
}
