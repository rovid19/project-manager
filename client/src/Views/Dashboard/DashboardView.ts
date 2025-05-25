import { store } from "../../Store/Store";
import { createElement, iconGradients } from "../../Utils/Helpers";
import "../../Styles/Views/Dashboard/Dashboard.css";
import "../../Styles/SharedStylings/UpperInnerSection.css";
import "../../Styles/SharedStylings/SectionHeader.css";
import "../../Styles/SharedStylings/ProjectCards.css";
import { userStore } from "../../Store/UserStore";
import { router } from "../../main";
import { ProjectsService } from "../../Services/ProjectsService";
import { TaskService } from "../../Services/TaskService";
import { Project, Task } from "../../Types/ProjectsTypes";
import { QuickTaskPopup } from "./QuickTaskPopup";

export class DashboardView {
  projects: Project[] = [];
  tasks: any[] = [];
  private currentTaskFilter: "active" | "completed" = "active";

  //UI RENDER------------------------------------------------------
  async createDashboard() {
    await this.fetchAllUserProjects();
    await this.fetchAllUserTasks();
    const projects = userStore.getState().projects;

    // Sort projects by date (newest first)
    const sortedProjects = [...projects].sort((a, b) => {
      return b.projectId.localeCompare(a.projectId);
    });

    const dashboardContainer = createElement({
      tag: "div",
      className: "dashboard-container",
    });

    store.getState().mainSection?.appendChild(dashboardContainer);

    this.renderHeader(dashboardContainer);

    const dashboardContent = createElement({
      tag: "div",
      className: "dashboard-content",
    });

    dashboardContainer.appendChild(dashboardContent);
    await this.renderTasksSection(dashboardContent, false);
    this.renderProjectOverview(dashboardContent, sortedProjects);

    this.renderReportsSection(dashboardContent);
  }

  renderHeader(container: HTMLElement) {
    const header = createElement({
      tag: "header",
      className: "dashboard-header",
      children: [
        createElement({
          tag: "div",
          className: "header-left",
          children: [
            createElement({
              tag: "h1",
              className: "page-title",
              text: "Dashboard",
            }),
            createElement({
              tag: "p",
              className: "page-subtitle",
              text: "Welcome back to your workspace",
            }),
          ],
        }),
        createElement({
          tag: "div",
          className: "header-actions",
          children: [
            createElement({
              tag: "button",
              className: "new-project-btn",
              text: "New Task",
              onClick: () => {
                new QuickTaskPopup(
                  this.renderTasksSection,
                  this.fetchAllUserTasks
                );
              },
            }),
          ],
        }),
      ],
    });

    container.appendChild(header);
  }

  renderProjectOverview = (container: HTMLElement, projects: Project[]) => {
    const projectSection = createElement({
      tag: "div",
      className: "dashboard-section",
      id: "projects-section",
      children: [
        createElement({
          tag: "div",
          className: "section-header-row",
          children: [
            createElement({
              tag: "h2",
              className: "section-title-dashboard",
              text: "Recent Projects",
            }),
            createElement({
              tag: "a",
              className: "view-all-link",
              text: "View All Projects",
              onClick: () => {
                history.pushState("", "", "/projects");
                router.route("projects");
              },
            }),
          ],
        }),
      ],
    });

    container.appendChild(projectSection);

    const projectCards = createElement({
      tag: "div",
      className: "project-cards-grid",
    });

    projectSection.appendChild(projectCards);

    const projectsToShow = projects.slice(0, 3);

    if (projectsToShow.length === 0) {
      projectSection.appendChild(
        createElement({
          tag: "div",
          className: "empty-projects",
          children: [
            createElement({
              tag: "p",
              text: "You don't have any projects yet.",
            }),
            createElement({
              tag: "button",
              className: "create-project-btn",
              text: "Create Your First Project",
              onClick: () => {
                history.pushState({}, "", "/projects");
                router.route("projects");
              },
            }),
          ],
        })
      );
    } else {
      projectsToShow.forEach((project) => {
        const hash = project.title
          .split("")
          .reduce((acc, char) => acc + char.charCodeAt(0), 0);

        const iconStyle = iconGradients[hash % iconGradients.length];
        const card = createElement({
          tag: "div",
          className: "dashboard-project-card",
          onClick: () => {
            history.pushState(
              "",
              "",
              `/projects/${project.projectId}/${project.teamId}`
            );
            router.route(
              `projects/${project.projectId}/${
                project.teamId ? project.teamId : "noTeam"
              }`
            );
          },
          children: [
            createElement({
              tag: "div",
              className: "card-content",
              children: [
                createElement({
                  tag: "div",
                  className: "project-icon",
                  style: {
                    background: iconStyle.gradient,
                    color: iconStyle.text,
                  },
                  innerHTML: project.icon,
                }),
                createElement({
                  tag: "h3",
                  className: "project-title",
                  text: project.title,
                }),
                createElement({
                  tag: "p",
                  className: "project-description",
                  text: project.description || "No description provided",
                }),
              ],
            }),
          ],
        });

        projectCards.appendChild(card);
      });
    }
  };

  renderReportsSection(container: HTMLElement) {
    const reportsSection = createElement({
      tag: "div",
      className: "dashboard-section",
      id: "reports-section",
      children: [
        createElement({
          tag: "div",
          className: "section-header-row",
          children: [
            createElement({
              tag: "h2",
              className: "section-title-dashboard",
              text: "Reports Overview",
            }),
            createElement({
              tag: "a",
              className: "view-all-link",
              text: "View All Reports",
              onClick: () => {
                router.route("/reports");
              },
            }),
          ],
        }),
      ],
    });

    container.appendChild(reportsSection);

    const reportsPlaceholder = createElement({
      tag: "div",
      className: "reports-placeholder",
      children: [
        createElement({
          tag: "div",
          className: "placeholder-content",
          children: [
            createElement({
              tag: "p",
              className: "placeholder-message",
              text: "Reports section is coming soon",
            }),
            createElement({
              tag: "p",
              className: "placeholder-description",
              text: "Track your progress and get insights about your projects and tasks",
            }),
          ],
        }),
      ],
    });

    reportsSection.appendChild(reportsPlaceholder);
  }

  renderTasksSection = async (container: HTMLElement, rerender: boolean) => {
    if (document.getElementById("tasks-section"))
      document.getElementById("tasks-section")?.remove();

    const tasksSection = createElement({
      tag: "div",
      className: "dashboard-section",
      id: "tasks-section",
      children: [
        createElement({
          tag: "div",
          className: "section-header-row",
          children: [
            createElement({
              tag: "h2",
              className: "section-title-dashboard",
              text: "Current Tasks",
            }),
            createElement({
              tag: "a",
              className: "view-all-link",
              text: "View All Tasks",
              onClick: () => {
                history.pushState("", "", "/tasks");
                router.route("tasks");
              },
            }),
          ],
        }),
        createElement({
          tag: "div",
          className: "tasks-tabs",
          children: [
            createElement({
              tag: "button",
              className: `tasks-tab ${
                this.currentTaskFilter === "active" ? "active" : ""
              }`,
              text: "Active Tasks",
              onClick: () => {
                this.currentTaskFilter = "active";
                this.renderTasksSection(container, true);
              },
            }),
            createElement({
              tag: "button",
              className: `tasks-tab ${
                this.currentTaskFilter === "completed" ? "active" : ""
              }`,
              text: "Completed",
              onClick: () => {
                this.currentTaskFilter = "completed";
                this.renderTasksSection(container, true);
              },
            }),
          ],
        }),
      ],
    });

    if (rerender)
      document.getElementById("projects-section")?.before(tasksSection);
    else container.appendChild(tasksSection);

    const filteredTasks = this.tasks.filter((task) => {
      if (this.currentTaskFilter === "active") {
        return !task.isCompleted;
      } else {
        return task.isCompleted;
      }
    });

    if (filteredTasks.length === 0) {
      tasksSection.appendChild(
        createElement({
          tag: "div",
          className: "empty-projects",
          children: [
            createElement({
              tag: "p",
              text: `You don't have any ${this.currentTaskFilter} tasks yet.`,
            }),
            createElement({
              tag: "button",
              className: "create-project-btn",
              text: "Create Your First Task",
              onClick: () => {
                new QuickTaskPopup(
                  this.renderTasksSection,
                  this.fetchAllUserTasks
                );
              },
            }),
          ],
        })
      );
    } else {
      filteredTasks.forEach((task: any) => {
        const badgeText = task.title
          ? task.title.slice(0, 2).toUpperCase()
          : "T";

        let daysRemaining = "";
        if (task.deadline) {
          const deadline = new Date(task.deadline);
          const now = new Date();
          const diff = Math.ceil(
            (deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
          );
          daysRemaining = diff > 0 ? `${diff} days remaining` : "Due";
        }

        tasksSection.appendChild(
          createElement({
            tag: "div",
            className: "task-card-dashboard",
            children: [
              createElement({
                tag: "div",
                className: "task-badge",
                text: badgeText,
              }),
              createElement({
                tag: "div",
                className: "task-info-dashboard ",
                children: [
                  createElement({
                    tag: "div",
                    className: "task-title",
                    text: task.title,
                  }),
                  createElement({
                    tag: "div",
                    className: "task-status",
                    text: `${task.isCompleted ? "Completed" : "In Progress"}${
                      daysRemaining ? " - " + daysRemaining : ""
                    }`,
                  }),
                ],
              }),
              createElement({
                tag: "button",
                className: "mark-complete-btn-dashboard",
                text: task.isCompleted ? "Mark Incomplete" : "Mark Complete",
                style: {
                  backgroundColor:
                    task.isCompleted === 1 ? "var(--red)" : "var(--green)",
                },
                onClick: () => {
                  const taskStatus = task.isCompleted
                    ? "incomplete"
                    : "complete";
                  this.toggleTaskStatus(task.taskId, taskStatus);
                },
              }),
            ],
          })
        );
      });
    }
  };

  //CORE LOGIC------------------------------------------------------
  delete() {
    document.querySelector(".dashboard-container")?.remove();
  }

  //API CALLS------------------------------------------------------
  async toggleTaskStatus(taskId: string, taskStatus: string) {
    await new TaskService(
      `http://localhost:3000/tasks/${taskId}/toggle-status`
    ).markTaskAsComplete(taskId, taskStatus);

    await this.fetchAllUserTasks();
    this.renderTasksSection(
      document.getElementById(".tasks-section") as HTMLElement,
      true
    );
  }

  async fetchAllUserProjects() {
    let result = (await new ProjectsService(
      "http://localhost:3000/get-all-user-projects"
    ).fetchAllUserProjects()) as Project[];

    this.projects = result;
  }

  fetchAllUserTasks = async () => {
    let result = (await new TaskService(
      "http://localhost:3000/tasks/get-all-user-tasks"
    ).getAllTasks()) as Task[];

    this.tasks = result;
  };
}
