import { ProjectsService } from "../../../Services/ProjectsService";
import { createElement } from "../../../Utils/Helpers";
import { ProjectView } from "./ProjectView";

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
    this.renderProjectInfo();
    this.handleManagerClassReset = handleManagerClassReset;
  }

  //UI RENDER------------------------------------------------------
  renderProjectInfo() {
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
                    this.handleEditProjectInfo();
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
      ],
    });

    (this.projectContainerElement as HTMLElement).appendChild(projectInfo);
    this.setupProjectInfoFormEventDelegation(
      projectInfo.children[0].children[0]
    );
  }

  //API CALLS------------------------------------------------------
  async handleEditProjectInfo() {
    let apiCall = new ProjectsService(
      `http://localhost:3000/handle-project-submissions/${this.projectId}`
    );

    const data = await apiCall.submitNewProjectDetails({
      title: this.title,
      description: this.description,
    });

    this.title = data[0].title;
    this.description = data[0].description;

    //this.handleSetProjectData(data[0]);
    //this.handleUpdateProjectInfoInputFields();
    this.handleManagerClassReset();
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
