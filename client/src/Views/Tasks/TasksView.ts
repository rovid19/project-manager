import { createElement } from "../../Utils/Helpers";
import "../../Styles/Views/Tasks/Tasks.css";
import "../../Styles/SharedStylings/SectionHeader.css";
import "../../Styles/SharedStylings/UpperInnerSection.css";
import { store } from "../../Store/Store";
import { TaskDetailsPopup } from "./TaskDetailsPopup/TaskDetailsPopup";
import { TaskService } from "../../Services/TaskService";
import { TeamsService } from "../../Services/TeamsService";
import { Team } from "../../Types/TeamsTypes";
import { ProjectsService } from "../../Services/ProjectsService";
import { Project } from "../../Types/ProjectsTypes";

export class TasksView {
  private userProjects: any = [];
  private userTasks: any = [];
  private userTeams: any = [];
  private tasks: any = [];
  private sortBy: string = "projects"; // Default sort by teams
  private filterStatus: { [key: string]: string } = {}; // Store filter status for each team

  constructor() {}

  //UI RENDER------------------------------------------------------
  async createTasks() {
    const tasksContainer = createElement({
      tag: "div",
      className: "tasks-container",
    });

    store.getState().mainSection.appendChild(tasksContainer);

    this.renderHeader(tasksContainer);

    const tasksDashboard = createElement({
      tag: "div",
      className: "tasks-dashboard",
    });

    tasksContainer.appendChild(tasksDashboard);

    await this.fetchUserTasks();
    this.renderTasks();
  }

  private renderHeader(container: HTMLElement) {
    const header = createElement({
      tag: "header",
      className: "tasks-header",
      children: [
        createElement({
          tag: "div",
          className: "header-left",
          children: [
            createElement({
              tag: "h1",
              className: "page-title",
              text: "Tasks",
            }),
            createElement({
              tag: "p",
              className: "page-subtitle",
              text: "Manage your tasks across all projects",
            }),
          ],
        }),
        createElement({
          tag: "div",
          className: "header-actions",
          children: [
            createElement({
              tag: "div",
              className: "sort-control",
              children: [
                createElement({
                  tag: "label",
                  className: "sort-label",
                  text: "Group by:",
                }),
                createElement({
                  tag: "select",
                  className: "sort-select",
                  children: [
                    createElement({
                      tag: "option",
                      value: "teams",
                      text: "Teams",
                      selected: this.sortBy === "teams",
                    }),
                    createElement({
                      tag: "option",
                      value: "projects",
                      text: "Projects",
                      selected: this.sortBy === "projects",
                    }),
                  ],
                  onChange: (e: Event) => this.handleSortChange(e),
                }),
              ],
            }),
          ],
        }),
      ],
    });

    container.appendChild(header);
  }

  renderTasks() {
    const tasksContainer = document.querySelector(
      ".tasks-dashboard"
    ) as HTMLElement;

    if (!tasksContainer) return;

    tasksContainer.innerHTML = "";

    if (this.tasks.length === 0) {
      tasksContainer.appendChild(
        createElement({
          tag: "div",
          className: "no-tasks",
          children: [
            createElement({
              tag: "p",
              text: "You don't have any tasks assigned to you yet.",
            }),
          ],
        })
      );
      return;
    }

    this.tasks.forEach((item: any) => {
      const teamOrProjectName = Object.keys(item)[0];
      const teamOrProjectTasks = Object.values(item[teamOrProjectName]);
      const teamSection = createElement({
        tag: "div",
        className: "team-tasks-section",
        children: [
          createElement({
            tag: "div",
            className: "team-tasks-header",
            children: [
              createElement({
                tag: "div",
                className: "team-header-left",
                children: [
                  createElement({
                    tag: "h4",
                    className: "team-name",
                    text: teamOrProjectName,
                  }),
                  createElement({
                    tag: "span",
                    className: "task-count",
                    text: `${teamOrProjectTasks.length} task${
                      teamOrProjectTasks.length !== 1 ? "s" : ""
                    }`,
                  }),
                ],
              }),
              createElement({
                tag: "div",
                className: "team-filter-control",
                children: [
                  createElement({
                    tag: "select",
                    className: "filter-select",
                    data: teamOrProjectName,
                    children: [
                      createElement({
                        tag: "option",
                        value: "incomplete",
                        text: "Show Incomplete",
                        selected:
                          this.filterStatus[teamOrProjectName] === "incomplete",
                      }),
                      createElement({
                        tag: "option",
                        value: "completed",
                        text: "Show Completed",
                        selected:
                          this.filterStatus[teamOrProjectName] === "completed",
                      }),
                      createElement({
                        tag: "option",
                        value: "all",
                        text: "Show All",
                        selected:
                          this.filterStatus[teamOrProjectName] === "all",
                      }),
                    ],
                    onChange: (e: Event) =>
                      this.handleFilterChange(e, teamOrProjectName),
                  }),
                ],
              }),
            ],
          }),
          createElement({
            tag: "div",
            className: "tasks-grid",
          }),
        ],
      });

      const tasksGrid = teamSection.querySelector(".tasks-grid") as HTMLElement;

      const filteredTasks = teamOrProjectTasks.filter((task: any) => {
        if (this.filterStatus[teamOrProjectName] === "all") return true;
        const taskStatus = task.isCompleted === 1 ? "completed" : "incomplete";
        return taskStatus === this.filterStatus[teamOrProjectName];
      });

      filteredTasks.forEach((task: any) => {
        const taskCard = createElement({
          tag: "div",
          className: `task-card`,
          children: [
            createElement({
              tag: "div",
              className: "task-card-header",
              children: [
                createElement({
                  tag: "h5",
                  className: "task-title",
                  text: task.title,
                }),
              ],
            }),
            createElement({
              tag: "div",
              className: "task-card-details",
              children: [
                createElement({
                  tag: "div",
                  className: "task-project",
                  children: [
                    createElement({
                      tag: "span",
                      className: "detail-label",
                      text: "Project:",
                    }),
                    createElement({
                      tag: "span",
                      className: "project-name",
                      text: task.projectName,
                    }),
                  ],
                }),
                createElement({
                  tag: "div",
                  className: "task-deadline",
                  children: [
                    createElement({
                      tag: "span",
                      className: "detail-label",
                      text: "Deadline:",
                    }),
                    createElement({
                      tag: "span",
                      className: "deadline-date",
                      text: new Date(task.deadline).toLocaleDateString(),
                    }),
                  ],
                }),
              ],
            }),
            createElement({
              tag: "div",
              className: "task-card-actions",
              children: [
                createElement({
                  tag: "button",
                  className: "view-task-btn",
                  text: "View Details",
                  onClick: () => this.viewTaskDetails(task.taskId),
                }),
                createElement({
                  tag: "button",
                  className: "mark-complete-btn",
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
            }),
          ],
        });

        tasksGrid.appendChild(taskCard);
      });

      tasksContainer.appendChild(teamSection);
    });
  }

  //CORE LOGIC------------------------------------------------------
  delete() {
    document.querySelector(".tasks-container")?.remove();
  }

  viewTaskDetails(taskId: string) {
    new TaskDetailsPopup(taskId, () => this.renderTasks());
  }

  initializeFilterStatus() {
    this.filterStatus = {};

    if (this.sortBy === "teams") {
      this.userTeams.forEach((team: Team) => {
        this.filterStatus[team.teamName as string] = "incomplete";
      });
    } else {
      this.userProjects.forEach((project: Project) => {
        this.filterStatus[project.title as string] = "incomplete";
      });
    }

    console.log(this.filterStatus);
  }

  sortTasks(sortBy: string) {
    let objectArray: any;
    if (sortBy === "teams") {
      objectArray = this.userTeams.map((team: Team) => ({
        [team.teamName as string]: {},
      }));

      this.userTeams.forEach((team: Team, i: number) => {
        this.userTasks.forEach((task: any) => {
          if (task.teamId === team.teamId) {
            objectArray[i][team.teamName as string] = {
              ...objectArray[i][team.teamName as string],
              [task.title]: { ...task },
            };
          }
        });
      });
    } else {
      objectArray = this.userProjects.map((project: Project) => ({
        [project.title as string]: {},
      }));
      this.userProjects.forEach((project: Project, i: number) => {
        this.userTasks.forEach((task: any) => {
          if (project.projectId === task.projectId) {
            objectArray[i][project.title as string] = {
              ...objectArray[i][project.title as string],
              [task.title]: { ...task },
            };
          }
        });
      });
    }

    this.tasks = objectArray;
  }

  private handleSortChange(e: Event) {
    const select = e.target as HTMLSelectElement;
    this.sortBy = select.value;

    this.initializeFilterStatus();

    this.sortTasks(this.sortBy);
    document
      .querySelectorAll(".teams-tasks-section")
      .forEach((el) => el.remove());
    this.renderTasks();
  }

  private handleFilterChange(e: Event, teamName: string) {
    const select = e.target as HTMLSelectElement;
    this.filterStatus[teamName] = select.value;
    store.setState({ tasksFilterStatus: this.filterStatus });
    this.renderTasks();
  }

  //API CALLS------------------------------------------------------
  async fetchUserTasks() {
    const userTasks = await new TaskService(
      `http://localhost:3000/tasks/get-all-user-tasks`
    ).getAllTasks();

    const userTeams = await new TeamsService(
      `http://localhost:3000/get-all-user-teams`
    ).getAllTeams();

    const userProjects = await new ProjectsService(
      `http://localhost:3000/get-all-user-projects`
    ).fetchAllUserProjects();

    this.userProjects = userProjects;
    this.userTeams = userTeams;
    this.userTasks = userTasks;

    this.sortTasks(this.sortBy);

    const filterStatus = store.getState().tasksFilterStatus;
    if (Object.values(filterStatus).length === 0) this.initializeFilterStatus();
  }

  async toggleTaskStatus(taskId: string, taskStatus: string) {
    try {
      await new TaskService(
        `http://localhost:3000/tasks/${taskId}/toggle-status`
      ).markTaskAsComplete(taskId, taskStatus);

      await this.fetchUserTasks();
      this.renderTasks();
    } catch (error) {
      console.error("Error toggling task status:", error);
    }
  }
}
