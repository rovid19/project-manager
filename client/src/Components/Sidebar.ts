import { createElement } from "../Utils/Helpers";
import "../Styles/Sidebar.css";
import { router } from "../main";
import { userStore } from "../Store/UserStore";
import { AuthService } from "../Services/AuthService";
import { store } from "../Store/Store";
import { iconArray, logoutIcon } from "../Assets/Icons";

export function createSidebar() {
  const currentState = store.getState();

  // sidebar container
  const sidebar = createElement({ tag: "div", className: "sidebar" });
  const innerSidebar = createElement({
    tag: "div",
    className: "innerSidebar",
  });
  const menuSection = createElement({
    tag: "div",
    className: "menuSection",
  });
  const logoutSection = createElement({
    tag: "div",
    className: "logoutSection",
  });

  currentState.mainDivApp?.appendChild(sidebar);
  sidebar.appendChild(innerSidebar);

  // Create profile section
  createProfileSection(innerSidebar);

  innerSidebar.appendChild(menuSection);

  // Create workspace section
  createWorkspaceSection(menuSection);

  // Create favorites section
  createFavoritesSection(menuSection);

  innerSidebar.appendChild(logoutSection);
  // Create user section
  createLogoutSection(logoutSection);
}

function createProfileSection(sidebar: HTMLElement) {
  const profile = createElement({
    tag: "div",
    className: "profileSection",
    children: [
      createElement({
        tag: "div",
        className: "profileAvatar",
        children: [
          createElement({
            tag: "span",
            text: "M",
          }),
        ],
      }),
      createElement({
        tag: "div",
        className: "profileInfo",
        children: [
          createElement({
            tag: "h3",
            className: "profileName",
            text: "mirko",
          }),
          createElement({
            tag: "span",
            className: "profileTitle",
            text: "Senior Developer",
          }),
        ],
      }),
    ],
  });

  sidebar.appendChild(profile);
}

function createWorkspaceSection(sidebar: HTMLElement) {
  const workspaceSection = createElement({
    tag: "div",
    className: "workspaceSection",
    children: [
      createElement({
        tag: "div",
        className: "sectionHeader",
        children: [
          createElement({
            tag: "span",
            className: "sectionTitle",
            text: "WORKSPACE",
          }),
          createElement({
            tag: "span",
            className: "sectionArrow",
            innerHTML:
              '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>',
          }),
        ],
      }),
      createElement({
        tag: "nav",
        className: "sectionNav",
        children: [
          createNavItem("Dashboard", iconArray[0], true, "3"),
          createNavItem("Projects", iconArray[1]),
          createNavItem("Tasks", iconArray[2]),
          createNavItem("Teams", iconArray[3]),
          createNavItem("Reports", iconArray[4]),
        ],
      }),
    ],
  });

  sidebar.appendChild(workspaceSection);
}

function createFavoritesSection(sidebar: HTMLElement) {
  const favoritesSection = createElement({
    tag: "div",
    className: "favoritesSection",
    children: [
      createElement({
        tag: "div",
        className: "sectionHeader",
        children: [
          createElement({
            tag: "span",
            className: "sectionTitle",
            text: "FAVORITES",
          }),
          createElement({
            tag: "span",
            className: "sectionArrow",
            innerHTML:
              '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>',
          }),
        ],
      }),
      createElement({
        tag: "nav",
        className: "sectionNav",
        children: [
          createFavoriteItem("Website Redesign", "#FF6B6B"),
          createFavoriteItem("Mobile App Dev", "#4ECDC4"),
          createFavoriteItem("Dashboard UI", "#96E6A1"),
        ],
      }),
    ],
  });

  sidebar.appendChild(favoritesSection);
}

function createNavItem(
  name: string,
  icon: string,
  isActive = false,
  badge?: string
): HTMLElement {
  const navItem = createElement({
    tag: "div",
    className: `navItem ${isActive ? "active" : ""}`,
    data: name.toLowerCase(),
    id: `${name.toLowerCase()}Item `,
    children: [
      createElement({
        tag: "a",
        className: "navLink",
        onClick: (e: Event) => {
          e.preventDefault();
          history.pushState({}, "", `/${name.toLowerCase()}`);
          router.route(name.toLowerCase());
        },
        children: [
          createElement({
            tag: "div",
            className: "navIcon",
            innerHTML: icon,
          }),
          createElement({
            tag: "span",
            className: "navText",
            text: name,
          }),
          badge &&
            createElement({
              tag: "span",
              className: "navBadge",
              text: badge,
            }),
        ],
      }),
    ],
  });

  return navItem;
}

function createFavoriteItem(name: string, color: string): HTMLElement {
  return createElement({
    tag: "div",
    className: "navItem",
    children: [
      createElement({
        tag: "a",
        className: "navLink",
        children: [
          createElement({
            tag: "span",
            className: "favoriteIcon",
            style: `background-color: ${color}`,
          }),
          createElement({
            tag: "span",
            className: "navText",
            text: name,
          }),
        ],
      }),
    ],
  });
}

function createLogoutSection(sidebar: HTMLElement) {
  const logoutNavItem = createNavItem("Logout", logoutIcon, false);

  sidebar.appendChild(logoutNavItem);
}

export function activeLink() {
  if (
    window.location.pathname === "/login" ||
    window.location.pathname === "/register"
  ) {
    return;
  }

  const navItems = document.querySelectorAll(".navItem");
  navItems.forEach((item) => {
    item.classList.remove("active");
  });

  const activeLink = window.location.pathname.slice(1);
  navItems.forEach((navItem) => {
    if ((navItem as HTMLElement).dataset.projectId === activeLink) {
      navItem.classList.add("active");
    }
  });
}

export function updateUserInfo() {
  if (
    window.location.pathname === "/login" ||
    window.location.pathname === "/register"
  ) {
    return;
  }

  const currentState = userStore.getState();
  const username = document.querySelector(".userName") as HTMLElement;
  const userAvatar = document.querySelector(".userAvatar") as HTMLElement;

  if (username) {
    username.innerText = currentState.username || "mirko";
  }

  if (userAvatar) {
    const avatarSpan = userAvatar.querySelector("span");
    if (avatarSpan) {
      avatarSpan.innerText =
        currentState.username.charAt(0).toUpperCase() || "M";
    }
  }
}

async function logoutUser() {
  userStore.setState({ username: "", email: "" });
  history.pushState({}, "", "/login");
  router.route("login");
  let apiCall = new AuthService("http://localhost:3000/user-logout");
  await apiCall.post({});
}
