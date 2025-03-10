import { ProjectInfo } from "../Services/ProjectsService";
import { userStore } from "../Store/UserStore";
import { createElement } from "../Utils/Helpers";

export function renderProjectCards(
  elementContainer: HTMLElement,
  cardsNeeded: number | undefined = undefined
) {
  const currentState = userStore.getState();
  let projects = currentState.projects;

  if (cardsNeeded) {
    projects = projects.slice(0, cardsNeeded);
  }

  projects.forEach((project: ProjectInfo) => {
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
                  text: `Last updated: ${project.title}`,
                }),
              ],
            }),
          ],
        }),
        createElement({
          tag: "div",
          className: "card-icon",
          innerHTML: project.icon,
        }),
      ],
    });

    elementContainer.appendChild(card);
  });
}
