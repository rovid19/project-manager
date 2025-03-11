import { store } from "../../Store/Store";
import { createElement, fetchAllUserProjects } from "../../Utils/Helpers";
import "../../Styles/Dashboard.css";
import "../../Styles/Projects.css";

import { renderProjectCards } from "../../Components/ProjectCard";

export class DashboardController {
  constructor() {}

  delete() {
    document.querySelector(".dashboard")?.remove();
  }

  async createDashboard() {
    await fetchAllUserProjects();

    const currentState = store.getState();

    // dashboard container
    const dashboard = createElement({ tag: "div", className: "dashboard" });
    const innerDashboard = createElement({
      tag: "div",
      className: "inner-dashboard",
    });
    currentState.mainSection?.appendChild(dashboard);
    dashboard.appendChild(innerDashboard);

    this.createPageTitle(innerDashboard);
    this.createProjectOverview(innerDashboard);
    this.createTaskList(innerDashboard);
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

    const projectCards = createElement({
      tag: "div",
      className: "project-cards",
    });

    renderProjectCards(projectCards, 3);

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

  createBaseElements() {
    const sidebar = createElement({ tag: "div", className: "sidebar" });
    const mainSection = createElement({
      tag: "section",
      className: "main-section",
    });

    document.body.appendChild(sidebar);
    document.body.appendChild(mainSection);
  }

  // CONTROLLER LOGIC
  // Project overview section logic
}
