import { ProjectsService } from "../../../Services/ProjectsService";
import { createElement } from "../../../Utils/Helpers";
import { ProjectView } from "./ProjectView";
import { iconArray } from "../../../Assets/Icons";

export class ProjectViewInfoManager extends ProjectView {
  projectId: string;
  title: string = "";
  description: string = "";
  projectContainerElement: HTMLElement | null = null;
  handleManagerClassReset: () => Promise<void>;

  constructor(
    projectId: string,
    title: string,
    description: string,
    projectContainerElement: HTMLElement,
    handleManagerClassReset: () => Promise<void>
  ) {
    super();
    this.projectId = projectId;
    this.title = title;
    this.description = description;
    this.projectContainerElement = projectContainerElement;
    this.handleManagerClassReset = handleManagerClassReset;
    this.renderProjectInfo();
  }

  //UI RENDER------------------------------------------------------
  renderProjectInfo() {
    // Get a random icon from the iconArray for demonstration
    const randomIcon = iconArray[Math.floor(Math.random() * iconArray.length)];

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
                      placeholder: "Enter project title",
                      value: this.title,
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
                      placeholder: "Enter project description",
                      value: this.description,
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
                    this.handleEditProjectInfo();
                  },
                }),
              ],
            }),
            createElement({
              tag: "div",
              className: "project-icon-div",
              innerHTML: randomIcon || this.icon,
            }),
          ],
        }),
      ],
    });

    (this.projectContainerElement as HTMLElement).appendChild(projectInfo);
    this.setupProjectInfoFormEventDelegation(
      projectInfo.children[0].children[0] as HTMLElement
    );
  }

  //API CALLS------------------------------------------------------
  async handleEditProjectInfo() {
    try {
      let apiCall = new ProjectsService(
        `http://localhost:3000/handle-project-submissions/${this.projectId}`
      );

      const data = await apiCall.submitNewProjectDetails({
        title: this.title,
        description: this.description,
      });

      this.title = data[0].title;
      this.description = data[0].description;

      // Show success message
      const successMessage = document.createElement("div");
      successMessage.className = "success-message";
      successMessage.textContent = "Project updated successfully!";
      document.body.appendChild(successMessage);

      // Remove message after 3 seconds
      setTimeout(() => {
        successMessage.remove();
      }, 3000);

      await this.handleManagerClassReset();
    } catch (error) {
      console.error("Error updating project:", error);

      // Show error message
      const errorMessage = document.createElement("div");
      errorMessage.className = "error-message";
      errorMessage.textContent = "Failed to update project. Please try again.";
      document.body.appendChild(errorMessage);

      // Remove message after 3 seconds
      setTimeout(() => {
        errorMessage.remove();
      }, 3000);
    }
  }

  //LISTENERS------------------------------------------------------
  setupProjectInfoFormEventDelegation(form: HTMLElement) {
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
}
