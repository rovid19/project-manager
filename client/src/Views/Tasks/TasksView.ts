import { createElement } from "../../Utils/Helpers";
import "../../Styles/Views/Tasks/Tasks.css";
import "../../Styles/SharedStylings/SectionHeader.css";
import "../../Styles/SharedStylings/UpperInnerSection.css";

import { store } from "../../Store/Store";
import { Project, userStore } from "../../Store/UserStore";
import { TaskDetailsPopup } from "./TaskDetails/TaskDetailsPopup";
import { TaskService } from "../../Services/TaskService";
import { TeamsService } from "../../Services/TeamsService";
import { Team } from "../../Types/TeamsTypes";
import { ProjectsService } from "../../Services/ProjectsService";

export class TasksView {
  private userProjects: any = [];
  private userTasks: any = [];
  private userTeams: any = [];
  private tasks: any = [];

  private sortBy: string = "projects"; // Default sort by teams
  private filterStatus: { [key: string]: string } = {}; // Store filter status for each team

  constructor() {}

  delete() {
    document.querySelector(".tasks-container")?.remove();
  }

  async createTasks() {
    const tasksContainer = createElement({
      tag: "div",
      className: "tasks-container",
    });

    store.getState().mainSection.appendChild(tasksContainer);

    // Render header with actions
    this.renderHeader(tasksContainer);

    // Render tasks dashboard
    const tasksDashboard = createElement({
      tag: "div",
      className: "tasks-dashboard",
    });

    tasksContainer.appendChild(tasksDashboard);

    // Fetch tasks data
    await this.fetchUserTasks();

    // Render tasks
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

  async fetchUserTasks() {
    const userTasks = await new TaskService(
      `http://localhost:3000/tasks/get/${userStore.getState().userId}`
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

    console.log(userProjects);

    // Initialize filter status for each team
    this.userTeams.forEach((team: Team) => {
      this.filterStatus[team.teamName as string] = "incomplete";
    });

    this.sortTasks("pojects");
  }

  sortTasks(sortBy: string) {
    let objectArray: any;
    // create an array of objects, each object representing a team
    if (sortBy === "teams") {
      objectArray = this.userTeams.map((team: Team) => ({
        [team.teamName as string]: {},
      }));
      // loop through each team and add tasks to the corresponding team object
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

  sortTasksByProjects() {
    // create an array of objects, each object representing a team
    const projectsObjectArray = this.userProjects.forEach(
      (project: Project, i: number) => {
        this.userTasks((task: any) => {
          if (project.projectId === task.projectId) {
          }
        });
      }
    );
  }

  renderTasks() {
    const tasksContainer = document.querySelector(
      ".tasks-dashboard"
    ) as HTMLElement;

    if (!tasksContainer) return;

    // Clear existing content
    tasksContainer.innerHTML = "";

    // If no tasks
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

    // Create team sections
    this.tasks.forEach((item: any) => {
      const objKey = Object.keys(item)[0];
      const objValueArray = Object.values(item[objKey]);

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
                    text: objKey,
                  }),
                  createElement({
                    tag: "span",
                    className: "task-count",
                    text: `${objValueArray.length} task${
                      objValueArray.length !== 1 ? "s" : ""
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
                    data: objKey,
                    children: [
                      createElement({
                        tag: "option",
                        value: "incomplete",
                        text: "Show Incomplete",
                        selected: this.filterStatus[objKey] === "incomplete",
                      }),
                      createElement({
                        tag: "option",
                        value: "completed",
                        text: "Show Completed",
                        selected: this.filterStatus[objKey] === "completed",
                      }),
                      createElement({
                        tag: "option",
                        value: "all",
                        text: "Show All",
                        selected: this.filterStatus[objKey] === "all",
                      }),
                    ],
                    onChange: (e) => this.handleFilterChange(e, objKey),
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

      // Filter tasks based on completion status
      const filteredTasks = this.filterTasks(
        objValueArray,
        this.filterStatus[objKey]
      );

      // Add task cards
      filteredTasks.forEach((task) => {
        console.log(task);
        /* const statusClass = `status-${task.isCompleted
          .toLowerCase()
          .replace(/\s+/g, "-")}`;*/

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
                createElement({
                  tag: "span",
                  className: `task-status`,
                  text: task.isCompleted,
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
                  onClick: () => this.toggleTaskStatus(task.taskId),
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

  // Helper method to filter tasks based on completion status
  private filterTasks(tasks: any[], filterStatus: string) {
    if (filterStatus === "all") return tasks;

    return tasks.filter((task) => {
      if (filterStatus === "completed") {
        return task.isCompleted === "Completed";
      } else {
        return task.isCompleted !== "Completed";
      }
    });
  }

  // Handle sort dropdown change
  private handleSortChange(e: Event) {
    const select = e.target as HTMLSelectElement;
    this.sortBy = select.value;

    this.sortTasks(this.sortBy);
    document
      .querySelectorAll(".teams-tasks-section")
      .forEach((el) => el.remove());
    this.renderTasks();
  }

  // Handle filter dropdown change
  private handleFilterChange(e: Event, teamName: string) {
    const select = e.target as HTMLSelectElement;
    this.filterStatus[teamName] = select.value;

    // Re-render tasks with the new filter
    this.renderTasks();
  }

  viewTaskDetails(taskId: string) {
    // Open task details popup
    new TaskDetailsPopup(taskId, () => this.renderTasks());
  }

  async toggleTaskStatus(taskId: string) {
    /* try {
  // Call API to toggle task status
      await new TaskService(
        `http://localhost:3000/tasks/toggle-status/${taskId}`
      ).toggleTaskStatus();

      // Refresh tasks data and re-render
      await this.fetchUserTasks();
      this.renderTasks();
    } catch (error) {
      console.error("Error toggling task status:", error);
    }*/
  }
}
