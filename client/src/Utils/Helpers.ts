import { createMainContent } from "../Components/MainContent";
import { createSidebar } from "../Components/Sidebar";
import { router } from "../main";
import { AuthService } from "../Services/AuthService";
import { ProjectsService } from "../Services/ProjectsService";

export function createElement({
  tag,
  children,
  className,
  text,
  onClick,
  onChange,
  name,
  data,
  ...props
}: any) {
  // Handle element creation
  const element = document.createElement(tag);
  if (className) element.classList.add(className);
  if (text) element.innerText = text;
  if (name) element.name = name;
  if (data) element.dataset.projectId = data;
  Object.assign(element, props);

  // Handle event listeners
  if (onClick) element.onclick = onClick;

  if (onChange) element.onChange = onChange;

  // Handle children separately
  if (children) {
    children.forEach((child: any) => {
      if (child instanceof HTMLElement) element.appendChild(child);
    });
  }

  return element;
}

export function redirectToHome() {
  createSidebar();
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

export async function fetchAllUserProjects() {
  let apiCall = new ProjectsService(
    "http://localhost:3000/get-all-user-projects"
  ) as ProjectsService | null;

  await (apiCall as ProjectsService).fetchAllUserProjects();

  apiCall = null;
}
