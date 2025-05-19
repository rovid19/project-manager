import { createMainContent } from "../Components/MainContent";
//import { createSidebar } from "../Components/Sidebar";
import { router } from "../main";
import { AuthService } from "../Services/AuthService";
import { ProjectsService } from "../Services/ProjectsService";
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

export function createSidebar() {
  const sidebar = new Sidebar();
  document.body.appendChild(sidebar.getElement());
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
  {
    gradient: "linear-gradient(135deg, #f0f9ff, #e0f2fe)",
    text: "#0369a1",
  }, // Blue
  {
    gradient: "linear-gradient(135deg, #f0fdf4, #dcfce7)",
    text: "#166534",
  }, // Green
  {
    gradient: "linear-gradient(135deg, #fef2f2, #fee2e2)",
    text: "#991b1b",
  }, // Red
  {
    gradient: "linear-gradient(135deg, #faf5ff, #f3e8ff)",
    text: "#6b21a8",
  }, // Purple
  {
    gradient: "linear-gradient(135deg, #f8fafc, #e2e8f0)",
    text: "#334155",
  }, // Slate
  {
    gradient: "linear-gradient(135deg, #f5f5f4, #e7e5e4)",
    text: "#44403c",
  }, // Stone
  {
    gradient: "linear-gradient(135deg, #f7fee7, #ecfccb)",
    text: "#3f6212",
  }, // Lime
  {
    gradient: "linear-gradient(135deg, #f0fdfa, #ccfbf1)",
    text: "#115e59",
  }, // Teal
];

export function generateTitleHash(title: string) {
  const hash = title
    .split("")
    .reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0);

  return hash;
}
