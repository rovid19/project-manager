import { router } from "../main";
import { Project, userStore } from "../Store/UserStore";
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

  projects.forEach((project: Project) => {
    const card = createElement({
      tag: "div",
      className: "project-card",
      data: project.projectId,
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
  projectCardEventDelegation(elementContainer);
}

function projectCardEventDelegation(parentContainer: HTMLElement) {
  parentContainer.addEventListener("click", (e: Event) => {
    const target = e.target as HTMLElement;
    const projectId = (target.closest(".project-card") as HTMLElement).dataset
      .projectId;
    history.pushState("", "", `/projects/${projectId}`);
    router.route(`/projects/${projectId}`);
  });
}
