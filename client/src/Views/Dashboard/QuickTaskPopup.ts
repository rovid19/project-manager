import { createElement } from "../../Utils/Helpers";
import { ProjectsService } from "../../Services/ProjectsService";
import { TaskService } from "../../Services/TaskService";
import { userStore } from "../../Store/UserStore";
import { createPopupModal } from "../../Components/PopupModal";
import "../../Styles/Views/Dashboard/QuickTaskPopup.css";
import { store } from "../../Store/Store";
import "../../Styles/SharedStylings/Popup.css";
import { Project } from "../../Types/ProjectsTypes";

export class QuickTaskPopup {
  private projects: Project[] = [];
  private popupContainer: HTMLElement | null = null;
  private taskName: string = "";
  private renderTasks: (parent: HTMLElement, rerender: boolean) => void;
  private fetchAllUserTasks: () => Promise<void>;

  constructor(
    renderTasks: (parent: HTMLElement, rerender: boolean) => void,
    fetchAllUserTasks: () => Promise<void>
  ) {
    this.renderTasks = renderTasks;
    this.fetchAllUserTasks = fetchAllUserTasks;
    this.init();
  }

  //UI RENDER------------------------------------------------------
  private createPopup() {
    const popup = createPopupModal(() => this.closePopup());
    const popupMainDiv = popup.querySelector(".popup-main-div");

    if (popupMainDiv) {
      popupMainDiv.appendChild(
        createElement({
          tag: "div",
          className: "quick-task-content",
          children: [
            createElement({
              tag: "h2",
              className: "popup-title",
              text: "Create New Task",
            }),
            createElement({
              tag: "form",
              className: "quick-task-form",
              children: [
                createElement({
                  tag: "div",
                  className: "form-group",
                  children: [
                    createElement({
                      tag: "label",
                      text: "Task Name",
                      attributes: {
                        for: "task-name",
                      },
                    }),
                    createElement({
                      tag: "input",
                      className: "task-input",
                      attributes: {
                        id: "task-name",
                        type: "text",
                        placeholder: "Enter task name",
                        required: "true",
                      },
                      oninput: (e: Event) => this.handleTaskNameChange(e),
                    }),
                  ],
                }),
                createElement({
                  tag: "div",
                  className: "form-group",
                  children: [
                    createElement({
                      tag: "label",
                      text: "Project",
                      attributes: {
                        for: "project-select",
                      },
                    }),
                    createElement({
                      tag: "select",
                      className: "project-select",
                      attributes: {
                        id: "project-select",
                        required: "true",
                      },
                      children: [
                        createElement({
                          tag: "option",
                          text: "Select a project",
                          attributes: { value: "" },
                        }),
                        ...this.projects.map((project) =>
                          createElement({
                            tag: "option",
                            text: project.title,
                            attributes: { value: project.projectId },
                          })
                        ),
                      ],
                    }),
                  ],
                }),
                createElement({
                  tag: "button",
                  className: "submit-btn",
                  text: "Create Task",
                  onClick: (e: Event) => this.handleSubmit(e),
                }),
              ],
            }),
          ],
        })
      );
    }

    store.getState().mainDivApp.appendChild(popup);
    this.popupContainer = popup;
  }

  //CORE LOGIC------------------------------------------------------
  private async init() {
    await this.fetchProjects();
    this.createPopup();
  }

  private handleTaskNameChange(e: Event) {
    const taskName = (e.target as HTMLInputElement).value;
    this.taskName = taskName;
  }

  private closePopup() {
    if (this.popupContainer) {
      this.popupContainer.remove();
    }
  }

  //API CALLS------------------------------------------------------
  private async fetchProjects() {
    try {
      this.projects = await new ProjectsService(
        "http://localhost:3000/get-all-user-projects"
      ).fetchAllUserProjects();
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  }

  private async handleSubmit(e: Event) {
    e.preventDefault();
    const projectId = (
      document.querySelector("#project-select") as HTMLSelectElement
    ).value;

    try {
      await new TaskService(
        "http://localhost:3000/task/create-new-task"
      ).handleTaskCreation({
        title: this.taskName,
        projectId: projectId,
        description: "",
        deadline: new Date(),
        assignee: userStore.getState().userId,
      });

      this.closePopup();
      await this.fetchAllUserTasks();
      this.renderTasks(
        document.getElementById(".tasks-section") as HTMLElement,
        true
      );
    } catch (error) {
      console.error("Error creating task:", error);
    }
  }
}
