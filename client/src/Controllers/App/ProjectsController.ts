import "../../Styles/Projects.css";
import { store } from "../../Store/Store";
import { createElement, formValidation } from "../../Utils/Helpers";
import "../../Styles/Projects.css";
import { backRight, icons } from "../../Assets/Icons";
import { ProjectInfo, ProjectsService } from "../../Services/ProjectsService";

export class ProjectsController {
  private projectsDiv: HTMLElement | null = null;
  private createProjectModal: HTMLElement | null = null;
  private iconSelected: string = "";
  private apiProjectData: ProjectInfo = {
    title: "",
    description: "",
    teams: "",
    icon: "",
  };
  constructor() {}

  delete() {
    document.querySelector(".projects")?.remove();
  }

  createProjects() {
    const currentState = store.getState();

    const projects = createElement({ tag: "div", className: "projects" });
    const innerProjects = createElement({
      tag: "div",
      className: "inner-projects",
    });
    this.projectsDiv = innerProjects;
    currentState.mainSection?.appendChild(projects);
    projects.appendChild(innerProjects);

    this.createPageTitle(innerProjects);
    this.createNewProjectButton(innerProjects);
    this.createProjectsGrid(innerProjects);
  }

  private createPageTitle(container: HTMLElement) {
    const pageHeader = createElement({
      tag: "div",
      className: "page-header",
      children: [createElement({ tag: "h3", text: "Projects" })],
    });
    container.appendChild(pageHeader);
  }

  private createNewProjectButton(container: HTMLElement) {
    const button = createElement({
      tag: "button",
      className: "create-project-btn",
      text: "Create New Project",

      onClick: () => {
        this.createProjectDiv();
      },
    });
    container.appendChild(button);
  }

  private createProjectsGrid(container: HTMLElement) {
    const projectsGrid = createElement({
      tag: "div",
      className: "projects-grid",
    });

    const projects = [
      {
        title: "Project Alpha",
        description: "AI-based healthcare solution.",
        lastUpdated: "Oct 2023",
        imageUrl: "/assets/project-alpha.jpg",
      },
      {
        title: "Project Beta",
        description: "E-commerce platform for artisans.",
        lastUpdated: "Sep 2023",
        imageUrl: "/assets/project-beta.jpg",
      },
      {
        title: "Project Gamma",
        description: "Cloud storage optimization tool.",
        lastUpdated: "Aug 2023",
        imageUrl: "/assets/project-gamma.jpg",
      },
    ];

    projects.forEach((project) => {
      const card = createElement({
        tag: "div",
        className: "project-card",
        children: [
          createElement({
            tag: "div",
            className: "main-card-div",
            children: [
              createElement({
                tag: "div",
                className: "project-text",
                children: [
                  createElement({ tag: "h3", text: project.title }),
                  createElement({ tag: "p", text: project.description }),
                  createElement({
                    tag: "p",
                    className: "last-updated",
                    text: `Last updated: ${project.lastUpdated}`,
                  }),
                ],
              }),
            ],
          }),
          createElement({ tag: "div", className: "card-icon", children: [] }),
        ],
      });
      projectsGrid.appendChild(card);
    });

    container.appendChild(projectsGrid);
  }

  createProjectDiv() {
    const createProjectDiv = createElement({
      tag: "div",
      className: "create-project-div",
      id: "projects-open",
      children: [
        createElement({
          tag: "div",
          className: "inner-create-project-div",
          children: [
            createElement({
              tag: "div",
              className: "cr-pr-back-container",
              innerHTML: backRight,
              children: [
                createElement({
                  tag: "h3",
                  className: "cr-pr-title",
                  innerText: "Create Project:",
                }),
              ],
              onClick: () => {
                this.closeCreateProjectModal();
              },
            }),

            createElement({
              tag: "form",
              className: "cr-pr-form",
              children: [
                createElement({
                  tag: "input",
                  name: "title",
                  className: "cr-pr-title-input",
                  placeholder: "Project Title",
                }),
                createElement({
                  tag: "input",
                  name: "description",
                  className: "cr-pr-descr-input",
                  placeholder: "Project Description",
                }),
                createElement({
                  tag: "select",
                  name: "teams",
                  className: "cr-pr-members-select",
                  placeholder: "Add team",
                  children: [
                    createElement({
                      tag: "option",
                      innerText: "Add Team",
                      disabled: "true",
                      selected: "true",
                    }),
                  ],
                }),
                createElement({
                  tag: "div",
                  className: "icon-select",
                  onClick: (e: Event) => {
                    e.preventDefault();

                    const target = e.target;
                    const closestSvg = (target as SVGSVGElement).closest("svg");
                    this.iconSelected = closestSvg?.outerHTML as string;
                    this.apiProjectData.icon = this.iconSelected;
                  },
                }),
                createElement({
                  tag: "button",
                  className: "cr-pr-button",
                  innerText: "Add Project",
                  type: "submit",
                }),
              ],
            }),
          ],
        }),
      ],
    });

    const formElement = createProjectDiv.children[0].children[1];
    const buttonFormElement = formElement.children[4];
    const iconSelectFormElement = formElement.children[3];

    this.formApiCall(buttonFormElement, formElement, iconSelectFormElement);
    this.renderProjectIcons(iconSelectFormElement);
    this.formDelegation(formElement);

    this.createProjectModal = createProjectDiv;
    this.projectsDiv?.appendChild(createProjectDiv);
  }

  closeCreateProjectModal() {
    (this.createProjectModal as HTMLElement).id = "projects-close";
    this.iconSelected = "";
    setTimeout(() => {
      this.createProjectModal?.remove();
    }, 300);
  }

  async formApiCall(
    button: HTMLElement,
    form: HTMLElement,
    iconSelectEl: HTMLElement
  ) {
    button.onclick = async (e: Event) => {
      e.preventDefault();
      const isFormValid = formValidation(
        form.children[0] as HTMLInputElement,
        form.children[1] as HTMLInputElement
      );

      const iconValid = this.iconSelected?.length > 1 ? true : false;

      if (isFormValid[0] && iconValid) {
        let apiCall = new ProjectsService(
          "http://localhost:3000/create-new-project"
        );
        this.closeCreateProjectModal();
        await apiCall.createNewProject(this.apiProjectData);
      } else {
        this.formValidationError(
          iconValid,
          iconSelectEl,
          isFormValid[1] as HTMLInputElement[]
        );
      }
    };
  }

  formValidationError(
    iconValid: boolean,
    iconSelectEl: HTMLElement,
    ...inputs: HTMLInputElement[][]
  ) {
    inputs[0].forEach((input) => (input.style.border = "1px solid red"));
    if (!iconValid) {
      iconSelectEl.style.border = "1px solid red";
    }
  }

  formDelegation(form: HTMLElement) {
    form.addEventListener("change", (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (target.matches("input, select")) {
        switch (target.name) {
          case "title":
            this.apiProjectData.title = target.value;
            break;
          case "description":
            this.apiProjectData.description = target.value;
            break;
          case "teams":
            this.apiProjectData.teams = target.value;
            break;
        }
      }
    });
  }

  renderProjectIcons(iconDiv: HTMLElement) {
    icons.forEach((icon) => {
      iconDiv.innerHTML += icon;
    });
  }
}
