import { createElement } from "../Global/helpers";
import "../Styles/Sidebar.css";

export function createSidebar() {
  const sidebar = document.createElement("div");
  sidebar.classList.add("sidebar");
  document.body.appendChild(sidebar);

  createNavigation(sidebar);
  createUserSection(sidebar);
}

function createNavigation(sidebar: HTMLElement) {
  const navItemArray = ["Dashboard", "Projects", "Tasks", "Teams", "reports"];
  const nav = document.createElement("nav");
  nav.classList.add("navbar");
  sidebar.appendChild(nav);

  for (let i = 0; i < 5; i++) {
    const navItem = createElement({
      tag: "div",
      class: `nav-button-${i}`,
      text: navItemArray[i],
    });
    nav.appendChild(navItem);
  }
}

function createUserSection(sidebar: HTMLElement) {
  const containerElements = {
    container: { tag: "div", class: "user-container" },
    avatar: { tag: "img", class: "user-container-avatar" },
    username: { tag: "h1", class: "user-container-username", text: "Celavac" },
    link: {
      tag: "a",
      class: "user-container-username",
      href: "/",
      text: "view profile",
    },
    icon: { tag: "svg", class: "user-container-icon" },
  };

  const userContainer = createElement(containerElements.container);
  sidebar.appendChild(userContainer);

  Object.entries(containerElements).forEach(([key, props]) => {
    if (key === "container") return;
    const navItem = createElement(props);
    userContainer.appendChild(navItem);
  });
}
