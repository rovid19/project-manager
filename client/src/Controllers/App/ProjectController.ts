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

export type Task = {
  taskId: string;
  title: string;
  description: string;
  deadline: string;
  assignee: string;
  userId: string;
  username: string;
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
  projectTasks: Task[] | null = null;
  taskContainer: HTMLElement | null = null;
  taskId: string = "";

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
    this.renderProjectMember();
    mainSection.appendChild(projectInfo);
    this.projectDetailsEventDelegation(projectInfo.children[0].children[0]);
    this.form = projectInfo.children[0].children[0];
  }

  renderProjectMember = () => {
    // rerender members
    if (document.querySelector(".project-member")) {
      const allMembers = document.querySelectorAll(".project-member");
      allMembers.forEach((member) => {
        member.remove();
      });
      this.renderProjectMember();
    }
    // render members
    else {
      this.membersData.forEach((member) => {
        const element = createElement({
          tag: "div",
          className: "project-member",
          data: member.userId,
          children: [
            createElement({
              tag: "div",
              className: "member-content",
              children: [
                createElement({
                  tag: "div",
                  className: "member-avatar",
                  children: [
                    createElement({
                      tag: "span",
                      className: "member-initials",
                      text: member.username.charAt(0).toUpperCase(),
                    }),
                  ],
                }),
                createElement({
                  tag: "div",
                  className: "member-info",
                  children: [
                    createElement({
                      tag: "h3",
                      className: "member-name",
                      text: member.username,
                    }),
                    createElement({
                      tag: "span",
                      className: "member-email",
                      text: member.email,
                    }),
                    createElement({
                      tag: "span",
                      className: "member-role",
                      text: "Team Member",
                    }),
                  ],
                }),
              ],
            }),
            createElement({
              tag: "div",
              className: "member-actions",
              children: [
                createElement({
                  tag: "div",
                  className: "remove-member-btn",
                  innerHTML: removeMemberBtn,
                  onClick: (e: Event) => {
                    const target = e.target as HTMLElement;
                    const memberElement = target.closest(
                      ".project-member"
                    ) as HTMLElement | null;
                    if (memberElement) {
                      this.removeProjectMemberId = memberElement.dataset
                        .projectId as string;
                    }
                    this.removeMemberFromProject();
                    this.cardDeleteAni(element);
                  },
                }),
              ],
            }),
          ],
        });

        this.projectMembersParentElement?.appendChild(element);
      });
    }
  };

  renderProjectTasks = () => {
    // rerender tasks
    if (document.querySelector(".project-task-card")) {
      const allTasks = document.querySelectorAll(".project-task-card");
      allTasks.forEach((task) => {
        task.remove();
      });
      this.renderProjectTasks();
    }
    // render tasks
    else {
      console.log(this.projectTasks),
        (this.projectTasks as Task[]).forEach((task) => {
          const element = createElement({
            tag: "div",
            className: "project-task-card",
            data: task.taskId,
            children: [
              createElement({
                tag: "div",
                className: "task-header",
                children: [
                  createElement({
                    tag: "h3",
                    className: "task-title",
                    text: task.title,
                  }),
                  createElement({
                    tag: "div",
                    className: "remove-task-btn",
                    innerHTML: removeMemberBtn,
                    onClick: (e: Event) => {
                      this.removeTaskFromProject(task.taskId);
                      this.cardDeleteAni(element);
                    },
                  }),
                ],
              }),
              createElement({
                tag: "div",
                className: "task-info",
                children: [
                  createElement({
                    tag: "div",
                    className: "task-assignee",
                    children: [
                      createElement({
                        tag: "span",
                        className: "task-label",
                        text: "Assigned to:",
                      }),
                      createElement({
                        tag: "span",
                        className: "task-assigned-user",
                        text: task.username,
                      }),
                    ],
                  }),
                  createElement({
                    tag: "div",
                    className: "task-deadline",
                    children: [
                      createElement({
                        tag: "span",
                        className: "task-label",
                        text: "Deadline:",
                      }),
                      createElement({
                        tag: "span",
                        className: "task-date",
                        text: new Date(task.deadline).toLocaleDateString(),
                      }),
                    ],
                  }),
                ],
              }),
            ],
          });

          (this.taskContainer as HTMLElement).appendChild(element);
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

    this.taskContainer = tasksDiv;
    this.renderProjectTasks();
    mainSection.appendChild(tasksDiv);
  }

  setProjectData = (projectData: ProjectData) => {
    this.title = projectData.project.title;
    this.description = projectData.project.description;
    this.icon = projectData.project.icon;
    this.projectId = projectData.project.projectId;
    this.members = projectData.project.members as string[];
    this.membersData = projectData.membersData;
    this.projectTasks = projectData.taskData;
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

  fetchUserProject = async () => {
    console.log("yooo");
    const projectId = window.location.pathname.split("/")[2];

    let apiCall = new ProjectsService(
      `http://localhost:3000/get-project/${projectId}`
    ) as ProjectsService | null;
    const projectData = await (apiCall as ProjectsService).fetchUserProject();
    this.setProjectData(projectData);
  };

  createPopup() {
    this.popupController = new ProjectPopupController(
      this.popupState,
      this.projectId,
      this.members,
      this.setProjectData,
      this.renderProjectMember,
      this.fetchUserProject,
      this.renderProjectTasks,
      this.membersData
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
      this.renderProjectMember();
    }, 300);
  }

  async removeTaskFromProject(taskId: string) {
    await new ProjectsService(
      "http://localhost:3000/handle-remove-task"
    ).removeTaskFromProject(taskId);

    await this.fetchUserProject();
    setTimeout(() => {
      this.renderProjectTasks();
    }, 300);
  }

  cardDeleteAni(removedCard: HTMLElement) {
    removedCard.id = "card-delete-animation";
  }
}
