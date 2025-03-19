import { ProjectsService } from "../../Services/ProjectsService";
import { store } from "../../Store/Store";
import { createElement } from "../../Utils/Helpers";
import "../../Styles/Projects.css";
import "../../Styles/Project.css";
import { Project } from "../../Store/UserStore";
import { router } from "../../main";

export class ProjectController {
  title: string = "";
  description: string = "";
  icon: string = "";
  projectId: string = "";
  form: HTMLElement | null = null;

  delete() {
    document.querySelector(".projects")?.remove();
  }

  async createProject() {
    await this.fetchUserProject();

    const currentState = store.getState();
    const project = createElement({ tag: "div", className: "projects" });
    const innerProject = createElement({
      tag: "div",
      className: "inner-project",
    });
    const pageHeader = createElement({
      tag: "div",
      className: "page-header",
      children: [
        createElement({
          tag: "h3",
          text: `Projects / ${this.title}`,
          className: "page-title",
        }),
        createElement({
          tag: "button",
          className: "project-delete-btn",
          innerText: "Delete Project",
          onClick: (e: Event) => {
            e.preventDefault();
            this.handleDeleteProject();
          },
        }),
      ],
    });

    currentState.mainSection?.appendChild(project);
    project.appendChild(innerProject);
    innerProject.appendChild(pageHeader);

    this.createProjectInfo(innerProject);
    this.createProjectTasks(innerProject);
  }

  createProjectInfo(mainSection: HTMLElement) {
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
                  tag: "input",
                  className: "project-input-title",
                  placeholder: `${this.title}`,
                  name: "title",
                }),
                createElement({
                  tag: "input",
                  className: "project-input-description",
                  placeholder: `${this.description}`,
                  name: "description",
                }),
                createElement({
                  tag: "button",
                  className: "project-info-submit-button",
                  innerText: "Save Changes",
                  onClick: (e: Event) => {
                    e.preventDefault();
                    this.handleProjectSubmission();
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
        createElement({
          tag: "div",
          className: "project-members-div",
          children: [
            //createElement({ tag: "div", className: "project-member" }),
            createElement({
              tag: "div",
              className: "project-member-btn-div",
              children: [
                createElement({
                  tag: "button",
                  className: "add-team",
                  innerText: "Add Team",
                }),
                createElement({
                  tag: "button",
                  className: "add-member",
                  innerText: "Add Member",
                }),
              ],
            }),
          ],
        }),
      ],
    });

    mainSection.appendChild(projectInfo);
    this.projectDetailsEventDelegation(projectInfo.children[0].children[0]);
    this.form = projectInfo.children[0].children[0];
  }

  createProjectMembers() {}

  createProjectTasks(mainSection: HTMLElement) {
    const tasksDiv = createElement({
      tag: "div",
      className: "project-task-section",
      children: [
        createElement({
          tag: "button",
          className: "project-add-task-btn",
          innerText: "Add Task",
        }),
      ],
    });

    mainSection.appendChild(tasksDiv);
  }

  setProjectData(projectData: Project) {
    this.title = projectData.title;
    this.description = projectData.description;
    this.icon = projectData.icon;
    this.projectId = projectData.projectId;
  }

  updateProjectInfoInputFields() {
    const title = document.querySelector(
      ".project-input-title"
    ) as HTMLInputElement;
    const description = document.querySelector(
      ".project-input-description"
    ) as HTMLInputElement;

    title.value = "";
    title.placeholder = this.title;
    description.value = "";
    description.placeholder = this.description;

    (
      document.querySelector(".page-title") as HTMLElement
    ).innerText = `Projects / ${this.title}`;
  }

  async handleProjectSubmission() {
    let apiCall = new ProjectsService(
      `http://localhost:3000/handle-project-submissions/${this.projectId}`
    );
    const data = await apiCall.submitNewProjectDetails({
      title: this.title,
      description: this.description,
    });

    console.log(data[0]);

    this.title = data[0].title;
    this.description = data[0].description;

    this.setProjectData(data[0]);
    this.updateProjectInfoInputFields();
  }

  projectDetailsEventDelegation(form: HTMLElement) {
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

  async handleDeleteProject() {
    let apiCall = new ProjectsService(
      `http://localhost:3000/handle-delete-project/${this.projectId}`
    );
    await apiCall.delete();

    history.pushState("", "", "/projects");
    router.route("/projects");
  }

  redirectBackToProjects() {}

  async fetchUserProject() {
    const projectId = window.location.pathname.split("/")[2];

    let apiCall = new ProjectsService(
      `http://localhost:3000/get-project/${projectId}`
    ) as ProjectsService | null;
    const projectData = await (apiCall as ProjectsService).fetchUserProject();
    this.setProjectData(projectData);

    apiCall = null;
  }
}
