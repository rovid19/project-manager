import "../../../Styles/Projects.css";
import "../../../Styles/SharedStylings/SectionHeader.css";
import "../../../Styles/SharedStylings/Popup.css";
import "../../../Styles/SharedStylings/UpperInnerSection.css";
import "../../../Styles/SharedStylings/ProjectCards.css";
import { store } from "../../../Store/Store";
import { createElement } from "../../../Utils/Helpers";

import { ProjectsService } from "../../../Services/ProjectsService";
import { Project, userStore } from "../../../Store/UserStore";
import { renderProjectCards } from "../../../Components/ProjectCard";
import { CreateNewProjectPopup } from "./ProjectsPopup/CreateNewProject";
import { createPopupModal } from "../../../Components/PopupModal";

export class ProjectsView {
  projectsDiv: HTMLElement | null = null;
  pageHeader: HTMLElement | null = null;
  projects: Project[] = [];
  createNewProjectPopup: CreateNewProjectPopup | null = null;
  constructor() {}

  //UI RENDER------------------------------------------------------
  delete() {
    document.querySelector(".upper-section")?.remove();
    userStore.unsubscribe(/*this.createProjectsGrid.bind(this),*/ "projects");
  }

  async renderProjectsPage() {
    await this.fetchAllUserProjects();

    const projects = createElement({ tag: "div", className: "upper-section" });
    const innerProjects = createElement({
      tag: "div",
      className: "inner-section",
    });

    this.projectsDiv = innerProjects;
    store.getState().mainSection?.appendChild(projects);
    projects.appendChild(innerProjects);
    this.renderPageTitle();
    this.renderNewProjectButton();
    this.renderProjectsGrid();
    userStore.subscribe(this.renderProjectsGrid.bind(this), "projects");
  }

  private renderPageTitle() {
    const pageHeader = createElement({
      tag: "div",
      className: "section-header",
      children: [
        createElement({
          tag: "h3",
          text: "Projects",
          className: "section-title",
        }),
      ],
    });
    (this.projectsDiv as HTMLElement).appendChild(pageHeader);
    this.pageHeader = pageHeader;
  }

  private renderNewProjectButton() {
    const button = createElement({
      tag: "button",
      className: "create-project-btn",
      text: "Create New Project",

      onClick: () => {
        this.handleCreateNewProjectPopup();
      },
    });
    (this.pageHeader as HTMLElement).appendChild(button);
  }

  private deleteProjectsGrid() {
    const projectsGrid = document.querySelector(".projects-grid");
    if (projectsGrid) {
      projectsGrid.remove();
    }
  }

  private renderProjectsGrid() {
    this.deleteProjectsGrid();

    const projectsGrid = createElement({
      tag: "div",
      className: "projects-grid",
    });

    renderProjectCards(projectsGrid);

    (this.projectsDiv as HTMLElement).appendChild(projectsGrid);
  }

  //CORE LOGIC-----------------------------------------------------

  handleCreateNewProjectPopup() {
    const popup = createPopupModal(this.handleClosePopup);
    this.createNewProjectPopup = popup;

    store.getState().mainDivApp.appendChild(popup);

    this.createNewProjectPopup = new CreateNewProjectPopup(
      popup,
      this.handleClosePopup,
      this.fetchAllUserProjects
    );
  }

  handleClosePopup = () => {
    this.createNewProjectPopup = null;
    document.querySelector(".popup-overlay")?.remove();
  };

  //API CALLS------------------------------------------------------

  fetchAllUserProjects = async () => {
    let result = (await new ProjectsService(
      "http://localhost:3000/get-all-user-projects"
    ).fetchAllUserProjects()) as Project[];

    this.projects = result;
  };
}
