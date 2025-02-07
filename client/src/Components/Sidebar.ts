import { createElement } from "../Utils/Helpers";
import "../Styles/Sidebar.css";
import { store } from "../Store/Store";
import { avatarIcon, iconArray, logoutIcon } from "../Assets/Icons";
import { router } from "../main";

export function createSidebar() {
  const currentState = store.getState();

  // sidebar container
  const sidebar = createElement({ tag: "div", className: "sidebar" });
  currentState.mainDivApp?.appendChild(sidebar); // Using optional chaining

  createNavigation(sidebar);
  createUserSection(sidebar);
}

function createNavigation(sidebar: HTMLElement) {
  const navItemArray = ["Dashboard", "Projects", "Tasks", "Teams", "Reports"];

  // nav
  const nav = document.createElement("nav");
  nav.classList.add("navbar");
  sidebar.appendChild(nav);

  // nav links
  for (let i = 0; i < 5; i++) {
    const navItem = createElement({
      tag: "li",
      className: `nav-button-${i}`,
      children: [
        createElement({
          tag: "a",
          onClick: (e: Event) => {
            e.preventDefault();
            history.pushState({}, "", `/${navItemArray[i].toLowerCase()}`);
            router.route(`${navItemArray[i].toLowerCase()}`);
          }, //`/${navItemArray[i].toLowerCase()}`,
          children: [
            createElement({
              tag: "div",
              className: "nav-avatar",
              innerHTML: iconArray[i],
            }),
            createElement({
              tag: "div",
              innerText: navItemArray[i],
              className: "nav-text",
            }),
          ],
        }),
      ],
    });
    nav.appendChild(navItem);
  }
}

function createUserSection(sidebar: HTMLElement) {
  const containerElements = {
    container: { tag: "div", className: "user-container" },
    avatarContainer: {
      tag: "div",
      className: "user-container-avatar-container",
      innerHTML: avatarIcon,
    },

    usernameContainer: {
      tag: "div",
      className: "user-container-container",
      children: [
        createElement({
          tag: "h1",
          className: "user-container-username",
          text: "Celavac",
        }),
        createElement({
          tag: "a",
          className: "user-container-link",
          href: "/",
          text: "View profile",
        }),
      ],
    },

    iconContainer: {
      tag: "div",
      className: "user-container-icon-container",
      innerHTML: logoutIcon,
    },
  };

  const userContainer = createElement(containerElements.container);
  sidebar.appendChild(userContainer);

  // appending children to main element / moguce je napraviti isto i kroz children propse
  Object.entries(containerElements).forEach(([key, props]) => {
    if (key === "container") return;
    const navItem = createElement(props);
    userContainer.appendChild(navItem);
  });
}
