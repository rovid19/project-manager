import { createElement } from "../Utils/Helpers";
import "../Styles/Sidebar.css";
import { store } from "../Store/Store";
import { avatarIcon, iconArray, logoutIcon } from "../Assets/Icons";
import { router } from "../main";
import { userStore } from "../Store/UserStore";
import { AuthService } from "../Services/AuthService";

export function createSidebar() {
  const currentState = store.getState();

  // sidebar container
  const sidebar = createElement({ tag: "div", className: "sidebar" });
  const innerSiderbar = createElement({
    tag: "div",
    className: "inner-sidebar",
  });
  currentState.mainDivApp?.appendChild(sidebar); // Using optional chaining
  sidebar.appendChild(innerSiderbar);

  createNavigation(innerSiderbar);
  createUserSection(innerSiderbar);
}

function createNavigation(sidebar: HTMLElement) {
  const navItemArray = ["dashboard", "projects", "tasks", "teams", "reports"];

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
            router.route(`${navItemArray[i]}`);
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
  const currentState = userStore.getState();
  const username = currentState.username;
  console.log(username);

  console.log(currentState);

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
          text: username ? username : "User",
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
      onClick: (e: Event) => {
        e.preventDefault();
        logoutUser();
      },
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

//
//
//
// ACTIVE LINK LOGIKA
//
//
//
export function activeLink() {
  if (
    window.location.pathname === "/login" ||
    window.location.pathname === "/register"
  ) {
  } else {
    const currentState = store.getState();
    const navLinkArray = ["dashboard", "projects", "tasks", "teams", "reports"];

    removePreviousActiveLinkColor(navLinkArray, currentState);
    setActiveLinkColor(navLinkArray, currentState);
  }
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
        `.nav-avatar-${currentState.activeLink}`
      ) as HTMLElement;

      // situacija u kojoj user loada tipa dashboard kroz url onda trebam na ovaj nacin pocekati element da se loadaju pa da napravim active link logiku
      if (!navLinkElement && !navLinkText && !navLinkAvatar) {
        const domLoaded = () => activeLink();
        window.addEventListener("DOMContentLoaded", domLoaded);

        setTimeout(() => {
          window.removeEventListener("DOMContentLoaded", domLoaded);
        }, 1000);
      } else {
        navLinkElement.style.background = "#353535";
        navLinkText.style.color = "white";
        navLinkAvatar.style.fill = "white";
      }

      store.setState({ previousActiveLink: navItem });

      return;
    }
  });
}

function removePreviousActiveLinkColor(
  navLinkArray: string[],
  currentState: any
) {
  //#393939;
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
          `.nav-avatar-${currentState.previousActiveLink}`
        ) as HTMLElement;

        navLinkElement.removeAttribute("style");
        navLinkText.removeAttribute("style");
        navLinkAvatar.removeAttribute("style");
      }
    });
  }
}

export function updateUserInfo() {
  if (
    window.location.pathname === "/login" ||
    window.location.pathname === "/register"
  ) {
  } else {
    const currentState = userStore.getState();
    const username = document.querySelector(
      ".user-container-username"
    ) as HTMLElement;
    username.innerText = currentState.username;
  }
}

async function logoutUser() {
  userStore.setState({ username: "", email: "" });
  history.pushState({}, "", "/login");
  router.route("login");
  let apiCall = new AuthService("http://localhost:3000/user-logout");
  await apiCall.post({});
}
