import { createElement } from "../Utils/Helpers";
import "../Styles/Sidebar.css";
import { router } from "../main";
import { userStore } from "../Store/UserStore";
import { AuthService } from "../Services/AuthService";
import { store } from "../Store/Store";
import { iconArray } from "../Assets/Icons";

export function createSidebar() {
  const currentState = store.getState();

  // sidebar container
  const sidebar = createElement({ tag: "div", className: "sidebar" });
  const innerSidebar = createElement({
    tag: "div",
    className: "innerSidebar",
  });
  currentState.mainDivApp?.appendChild(sidebar);
  sidebar.appendChild(innerSidebar);

  // Create app logo/branding
  createBranding(innerSidebar);

  // Create navigation
  createNavigation(innerSidebar);

  // Create user section
  createUserSection(innerSidebar);
}

function createBranding(sidebar: HTMLElement) {
  const branding = createElement({
    tag: "div",
    className: "sidebarBranding",
    children: [
      createElement({
        tag: "div",
        className: "appLogo",
        html: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`,
      }),
    ],
  });

  sidebar.appendChild(branding);
}

function createNavigation(sidebar: HTMLElement) {
  const navItemArray = [
    {
      name: "dashboard",
      icon: iconArray[0],
    },
    {
      name: "projects",
      icon: iconArray[1],
    },
    {
      name: "tasks",
      icon: iconArray[2],
    },
    {
      name: "teams",
      icon: iconArray[3],
    },
    {
      name: "reports",
      icon: iconArray[4],
    },
  ];

  // Create nav section
  const navSection = createElement({
    tag: "div",
    className: "sidebarSection",
  });

  // Create nav heading
  const navHeading = createElement({
    tag: "h2",
    className: "sidebarHeading",
    text: "Menu",
  });
  navSection.appendChild(navHeading);

  // Create nav
  const nav = createElement({
    tag: "nav",
    className: "sidebarNav",
  });
  navSection.appendChild(nav);

  // Create nav items
  navItemArray.forEach((item) => {
    console.log(item);
    const navItem = createElement({
      tag: "div",
      className: "navItem",
      data: item.name,
      children: [
        createElement({
          tag: "a",
          className: "navLink",
          onClick: (e: Event) => {
            e.preventDefault();
            history.pushState({}, "", `/${item.name.toLowerCase()}`);
            router.route(`${item.name}`);
          },
          children: [
            createElement({
              tag: "div",
              className: "navIcon",
              innerHTML: item.icon,
            }),
            createElement({
              tag: "span",
              className: "navText",
              text: item.name.charAt(0).toUpperCase() + item.name.slice(1),
            }),
          ],
        }),
      ],
    });
    nav.appendChild(navItem);
  });

  sidebar.appendChild(navSection);
}

function createUserSection(sidebar: HTMLElement) {
  const currentState = userStore.getState();
  const username = currentState.username;
  const initial = username ? username.charAt(0).toUpperCase() : "U";

  const userSection = createElement({
    tag: "div",
    className: "userSection",
    children: [
      createElement({
        tag: "div",
        className: "userAvatar",
        text: initial,
      }),
      createElement({
        tag: "div",
        className: "userInfo",
        children: [
          createElement({
            tag: "h3",
            className: "userName",
            text: username || "User",
          }),
          createElement({
            tag: "a",
            className: "userProfileLink",
            text: "View profile",
            href: "/profile",
          }),
        ],
      }),
      createElement({
        tag: "button",
        className: "logoutButton",
        innerHtml: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>`,
        onClick: (e: Event) => {
          e.preventDefault();
          logoutUser();
        },
      }),
    ],
  });

  sidebar.appendChild(userSection);
}

export function activeLink() {
  console.log(window.location.pathname);
  if (
    window.location.pathname === "/login" ||
    window.location.pathname === "/register"
  ) {
    return;
  }

  const currentState = store.getState();
  const navItems = document.querySelectorAll(".navItem");

  // Remove active id from all items
  navItems.forEach((item) => {
    item.removeAttribute("id");
  });

  //get current active link in string
  const activeLink = window.location.pathname.slice(1);

  // Add active id to current item
  navItems.forEach((navItem) => {
    if ((navItem as HTMLElement).dataset.projectId === activeLink) {
      navItem.setAttribute("id", "active");
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
    username.innerText = currentState.username || "User";
  }

  if (userAvatar) {
    userAvatar.innerText = currentState.username.charAt(0).toUpperCase() || "U";
  }
}

async function logoutUser() {
  userStore.setState({ username: "", email: "" });
  history.pushState({}, "", "/login");
  router.route("login");
  let apiCall = new AuthService("http://localhost:3000/user-logout");
  await apiCall.post({});
}
