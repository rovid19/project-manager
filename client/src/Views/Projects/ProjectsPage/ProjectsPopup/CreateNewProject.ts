import { icons } from "../../../../Assets/Icons";
import { ProjectsService } from "../../../../Services/ProjectsService";
import { Project } from "../../../../Store/UserStore";
import { createElement, formValidation } from "../../../../Utils/Helpers";

export class CreateNewProjectPopup {
  popupElement: HTMLElement | null = null;
  iconSelected: string = "";
  apiProjectData: Project = {
    title: "",
    description: "",
    icon: "",
    projectId: "",
  };
  iconArry: SVGSVGElement[] = [];

  handleClosePopup: () => void = () => {};
  fetchAllUserProjects: () => Promise<void> = async () => {};
  constructor(
    popupElement: HTMLElement,
    handleClosePopup: () => void,
    fetchAllUserProjects: () => Promise<void>
  ) {
    this.popupElement = popupElement.children[0].children[1] as HTMLElement;
    this.handleClosePopup = handleClosePopup;
    this.fetchAllUserProjects = fetchAllUserProjects;
    this.renderPopup();
  }

  //UI RENDER------------------------------------------------------

  renderPopup() {
    if (!document.querySelector(".create-project-div")) {
      const createProjectPopup = createElement({
        tag: "div",
        className: "create-project-div",
        children: [
          createElement({
            tag: "div",
            className: "inner-create-project-div",
            children: [
              createElement({
                tag: "h3",
                className: "cr-pr-title",
                innerText: "Create New Project",
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
                      const closestSvg = (target as SVGSVGElement).closest(
                        "svg"
                      );
                      this.iconSelected = closestSvg?.outerHTML as string;
                      this.apiProjectData.icon = this.iconSelected;

                      this.handleSetSelectedIconBorder(
                        closestSvg as SVGSVGElement
                      );
                    },
                  }),
                  createElement({
                    tag: "button",
                    className: "create-project-btn",
                    innerText: "Add Project",
                    type: "submit",
                  }),
                ],
              }),
            ],
          }),
        ],
      });

      const formElement = createProjectPopup.children[0].children[1];
      const buttonFormElement = formElement.children[4];
      const iconSelectFormElement = formElement.children[3];

      this.setupFormSubmitHandler(
        buttonFormElement,
        formElement,
        iconSelectFormElement
      );
      this.renderProjectIcons(iconSelectFormElement);
      this.setupFormEventDelegation(formElement);

      this.popupElement?.appendChild(createProjectPopup);
    }
  }

  renderProjectIcons(iconDiv: HTMLElement) {
    icons.forEach((icon, i) => {
      iconDiv.innerHTML += icon;

      setTimeout(() => {
        this.iconArry.push(iconDiv.children[i] as SVGSVGElement);
      }, 100);
    });
  }

  //CORE LOGIC-----------------------------------------------------

  handleSetSelectedIconBorder(svg: SVGSVGElement) {
    this.iconArry.forEach((icon) => {
      icon.style.border = "none";
    });
    svg.style.border = "2px solid #353535";
  }

  handleFormValidationError(
    iconValid: boolean,
    iconSelectEl: HTMLElement,
    ...inputs: HTMLInputElement[][]
  ) {
    inputs[0].forEach((input) => (input.style.border = "1px solid red"));
    if (!iconValid) {
      iconSelectEl.style.border = "1px solid red";
    }
  }

  async setupFormSubmitHandler(
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
        this.handleCreateNewProject();
      } else {
        this.handleFormValidationError(
          iconValid,
          iconSelectEl,
          isFormValid[1] as HTMLInputElement[]
        );
      }
    };
  }

  //API CALLS------------------------------------------------------

  async handleCreateNewProject() {
    let apiCall = new ProjectsService(
      "http://localhost:3000/create-new-project"
    );
    this.handleClosePopup();
    await apiCall.createNewProject(this.apiProjectData);

    await this.fetchAllUserProjects();
  }

  //LISTENERS------------------------------------------------------

  setupFormEventDelegation(form: HTMLElement) {
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
          /*case "teams":
                this.apiProjectData.teams = target.value;
                break;*/
        }
      }
    });
  }
}
