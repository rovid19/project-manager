import { TaskService } from "../../../../Services/TaskService";
import { createElement } from "../../../../Utils/Helpers";
import "../../../../Styles/Views/Projects/Project/ProjectPopup.css";
import { MembersData } from "../../../../Types/ProjectsTypes";

export class ProjectTaskPopup {
  title: string = "";
  description: string = "";
  deadline: Date = new Date();
  assignee: string = "";
  projectId: string = "";
  popupElement: HTMLElement | null = null;
  membersData: MembersData[] | null = null;
  handleManagerClassReset: () => void = () => {};
  fetchUserProject: () => Promise<void> = async () => {};
  formErrors: { [key: string]: string } = {};

  constructor(
    popup: HTMLElement,
    projectId: string,
    fetchUserProject: () => Promise<void>,
    membersData: MembersData[],
    handleManagerClassReset: () => void
  ) {
    this.popupElement = popup;
    this.projectId = projectId;
    this.membersData = membersData;
    this.createTaskPopup(this.popupElement);
    this.fetchUserProject = fetchUserProject;
    this.handleManagerClassReset = handleManagerClassReset;
  }

  createTaskPopup(mainDiv: HTMLElement) {
    const taskForm = createElement({
      tag: "form",
      className: "task-popup-form",
      children: [
        createElement({
          tag: "h3",
          className: "task-popup-title",
          text: "Create New Task",
        }),
        // Title input group
        createElement({
          tag: "div",
          className: "input-group",
          children: [
            createElement({
              tag: "label",
              className: "input-label",
              text: "Task Title",
            }),
            createElement({
              tag: "input",
              className: "task-title-input",
              name: "title",
              placeholder: "Enter task title",
              type: "text",
            }),
            createElement({
              tag: "span",
              className: "error-message",
              style: "display: none;",
              text: "Task title is required",
            }),
          ],
        }),
        // Description input group
        createElement({
          tag: "div",
          className: "input-group",
          children: [
            createElement({
              tag: "label",
              className: "input-label",
              text: "Task Description",
            }),
            createElement({
              tag: "textarea",
              className: "task-description-input",
              name: "description",
              placeholder: "Enter task description",
              rows: "4",
            }),
            createElement({
              tag: "span",
              className: "error-message",
              style: "display: none;",
              text: "Task description is required",
            }),
          ],
        }),
        // Deadline input group
        createElement({
          tag: "div",
          className: "input-group",
          children: [
            createElement({
              tag: "label",
              className: "input-label",
              text: "Task Deadline",
            }),
            createElement({
              tag: "input",
              className: "task-deadline-input",
              name: "deadline",
              type: "date",
              placeholder: "Task Deadline",
            }),
            createElement({
              tag: "span",
              className: "error-message",
              style: "display: none;",
              text: "Task deadline is required",
            }),
          ],
        }),
        // Assignee input group
        createElement({
          tag: "div",
          className: "input-group",
          children: [
            createElement({
              tag: "label",
              className: "input-label",
              text: "Assign Task To",
            }),
            createElement({
              tag: "select",
              className: "task-assignee-select",
              name: "assignedMember",
              children: [
                createElement({
                  tag: "option",
                  value: "",
                  text: "Select Team Member",
                  disabled: true,
                  selected: true,
                }),
              ],
            }),
            createElement({
              tag: "span",
              className: "error-message",
              style: "display: none;",
              text: "Please select a team member",
            }),
          ],
        }),
        // Submit button
        createElement({
          tag: "button",
          className: "create-task-btn",
          type: "submit",
          text: "Create Task",
          onClick: (e: Event) => {
            e.preventDefault();
            if (this.validateForm()) {
              this.handleCreateNewTask(e);
            }
          },
        }),
      ],
    });

    this.renderMemberInSelectDropdown(
      taskForm.children[4].children[1] as HTMLSelectElement
    );
    mainDiv.appendChild(taskForm);
    this.setupTaskFormEventDelegation(taskForm);
  }

  private validateForm(): boolean {
    let isValid = true;
    this.formErrors = {};

    // Validate title
    const titleInput = document.querySelector(
      ".task-title-input"
    ) as HTMLInputElement;
    const titleError = titleInput.parentElement?.querySelector(
      ".error-message"
    ) as HTMLElement;

    if (!titleInput.value.trim()) {
      titleInput.classList.add("input-error");
      titleError.style.display = "block";
      this.formErrors.title = "Task title is required";
      isValid = false;
    } else {
      titleInput.classList.remove("input-error");
      titleError.style.display = "none";
    }

    // Validate description
    const descriptionInput = document.querySelector(
      ".task-description-input"
    ) as HTMLTextAreaElement;
    const descriptionError = descriptionInput.parentElement?.querySelector(
      ".error-message"
    ) as HTMLElement;

    if (!descriptionInput.value.trim()) {
      descriptionInput.classList.add("input-error");
      descriptionError.style.display = "block";
      this.formErrors.description = "Task description is required";
      isValid = false;
    } else {
      descriptionInput.classList.remove("input-error");
      descriptionError.style.display = "none";
    }

    // Validate deadline
    const deadlineInput = document.querySelector(
      ".task-deadline-input"
    ) as HTMLInputElement;
    const deadlineError = deadlineInput.parentElement?.querySelector(
      ".error-message"
    ) as HTMLElement;

    if (!deadlineInput.value) {
      deadlineInput.classList.add("input-error");
      deadlineError.style.display = "block";
      this.formErrors.deadline = "Task deadline is required";
      isValid = false;
    } else {
      deadlineInput.classList.remove("input-error");
      deadlineError.style.display = "none";
    }

    // Validate assignee
    const assigneeSelect = document.querySelector(
      ".task-assignee-select"
    ) as HTMLSelectElement;
    const assigneeError = assigneeSelect.parentElement?.querySelector(
      ".error-message"
    ) as HTMLElement;

    if (!this.assignee) {
      assigneeSelect.classList.add("input-error");
      assigneeError.style.display = "block";
      this.formErrors.assignee = "Please select a team member";
      isValid = false;
    } else {
      assigneeSelect.classList.remove("input-error");
      assigneeError.style.display = "none";
    }

    return isValid;
  }

  private handleIdSort(assigneeUsername: string) {
    this.membersData?.find((member) => {
      if (member.username === assigneeUsername) {
        this.assignee = member.userId;
      }
    });
  }

  private handleDeleteTaskPopup() {
    document.querySelector(".popup-overlay")?.remove();
  }

  private renderMemberInSelectDropdown(selectElement: HTMLSelectElement) {
    this.membersData?.forEach((member) => {
      const element = createElement({
        tag: "option",
        className: "select-option",
        value: member.username,
        text: member.username,
        disabled: false,
        data: member.username,
      });

      selectElement.appendChild(element);
    });
  }

  private async handleCreateNewTask(e: Event) {
    e.preventDefault();

    // Show loading state on button
    const button = e.target as HTMLButtonElement;
    const originalText = button.textContent || "Create Task";
    button.textContent = "Creating...";
    button.disabled = true;

    try {
      let apiCall: TaskService | null = new TaskService(
        `http://localhost:3000/create-new-task`
      );
      await apiCall.handleTaskCreation({
        title: this.title,
        description: this.description,
        deadline: this.deadline,
        assignee: this.assignee,
        projectId: this.projectId,
      });

      apiCall = null;

      this.handleDeleteTaskPopup();
      this.handleManagerClassReset();
    } catch (error) {
      console.error("Error creating task:", error);

      // Reset button state
      button.textContent = originalText;
      button.disabled = false;

      // Show error message
      alert("Failed to create task. Please try again.");
    }
  }

  private setupTaskFormEventDelegation(form: HTMLElement) {
    form.addEventListener("input", (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (target.matches("input, textarea, select")) {
        // Clear error styling when user starts typing
        target.classList.remove("input-error");
        const errorElement =
          target.parentElement?.querySelector(".error-message");
        if (errorElement) {
          (errorElement as HTMLElement).style.display = "none";
        }

        switch (target.name) {
          case "title":
            this.title = target.value;
            break;
          case "description":
            this.description = target.value;
            break;
          case "deadline":
            this.deadline = new Date(target.value);
            break;
          case "assignedMember":
            this.handleIdSort(target.value);
            break;
        }
      }
    });
  }
}
