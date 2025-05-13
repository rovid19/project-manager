import { createElement } from "../../Utils/Helpers";
import "../../Styles/Views/Tasks/Tasks.css";
import "../../Styles/SharedStylings/SectionHeader.css";
import "../../Styles/SharedStylings/UpperInnerSection.css";

import { store } from "../../Store/Store";
import { userStore } from "../../Store/UserStore";
import { TaskDetailsPopup } from "./TaskDetails/TaskDetailsPopup";
import { TaskService } from "../../Services/TaskService";
import { TeamsService } from "../../Services/TeamsService";

export class TasksView {
  private taskData: any = [];

  constructor() {}

  delete() {
    document.querySelector(".upper-section")?.remove();
  }

  async createTasks() {
    const tasksContainer = createElement({
      tag: "div",
      className: "upper-section",
      children: [
        createElement({
          tag: "div",
          className: "inner-section",
          children: [
            createElement({
              tag: "div",
              className: "section-header",
              children: [
                createElement({
                  tag: "h3",
                  className: "section-title",
                  text: "Tasks",
                }),
              ],
            }),
            createElement({
              tag: "div",
              className: "tasks-container",
            }),
          ],
        }),
      ],
    });

    const currentState = store.getState();
    currentState.mainSection.appendChild(tasksContainer);

    // Fetch tasks data
    await this.fetchUserTasks();

    // Render tasks by team
    this.renderTasksByTeam();
  }
  async fetchUserTasks() {
    const allTasks = await new TaskService(
      `http://localhost:3000/tasks/get/${userStore.getState().userId}`
    ).getAllTasks();

    const userTeams = await new TeamsService(
      `http://localhost:3000/get-all-user-teams`
    ).getAllTeams();

    //this.tasksByTeam = allTasks;
    userTeams.forEach((team) => {
      /* allTasks.forEach(task => {
      if(task.)
     })*/
    });

    console.log(userTeams, allTasks);
  }

  renderTasksByTeam() {
    const tasksContainer = document.querySelector(
      ".tasks-container"
    ) as HTMLElement;

    if (!tasksContainer) return;

    // Clear existing content
    tasksContainer.innerHTML = "";

    // If no tasks
    if (Object.keys(this.tasksByTeam).length === 0) {
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
    this.userTeams.forEach((item: any) => {
      console.log(item);
      const teamSection = createElement({
        tag: "div",
        className: "team-tasks-section",
        children: [
          createElement({
            tag: "div",
            className: "team-tasks-header",
            children: [
              createElement({
                tag: "h4",
                className: "team-name",
                text: item.teamName,
              }),
              createElement({
                tag: "span",
                className: "task-count",
                text: `${item.tasks.length} task${
                  tasks.length !== 1 ? "s" : ""
                }`,
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

      // Add task cards
      /* tasks.forEach((task) => {
        const statusClass = `status-${task.status
          .toLowerCase()
          .replace(/\s+/g, "-")}`;

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
                  text: task.status,
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
                  onClick: () => this.viewTaskDetails(task.id),
                }),
                createElement({
                  tag: "button",
                  className: "mark-complete-btn",
                  text:
                    task.status === "Completed"
                      ? "Mark Incomplete"
                      : "Mark Complete",
                  onClick: () => this.toggleTaskStatus(task.id),
                }),
              ],
            }),
          ],
        });

        tasksGrid.appendChild(taskCard);
      });*/

      tasksContainer.appendChild(teamSection);
    });
  }

  viewTaskDetails(taskId: string) {
    // Open task details popup
    new TaskDetailsPopup(taskId, () => this.renderTasksByTeam());
  }

  toggleTaskStatus(taskId: string) {
    // Toggle task status logic
    console.log(`Toggle status for task ${taskId}`);
    // Update in backend and refresh view
  }
}
