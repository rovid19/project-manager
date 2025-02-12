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
              className: `nav-avatar-${i}`,
              innerHTML: iconArray[i],
              id: "nav-avatar",
            }),
            createElement({
              tag: "div",
              innerText: navItemArray[i],
              className: `nav-text-${i}`,
              id: "nav-text",
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

export function activeLink() {
  const currentState = store.getState();
  const navLinkArray = ["dashboard", "projects", "tasks", "teams", "reports"];

  removePreviousActiveLinkColor(navLinkArray, currentState);
  setActiveLinkColor(navLinkArray, currentState);
}

function setActiveLinkColor(navLinkArray: string[], currentState: any) {
  navLinkArray.forEach((navItem, i) => {
    if (navItem === currentState.activeLink) {
      const navLinkElement = document.querySelector(
        `.nav-button-${i}`
      ) as HTMLElement;
      const navLinkText = document.querySelector(
        `.nav-text-${i}`
      ) as HTMLElement;
      const navLinkAvatar = document.querySelector(
        `.nav-avatar-${i}`
      ) as HTMLElement;

      navLinkElement.style.background = "#f2f2fc";
      navLinkText.style.color = "#646ae0";
      navLinkAvatar.style.color = "#646ae0";

      store.setState({ previousActiveLink: navItem });

      return;
    }
  });
}

function removePreviousActiveLinkColor(
  navLinkArray: string[],
  currentState: any
) {
  if (currentState.previousActiveLink.length > 0) {
    navLinkArray.forEach((navItem, i) => {
      if (navItem === currentState.previousActiveLink) {
        const navLinkElement = document.querySelector(
          `.nav-button-${i}`
        ) as HTMLElement;
        const navLinkText = document.querySelector(
          `.nav-text-${i}`
        ) as HTMLElement;
        const navLinkAvatar = document.querySelector(
          `.nav-avatar-${i}`
        ) as HTMLElement;

        navLinkElement.style.background = "white";
        navLinkText.style.color = "black";
        navLinkAvatar.style.color = "#black";
      }
    });
  }
}
