import "../../Styles/Views/Projects/Projects.css";
import { store } from "../../Store/Store";
import {
  createElement,
  generateTitleHash,
  iconGradients,
} from "../../Utils/Helpers";
import { ProjectsService } from "../../Services/ProjectsService";
import { CreateNewProjectPopup } from "./ProjectsPopup/CreateNewProject";
import { createPopupModal } from "../../Components/PopupModal";
import { Project } from "../../Types/ProjectsTypes";

export class ProjectsView {
  projectsDiv: HTMLElement | null = null;
  projects: Project[] = [];
  createNewProjectPopup: CreateNewProjectPopup | null = null;
  constructor() {}

  //UI RENDER------------------------------------------------------
  delete() {
    document.querySelector(".projects-container")?.remove();
  }

  async renderProjectsPage() {
    await this.fetchAllUserProjects();

    // Create main container
    const projectsContainer = createElement({
      tag: "div",
      className: "projects-container",
    });

    store.getState().mainSection?.appendChild(projectsContainer);

    // Render header with actions
    this.renderHeader(projectsContainer);

    // Render projects dashboard
    this.renderProjectsDashboard(projectsContainer);
  }

  private renderHeader(container: HTMLElement) {
    const header = createElement({
      tag: "header",
      className: "projects-header",
      children: [
        createElement({
          tag: "div",
          className: "header-left",
          children: [
            createElement({
              tag: "h1",
              className: "page-title",
              text: "Projects",
            }),
            createElement({
              tag: "p",
              className: "page-subtitle",
              text: `${this.projects.length} ${
                this.projects.length === 1 ? "project" : "projects"
              } available`,
            }),
          ],
        }),
        createElement({
          tag: "div",
          className: "header-actions",
          children: [
            createElement({
              tag: "div",
              className: "search-container",
              children: [
                createElement({
                  tag: "input",
                  className: "search-input",

                  type: "text",
                  placeholder: "Search projects...",

                  oninput: (e: Event) => this.handleSearchInput(e),
                }),
                createElement({
                  tag: "span",
                  className: "search-icon",
                  html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>`,
                }),
              ],
            }),
            createElement({
              tag: "button",
              className: "new-project-btn",
              children: [
                createElement({
                  tag: "span",
                  className: "btn-icon",
                  html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>`,
                }),
                createElement({
                  tag: "span",
                  text: "New Project",
                }),
              ],
              onClick: () => this.handleCreateNewProjectPopup(),
            }),
          ],
        }),
      ],
    });

    container.appendChild(header);
  }

  private renderProjectsDashboard(container: HTMLElement) {
    const dashboard = createElement({
      tag: "div",
      className: "projects-dashboard",
      id: "projects-dashboard",
    });

    container.appendChild(dashboard);

    if (this.projects.length === 0) {
      this.renderEmptyState(dashboard);
    } else {
      this.renderProjectsGrid(dashboard);
    }
  }

  private renderEmptyState(container: HTMLElement) {
    const emptyState = createElement({
      tag: "div",
      className: "empty-state",
      children: [
        createElement({
          tag: "div",
          className: "empty-icon",
          html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path><path d="M12 11v6"></path><path d="M9 14h6"></path></svg>`,
        }),
        createElement({
          tag: "h2",
          className: "empty-title",
          text: "No projects yet",
        }),
        createElement({
          tag: "p",
          className: "empty-description",
          text: "Create your first project to start organizing your work",
        }),
        createElement({
          tag: "button",
          className: "empty-action-btn",
          text: "Create Project",
          onClick: () => this.handleCreateNewProjectPopup(),
        }),
      ],
    });

    container.appendChild(emptyState);
  }

  private renderProjectsGrid(container: HTMLElement) {
    const projectsGrid = createElement({
      tag: "div",
      className: "projects-grid",
    });

    this.projects.forEach((project) => {
      projectsGrid.appendChild(this.createProjectCard(project));
    });

    container.appendChild(projectsGrid);
  }

  private createProjectCard(project: Project) {
    // Generate a hash from the project title for consistent colors

    const hash = generateTitleHash(project.title);

    // Select a gradient based on the hash
    const iconStyle = iconGradients[hash % iconGradients.length];
    // Create project card
    const card = createElement({
      tag: "div",
      className: "project-card-projects",
      onClick: () => this.navigateToProject(project.projectId, project),
      children: [
        createElement({
          tag: "div",
          className: "card-content",
          children: [
            createElement({
              tag: "div",
              className: "project-icon",
              style: {
                background: iconStyle.gradient,
                color: iconStyle.text,
              },
              innerHTML: project.icon,
            }),
            createElement({
              tag: "h3",
              className: "project-title",
              text: project.title,
            }),
            createElement({
              tag: "p",
              className: "project-description",
              text: project.description || "No description provided",
            }),
            createElement({
              tag: "div",
              className: "project-meta",
              children: [
                createElement({
                  tag: "div",
                  className: "meta-item",
                  children: [
                    createElement({
                      tag: "span",
                      className: "meta-icon",
                      html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>`,
                    }),
                    createElement({
                      tag: "span",
                      className: "meta-text",
                      //text: formattedDate,
                    }),
                  ],
                }),
                createElement({
                  tag: "div",
                  className: "meta-item",
                  children: [
                    createElement({
                      tag: "span",
                      className: "meta-icon",
                      html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>`,
                    }),
                    createElement({
                      tag: "span",
                      className: "meta-text",
                      //text: project.teamId ? "Team Project" : "Personal",
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
        createElement({
          tag: "div",
          className: "card-actions",
          children: [
            createElement({
              tag: "button",
              className: "card-action-btn",
              text: "View Project",
            }),
          ],
        }),
      ],
    });

    return card;
  }

  //CORE LOGIC-----------------------------------------------------
  private navigateToProject(projectId: string, project: any) {
    window.location.href = `/projects/${projectId}/${project.teamId}`;
  }

  private handleSearchInput(e: Event) {
    const searchTerm = (e.target as HTMLInputElement).value.toLowerCase();
    const dashboard = document.getElementById("projects-dashboard");
    if (!dashboard) return;

    // Clear dashboard
    dashboard.innerHTML = "";

    // Filter projects
    const filteredProjects = this.projects.filter(
      (project) =>
        project.title.toLowerCase().includes(searchTerm) ||
        (project.description &&
          project.description.toLowerCase().includes(searchTerm))
    );

    if (filteredProjects.length === 0) {
      const noResults = createElement({
        tag: "div",
        className: "no-results",
        children: [
          createElement({
            tag: "div",
            className: "no-results-icon",
            html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>`,
          }),
          createElement({
            tag: "p",
            className: "no-results-text",
            text: `No projects found matching "${searchTerm}"`,
          }),
        ],
      });

      dashboard.appendChild(noResults);
    } else {
      const projectsGrid = createElement({
        tag: "div",
        className: "projects-grid",
      });

      filteredProjects.forEach((project) => {
        projectsGrid.appendChild(this.createProjectCard(project));
      });

      dashboard.appendChild(projectsGrid);
    }
  }

  handleComponentReRender = () => {
    const currentScreen = document.querySelector(".projects-container");
    if (currentScreen) currentScreen.remove();
    this.renderProjectsPage();
  };

  handleCreateNewProjectPopup() {
    const popup = createPopupModal(this.handleClosePopup);
    this.createNewProjectPopup = popup;

    store.getState().mainDivApp.appendChild(popup);

    this.createNewProjectPopup = new CreateNewProjectPopup(
      popup,
      this.handleClosePopup,
      this.handleComponentReRender
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
