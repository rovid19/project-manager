import "../../../Styles/Views/Tasks/TaskDetailsPopup.css";
import "../../../Styles/SharedStylings/Popup.css";
import { store } from "../../../Store/Store";
import { createPopupModal } from "../../../Components/PopupModal";
import { createElement } from "../../../Utils/Helpers";

export class TaskDetailsPopup {
  taskId: string = "";
  popupElement: HTMLElement | null = null;
  taskData: any = null;
  handleManagerClassReset: () => void = () => {};

  constructor(taskId: string, handleManagerClassReset: () => void) {
    this.taskId = taskId;
    this.handleManagerClassReset = handleManagerClassReset;
    this.createModal();
  }

  async createModal() {
    const popup = createPopupModal(this.handleClosePopup);

    // Fetch task data
    await this.fetchTaskDetails();

    // Create task details content
    this.createTaskDetailsContent(popup.children[0].children[1]);

    store.getState().mainDivApp.appendChild(popup);
  }

  async fetchTaskDetails() {
    // In production, replace with actual API call
    // const taskService = new TaskService(`http://localhost:3000/task/${this.taskId}`);
    // this.taskData = await taskService.getTaskDetails();

    // Mock data for development
    this.taskData = {
      id: this.taskId,
      title: "Design Homepage Layout",
      description:
        "Create a responsive homepage design with modern UI elements and optimized for mobile devices. Include hero section, features, and testimonials.",
      status: "In Progress",
      deadline: "2023-12-15",
      createdAt: "2023-11-01",
      projectName: "Website Revamp",
      teamName: "Team Alpha",
      assignee: {
        username: "johndoe",
        userId: "user123",
        email: "john@example.com",
      },
      creator: {
        username: "janedoe",
        userId: "user456",
        email: "jane@example.com",
      },
    };
  }

  createTaskDetailsContent(container: HTMLElement) {
    if (!this.taskData) return;

    const statusClass = `status-${this.taskData.status
      .toLowerCase()
      .replace(/\s+/g, "-")}`;

    const taskDetailsContent = createElement({
      tag: "div",
      className: "task-details-container",
      children: [
        createElement({
          tag: "div",
          className: "task-details-header",
          children: [
            createElement({
              tag: "h2",
              className: "task-details-title",
              text: this.taskData.title,
            }),
            createElement({
              tag: "span",
              className: `task-details-status`,
              text: this.taskData.status,
            }),
          ],
        }),
        createElement({
          tag: "div",
          className: "task-details-meta",
          children: [
            createElement({
              tag: "div",
              className: "meta-item",
              children: [
                createElement({
                  tag: "span",
                  className: "meta-label",
                  text: "Project:",
                }),
                createElement({
                  tag: "span",
                  className: "meta-value",
                  text: this.taskData.projectName,
                }),
              ],
            }),
            createElement({
              tag: "div",
              className: "meta-item",
              children: [
                createElement({
                  tag: "span",
                  className: "meta-label",
                  text: "Team:",
                }),
                createElement({
                  tag: "span",
                  className: "meta-value",
                  text: this.taskData.teamName,
                }),
              ],
            }),
            createElement({
              tag: "div",
              className: "meta-item",
              children: [
                createElement({
                  tag: "span",
                  className: "meta-label",
                  text: "Deadline:",
                }),
                createElement({
                  tag: "span",
                  className: "meta-value-deadline",
                  text: new Date(this.taskData.deadline).toLocaleDateString(),
                }),
              ],
            }),
            createElement({
              tag: "div",
              className: "meta-item",
              children: [
                createElement({
                  tag: "span",
                  className: "meta-label",
                  text: "Created:",
                }),
                createElement({
                  tag: "span",
                  className: "meta-value",
                  text: new Date(this.taskData.createdAt).toLocaleDateString(),
                }),
              ],
            }),
          ],
        }),
        createElement({
          tag: "div",
          className: "task-details-section",
          children: [
            createElement({
              tag: "h3",
              className: "section-title",
              text: "Description",
            }),
            createElement({
              tag: "p",
              className: "task-description",
              text: this.taskData.description,
            }),
          ],
        }),
        createElement({
          tag: "div",
          className: "task-details-section",
          children: [
            createElement({
              tag: "h3",
              className: "section-title",
              text: "Assigned To",
            }),
            createElement({
              tag: "div",
              className: "user-info",
              children: [
                createElement({
                  tag: "div",
                  className: "user-avatar",
                  children: [
                    createElement({
                      tag: "span",
                      text: this.taskData.assignee.username
                        .charAt(0)
                        .toUpperCase(),
                    }),
                  ],
                }),
                createElement({
                  tag: "div",
                  className: "user-details",
                  children: [
                    createElement({
                      tag: "span",
                      className: "user-name",
                      text: this.taskData.assignee.username,
                    }),
                    createElement({
                      tag: "span",
                      className: "user-email",
                      text: this.taskData.assignee.email,
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
        createElement({
          tag: "div",
          className: "task-details-section",
          children: [
            createElement({
              tag: "h3",
              className: "section-title",
              text: "Created By",
            }),
            createElement({
              tag: "div",
              className: "user-info",
              children: [
                createElement({
                  tag: "div",
                  className: "user-avatar",
                  children: [
                    createElement({
                      tag: "span",
                      text: this.taskData.creator.username
                        .charAt(0)
                        .toUpperCase(),
                    }),
                  ],
                }),
                createElement({
                  tag: "div",
                  className: "user-details",
                  children: [
                    createElement({
                      tag: "span",
                      className: "user-name",
                      text: this.taskData.creator.username,
                    }),
                    createElement({
                      tag: "span",
                      className: "user-email",
                      text: this.taskData.creator.email,
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
        createElement({
          tag: "div",
          className: "task-details-actions",
          children: [
            createElement({
              tag: "button",
              className: "edit-task-btn",
              text: "Edit Task",
              onClick: () => this.handleEditTask(),
            }),
            createElement({
              tag: "button",
              className: `status-toggle-btn`,
              text:
                this.taskData.status === "Completed"
                  ? "Mark Incomplete"
                  : "Mark Complete",
              onClick: () => this.handleToggleStatus(),
            }),
          ],
        }),
      ],
    });

    container.appendChild(taskDetailsContent);
  }

  handleClosePopup = () => {
    document.querySelector(".popup-overlay")?.remove();
  };

  async handleToggleStatus() {
    const newStatus =
      this.taskData.status === "Completed" ? "In Progress" : "Completed";

    // In production, use actual API call
    // const taskService = new TaskService(`http://localhost:3000/update-task-status/${this.taskId}`);
    // await taskService.updateTaskStatus({ status: newStatus });

    console.log(`Task status updated to: ${newStatus}`);

    // Update UI
    this.taskData.status = newStatus;

    // Close popup and refresh view
    this.handleClosePopup();
    this.handleManagerClassReset();
  }

  handleEditTask() {
    console.log(`Edit task: ${this.taskId}`);
    // Implement edit task functionality
    // Could open another popup or navigate to edit page
  }
}
