import { icons } from "../../../Assets/Icons";
import { ProjectsService } from "../../../Services/ProjectsService";
import { userStore } from "../../../Store/UserStore";
import { Team } from "../../../Types/TeamsTypes";
import { createElement } from "../../../Utils/Helpers";
import "../../../Styles/SharedStylings/Popup.css";
import "../../../Styles/Views/Projects/Projects.css";
import { Project } from "../../../Types/ProjectsTypes";

export class CreateNewProjectPopup {
  popupElement: HTMLElement | null = null;
  iconSelected: string = "";
  apiProjectData: Project = {
    title: "",
    description: "",
    icon: "",
    projectId: "",
    teamId: "",
  };
  iconArry: SVGSVGElement[] = [];
  formErrors: { [key: string]: string } = {};

  handleClosePopup: () => void = () => {};
  fetchAllUserProjects: () => void = () => {};

  constructor(
    popupElement: HTMLElement,
    handleClosePopup: () => void,
    fetchAllUserProjects: () => void
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
                  // Project Title
                  createElement({
                    tag: "div",
                    className: "cr-pr-input-group",
                    children: [
                      createElement({
                        tag: "label",
                        className: "cr-pr-label",
                        innerText: "Project Title",
                      }),
                      createElement({
                        tag: "input",
                        name: "title",
                        className: "cr-pr-title-input",
                        placeholder: "Enter project title",
                      }),
                      createElement({
                        tag: "span",
                        className: "error-message title-error",
                        style: "display: none;",
                        innerText: "Project title is required",
                      }),
                    ],
                  }),

                  // Project Icon
                  createElement({
                    tag: "div",
                    className: "cr-pr-input-group",
                    children: [
                      createElement({
                        tag: "label",
                        className: "icon-select-label",
                        innerText: "Choose Project Icon",
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

                          if (closestSvg) {
                            this.iconSelected = closestSvg.outerHTML;
                            this.apiProjectData.icon = this.iconSelected;
                            this.handleSetSelectedIconBorder(closestSvg);

                            // Clear icon error if it exists
                            const iconError = document.querySelector(
                              ".icon-error"
                            ) as HTMLElement;
                            if (iconError) {
                              iconError.style.display = "none";
                            }
                            document
                              .querySelector(".icon-select")
                              ?.classList.remove("input-error");
                          }
                        },
                      }),
                      createElement({
                        tag: "span",
                        className: "error-message icon-error",
                        style: "display: none;",
                        innerText: "Please select an icon",
                      }),
                    ],
                  }),

                  // Submit Button
                  createElement({
                    tag: "button",
                    className: "create-project-btn",
                    innerText: "Create Project",
                    type: "submit",
                  }),
                ],
              }),
            ],
          }),
        ],
      });

      const formElement = createProjectPopup.querySelector(
        ".cr-pr-form"
      ) as HTMLElement;
      const buttonFormElement = formElement.querySelector(
        ".create-project-btn"
      ) as HTMLElement;
      const iconSelectElement = formElement.querySelector(
        ".icon-select"
      ) as HTMLElement;
      const teamSelectElement = formElement.querySelector(
        ".cr-pr-members-select"
      ) as HTMLSelectElement;

      // Render teams in select dropdown
      // this.renderTeamsInSelect(teamSelectElement);

      // Setup form handlers
      this.setupFormSubmitHandler(
        buttonFormElement,
        formElement,
        iconSelectElement
      );
      this.renderProjectIcons(iconSelectElement);
      this.setupFormEventDelegation(formElement);

      this.popupElement?.appendChild(createProjectPopup);
    }
  }

  renderProjectIcons(iconDiv: HTMLElement) {
    icons.forEach((icon) => {
      const iconWrapper = document.createElement("div");
      iconWrapper.className = "icon-wrapper";
      iconWrapper.innerHTML = icon;
      iconDiv.appendChild(iconWrapper);

      // Store the SVG element for later reference
      setTimeout(() => {
        const svg = iconWrapper.querySelector("svg");
        if (svg) {
          this.iconArry.push(svg as SVGSVGElement);
        }
      }, 0);
    });
  }

  renderTeamsInSelect(selectElement: HTMLSelectElement) {
    const teams = userStore.getState().teams;

    if (teams && teams.length > 0) {
      teams.forEach((team: Team) => {
        const option = createElement({
          tag: "option",
          innerText: team.teamName,
          value: team.teamId,
        });

        selectElement.appendChild(option);
      });
    } else {
      // If no teams, add a disabled option
      const noTeamsOption = createElement({
        tag: "option",
        innerText: "No teams available",
        disabled: true,
      });

      selectElement.appendChild(noTeamsOption);
    }
  }

  //CORE LOGIC-----------------------------------------------------
  handleSetSelectedIconBorder(selectedSvg: SVGSVGElement) {
    // Remove selected class from all icons
    this.iconArry.forEach((svg) => {
      svg.classList.remove("selected");
    });

    // Add selected class to the clicked icon
    selectedSvg.classList.add("selected");
  }

  validateForm(): boolean {
    let isValid = true;
    this.formErrors = {};

    // Validate title
    const titleInput = document.querySelector(
      ".cr-pr-title-input"
    ) as HTMLInputElement;
    const titleError = document.querySelector(".title-error") as HTMLElement;

    if (!titleInput.value.trim()) {
      titleInput.classList.add("input-error");
      titleError.style.display = "block";
      this.formErrors.title = "Project title is required";
      isValid = false;
    } else {
      titleInput.classList.remove("input-error");
      titleError.style.display = "none";
    }

    const iconError = document.querySelector(".icon-error") as HTMLElement;
    const iconSelect = document.querySelector(".icon-select") as HTMLElement;

    if (!this.iconSelected) {
      iconSelect.classList.add("input-error");
      iconError.style.display = "block";
      this.formErrors.icon = "Please select an icon";
      isValid = false;
    } else {
      iconSelect.classList.remove("input-error");
      iconError.style.display = "none";
    }

    return isValid;
  }

  async setupFormSubmitHandler(
    button: HTMLElement,
    form: HTMLElement,
    iconSelectEl: HTMLElement
  ) {
    button.onclick = async (e: Event) => {
      e.preventDefault();

      if (this.validateForm()) {
        // Show loading state
        button.innerText = "Creating...";
        button.classList.add("loading");
        //button.disabled = true;

        try {
          await this.handleCreateNewProject();
        } catch (error) {
          console.error("Error creating project:", error);

          // Reset button state
          button.innerText = "Create Project";
          button.classList.remove("loading");
          //button.disabled = false;

          // Show error message
          alert("Failed to create project. Please try again.");
        }
      }
    };
  }

  //API CALLS------------------------------------------------------
  async handleCreateNewProject() {
    const apiCall = new ProjectsService(
      "http://localhost:3000/create-new-project"
    );

    try {
      await apiCall.createNewProject(this.apiProjectData);
      this.handleClosePopup();
      await this.fetchAllUserProjects();
    } catch (error) {
      console.error("Error creating project:", error);
      throw error;
    }
  }

  //LISTENERS------------------------------------------------------
  setupFormEventDelegation(form: HTMLElement) {
    form.addEventListener("input", (e: Event) => {
      const target = e.target as
        | HTMLInputElement
        | HTMLTextAreaElement
        | HTMLSelectElement;

      if (target.matches("input, textarea, select")) {
        // Clear error styling when user starts typing
        target.classList.remove("input-error");
        const errorElement =
          target.parentElement?.querySelector(".error-message");
        if (errorElement) {
          (errorElement as HTMLElement).style.display = "none";
        }

        // Update data model
        switch (target.name) {
          case "title":
            this.apiProjectData.title = target.value;
            break;
          case "description":
            this.apiProjectData.description = target.value;
            break;
          case "teams":
            this.apiProjectData.teamId = target.value;
            break;
        }
      }
    });
  }
}
