import { store } from "../../Store/Store";
import { createElement } from "../../Utils/Helpers";
import "../../Styles/Views/Dashboard/Dashboard.css";
import "../../Styles/SharedStylings/UpperInnerSection.css";
import "../../Styles/SharedStylings/SectionHeader.css";
import "../../Styles/SharedStylings/ProjectCards.css";
import { Project, userStore } from "../../Store/UserStore";
import { router } from "../../main";
import { ProjectsService } from "../../Services/ProjectsService";

export class DashboardView {
  projects: Project[] = [];
  delete() {
    document.querySelector(".dashboard-container")?.remove();
  }

  async createDashboard() {
    await this.fetchAllUserProjects();
    const projects = userStore.getState().projects;

    // Sort projects by date (newest first)
    // Note: This assumes projects have a date property. If not, we'll need to modify this.
    const sortedProjects = [...projects].sort((a, b) => {
      // If there's no date property, we'll need to adjust this logic
      // For now, using the projectId as a fallback (assuming newer projects have higher IDs)
      return b.projectId.localeCompare(a.projectId);
    });

    // dashboard container
    const dashboardContainer = createElement({
      tag: "div",
      className: "dashboard-container",
    });

    store.getState().mainSection?.appendChild(dashboardContainer);

    // Render header with title and actions
    this.renderHeader(dashboardContainer);

    // Render dashboard content
    const dashboardContent = createElement({
      tag: "div",
      className: "dashboard-content",
    });

    dashboardContainer.appendChild(dashboardContent);

    // Render project overview section
    this.renderProjectOverview(dashboardContent, sortedProjects);

    // Render reports section
    this.renderReportsSection(dashboardContent);
  }

  renderHeader(container: HTMLElement) {
    const header = createElement({
      tag: "header",
      className: "dashboard-header",
      children: [
        createElement({
          tag: "div",
          className: "header-left",
          children: [
            createElement({
              tag: "h1",
              className: "page-title",
              text: "Dashboard",
            }),
            createElement({
              tag: "p",
              className: "page-subtitle",
              text: "Welcome back to your workspace",
            }),
          ],
        }),
        createElement({
          tag: "div",
          className: "header-actions",
          children: [
            createElement({
              tag: "button",
              className: "new-project-btn",
              text: "New Project",
              onClick: () => {
                router.route("/projects");
              },
            }),
          ],
        }),
      ],
    });

    container.appendChild(header);
  }

  renderProjectOverview(container: HTMLElement, projects: Project[]) {
    // Create project overview section
    const projectSection = createElement({
      tag: "div",
      className: "dashboard-section",
      children: [
        createElement({
          tag: "div",
          className: "section-header-row",
          children: [
            createElement({
              tag: "h2",
              className: "section-title",
              text: "Recent Projects",
            }),
            createElement({
              tag: "a",
              className: "view-all-link",
              text: "View All Projects",
              onClick: () => {
                router.route("/projects");
              },
            }),
          ],
        }),
      ],
    });

    container.appendChild(projectSection);

    // Create project cards container
    const projectCards = createElement({
      tag: "div",
      className: "project-cards-grid",
    });

    projectSection.appendChild(projectCards);

    // Add project cards (limited to 3)
    const projectsToShow = projects.slice(0, 3);

    if (projectsToShow.length === 0) {
      projectCards.appendChild(
        createElement({
          tag: "div",
          className: "empty-projects",
          children: [
            createElement({
              tag: "p",
              text: "You don't have any projects yet.",
            }),
            createElement({
              tag: "button",
              className: "create-project-btn",
              text: "Create Your First Project",
              onClick: () => {
                router.route("/projects");
              },
            }),
          ],
        })
      );
    } else {
      projectsToShow.forEach((project) => {
        // Generate a hash from the project title for consistent colors
        const hash = project.title
          .split("")
          .reduce((acc, char) => acc + char.charCodeAt(0), 0);

        // Define some gradient options
        const iconGradients = [
          {
            gradient: "linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)",
            text: "#ffffff",
          }, // Indigo
          {
            gradient: "linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)",
            text: "#ffffff",
          }, // Blue
          {
            gradient: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
            text: "#ffffff",
          }, // Emerald
          {
            gradient: "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)",
            text: "#ffffff",
          }, // Amber
          {
            gradient: "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)",
            text: "#ffffff",
          }, // Red
          {
            gradient: "linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)",
            text: "#ffffff",
          }, // Violet
          {
            gradient: "linear-gradient(135deg, #EC4899 0%, #DB2777 100%)",
            text: "#ffffff",
          }, // Pink
          {
            gradient: "linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)",
            text: "#ffffff",
          }, // Teal
        ];

        // Select a gradient based on the hash
        const iconStyle = iconGradients[hash % iconGradients.length];

        const card = createElement({
          tag: "div",
          className: "dashboard-project-card",
          onClick: () => {
            router.route(`/projects/${project.projectId}/${project.teamId}`);
          },
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
                  children: [
                    createElement({
                      tag: "span",
                      text: project.title.charAt(0).toUpperCase(),
                    }),
                  ],
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
              ],
            }),
          ],
        });

        projectCards.appendChild(card);
      });
    }
  }

  renderReportsSection(container: HTMLElement) {
    // Create reports section
    const reportsSection = createElement({
      tag: "div",
      className: "dashboard-section",
      children: [
        createElement({
          tag: "div",
          className: "section-header-row",
          children: [
            createElement({
              tag: "h2",
              className: "section-title",
              text: "Reports Overview",
            }),
            createElement({
              tag: "a",
              className: "view-all-link",
              text: "View All Reports",
              onClick: () => {
                router.route("/reports");
              },
            }),
          ],
        }),
      ],
    });

    container.appendChild(reportsSection);

    // Add placeholder for reports (since this section is not complete)
    const reportsPlaceholder = createElement({
      tag: "div",
      className: "reports-placeholder",
      children: [
        createElement({
          tag: "div",
          className: "placeholder-content",
          children: [
            createElement({
              tag: "p",
              className: "placeholder-message",
              text: "Reports section is coming soon",
            }),
            createElement({
              tag: "p",
              className: "placeholder-description",
              text: "Track your progress and get insights about your projects and tasks",
            }),
          ],
        }),
      ],
    });

    reportsSection.appendChild(reportsPlaceholder);
  }

  async fetchAllUserProjects() {
    let result = (await new ProjectsService(
      "http://localhost:3000/get-all-user-projects"
    ).fetchAllUserProjects()) as Project[];

    this.projects = result;
  }
}
