import { createMainContent } from "../Components/MainContent";
import { router } from "../main";
import { ProjectsService } from "../Services/ProjectsService";
import type { AuthService } from "../Services/AuthService";
import { userStore } from "../Store/UserStore";
import { Team } from "../Types/TeamsTypes";

export let teamId = "";

export function createElement({
  tag,
  children,
  className,
  text,
  onClick,
  onChange,
  oninput,
  name,
  data,
  style,
  attributes,
  ...props
}: any) {
  // Handle element creation
  const element = document.createElement(tag);

  // Handle multiple classes
  if (className) {
    if (className.includes(" ")) {
      // If className contains spaces, add each class separately
      className.split(" ").forEach((cls: any) => {
        if (cls.trim()) element.classList.add(cls.trim());
      });
    } else {
      element.classList.add(className);
    }
  }

  if (text) element.innerText = text;
  if (name) element.name = name;
  if (data) element.dataset.projectId = data;
  if (style) {
    // Handle style as string or object
    if (typeof style === "string") {
      element.setAttribute("style", style);
    } else if (typeof style === "object") {
      Object.assign(element.style, style);
    }
  }

  // Handle attributes
  if (attributes) {
    Object.entries(attributes).forEach(([key, value]) => {
      element.setAttribute(key, value as string);
    });
  }

  Object.assign(element, props);

  // Handle event listeners
  if (onClick) element.onclick = onClick;
  if (onChange) element.onchange = onChange;
  if (oninput) element.oninput = oninput;

  // Handle children separately
  if (children) {
    children.forEach((child: any) => {
      if (child instanceof HTMLElement) element.appendChild(child);
    });
  }

  return element;
}

export function redirectToHome() {
  //createSidebar();
  createMainContent();

  history.pushState({}, "", "/dashboard");
  router.route("dashboard");
}

export async function getUser() {
  if (
    window.location.pathname !== "/login" &&
    window.location.pathname !== "/register"
  ) {
    const { AuthService } = await import("../Services/AuthService");
    let apiCall: AuthService | null = new AuthService(
      "http://localhost:3000/get-user"
    );
    await apiCall.getUser();

    apiCall = null;
  }
}

export function formValidation(
  ...inputs: HTMLInputElement[]
): (boolean | HTMLElement[])[] {
  let returnArray: (boolean | HTMLInputElement[])[] = [];
  let elementArray: HTMLInputElement[] = [];
  let validationConfirmed: boolean[] = [];

  inputs.forEach((input) => {
    if (input.value.length > 1) validationConfirmed.push(true);
    else validationConfirmed.push(false);
  });
  validationConfirmed.forEach((item, i) => {
    if (!item) {
      elementArray.push(inputs[i]);
    }
  });

  let isFormValid = validationConfirmed.every((item) => item === true);

  returnArray.push(isFormValid);
  returnArray.push(elementArray);

  // vraca array sa dva itema, prvi je isFormValid i drugi je htmlinputelement array koji nisu prosli validaciju
  return returnArray;
}

export function selectHtmlElement(e: Event, className: string) {
  const target = e.target as HTMLElement;
  const targetElement = target.closest(className) as HTMLElement;

  return targetElement;
}

/*export async function fetchAllUserProjects() {
  let apiCall = new ProjectsService(
    "http://localhost:3000/get-all-user-projects"
  ) as ProjectsService | null;

  await (apiCall as ProjectsService).fetchAllUserProjects();

  apiCall = null;
}
*/

export function countTeamMembers(teamMembers: string) {
  return teamMembers.split(",").length - 1;
}

export async function getUserData() {
  let result = await new ProjectsService(
    `http://localhost:3000/user/${userStore.getState().userId}/get/teams`
  ).getAllTeams();

  let newTeamState = [] as Team[];

  result.allTeams.forEach((item: any) => newTeamState.push(item));
  userStore.setState({ teams: newTeamState });
  result = null;
}

export function changeTeam(newTeam: string) {
  teamId = newTeam;
}

export const iconGradients = [
  // Define some gradient options

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

export function generateTitleHash(title: string) {
  const hash = title
    .split("")
    .reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0);

  return hash;
}

export function createReusableHeader(
  redirectBack: () => void,
  title: string,
  description: string,
  deleteAction: () => Promise<void>,
  view: string
): HTMLElement {
  const pageHeader = createElement({
    tag: "div",
    className: "projectHeader",
    children: [
      createElement({
        tag: "div",
        className: "headerLeft",
        children: [
          createElement({
            tag: "div",
            className: "breadcrumb",
            children: [
              createElement({
                tag: "a",
                className: "breadcrumbLink",
                text: view === "project" ? "Projects" : "Teams",
                onClick: (e: Event) => {
                  e.preventDefault();
                  redirectBack();
                },
              }),
              createElement({
                tag: "span",
                className: "breadcrumbSeparator",
                text: "/",
              }),
              createElement({
                tag: "span",
                className: "breadcrumbCurrent",
                text: title,
              }),
            ],
          }),
          createElement({
            tag: "h1",
            className: "projectTitle",
            text: title,
          }),

          createElement({
            tag: "p",
            className: "projectDescription",
            text: description ? description : "No description provided",
          }),
        ],
      }),
      createElement({
        tag: "div",
        className: "headerActions",
        children: [
          createElement({
            tag: "button",
            className: "deleteProjectBtn",
            children: [
              createElement({
                tag: "span",
                className: "btnIcon",
                html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>`,
              }),
              createElement({
                tag: "span",
                className: "btnText",
                text: view === "project" ? "Delete Project" : "Delete Team",
              }),
            ],
            onClick: async (e: Event) => {
              e.preventDefault();
              if (
                confirm(
                  `Are you sure you want to delete this ${
                    view === "project" ? "project" : "team"
                  }?`
                )
              ) {
                await deleteAction();
              }
            },
          }),
        ],
      }),
    ],
  });

  return pageHeader;
}
