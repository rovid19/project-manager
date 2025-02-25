import { store } from "../../Store/Store";
import { createElement } from "../../Utils/Helpers";
import "../../Styles/Dashboard.css";

export class DashboardController {
  constructor() {}

  // CSS AND HTML

  delete() {
    document.querySelector(".dashboard")?.remove();
  }

  createDashboard() {
    const currentState = store.getState();

    // dashboard container
    const dashboard = createElement({ tag: "div", className: "dashboard" });
    currentState.mainSection?.appendChild(dashboard);

    this.createPageTitle(dashboard);
    this.createProjectOverview(dashboard);
    this.createTaskList(dashboard);
  }

  createProjectOverview(dashboard: HTMLElement) {
    // section container
    const section = createElement({
      tag: "section",
      className: "project-overview",
      children: [
        createElement({
          tag: "h2",
          className: "section-title",
          text: "Project Overview",
        }),
      ],
    });
    dashboard.appendChild(section);

    // project cards
    const projects = [
      {
        title: "App Redesign",
        status: "In Progress",
        completion: "65%",
        image: "path-to-image-1",
      },
      {
        title: "Marketing Launch",
        status: "Completed",
        completion: "100%",
        image: "path-to-image-2",
      },
      {
        title: "Website Update",
        status: "Pending",
        completion: "10%",
        image: "path-to-image-3",
      },
    ];

    const projectCards = createElement({
      tag: "div",
      className: "project-cards",
    });

    projects.forEach((project) => {
      const card = createElement({
        tag: "div",
        className: "project-card",
        children: [
          createElement({
            tag: "h3",
            className: "card-title",
            text: project.title,
          }),
          createElement({
            tag: "p",
            className: "card-status",
            text: `Status: ${project.status}`,
          }),
          createElement({
            tag: "p",
            className: "card-completion",
            text: `Completion: ${project.completion}`,
          }),
        ],
      });
      projectCards.appendChild(card);
    });

    section.appendChild(projectCards);
  }

  createTaskList(dashboard: HTMLElement) {
    // task list container
    const taskSection = createElement({
      tag: "section",
      className: "task-list",
      children: [
        createElement({
          tag: "h2",
          className: "section-title",
          text: "Task List",
        }),
      ],
    });

    // task table
    const table = createElement({
      tag: "table",
      className: "task-table",
      children: [
        createElement({
          tag: "thead",
          children: [
            createElement({
              tag: "tr",
              children: [
                createElement({ tag: "th", text: "Task Title" }),
                createElement({ tag: "th", text: "Project Title" }),
                createElement({ tag: "th", text: "Deadline" }),
                createElement({ tag: "th", text: "Contribution" }),
                createElement({ tag: "th", text: "Select Project" }),
              ],
            }),
          ],
        }),
      ],
    });

    const tasks = [
      {
        taskTitle: "Design Homepage",
        projectTitle: "Website Revamp",
        deadline: "2023-12-15",
        status: "In Progress",
        project: "Project A",
      },
      {
        taskTitle: "Develop API",
        projectTitle: "Mobile App",
        deadline: "2023-11-30",
        status: "Not Started",
        project: "Project B",
      },
      {
        taskTitle: "Testing Features",
        projectTitle: "E-commerce Site",
        deadline: "2023-12-01",
        status: "Completed",
        project: "Project C",
      },
    ];

    const tbody = createElement({ tag: "tbody" });
    tasks.forEach((task) => {
      const row = createElement({
        tag: "tr",
        children: [
          createElement({ tag: "td", text: task.taskTitle }),
          createElement({ tag: "td", text: task.projectTitle }),
          createElement({ tag: "td", text: task.deadline }),
          createElement({ tag: "td", text: task.status }),
          createElement({
            tag: "td",
            children: [
              createElement({
                tag: "select",
                className: "project-select",
                children: [
                  createElement({ tag: "option", text: task.project }),
                ],
              }),
            ],
          }),
        ],
      });
      tbody.appendChild(row);
    });

    table.appendChild(tbody);
    taskSection.appendChild(table);
    dashboard.appendChild(taskSection);
  }

  createPageTitle(dashboard: HTMLElement) {
    const pageDiv = createElement({
      tag: "div",
      className: "page-header",
      children: [createElement({ tag: "h3", text: "Dashboard" })],
    });
    dashboard.appendChild(pageDiv);
  }

  // CONTROLLER LOGIC
  // Project overview section logic
}
