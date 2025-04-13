import { createMainContent } from "./Components/MainContent";
import {
  activeLink,
  createSidebar,
  updateUserInfo,
} from "./Components/Sidebar";
import { Router } from "./Routes/Router";
import { store } from "./store/Store";
import { userStore } from "./store/UserStore";
import "./Styles/Root.css";
import { getUser } from "./Utils/Helpers";

export const router = new Router([
  "/dashboard/DashboardView/createDashboard",
  "/projects/ProjectsView/createProjects",
  "/projects/:projectId/ProjectView/createProject",
  "/tasks/TasksView/createTasks",
  "/teams/TeamsView/createTeams",
  "/reports/ReportsView/createReports",
  "/login/AuthView/createAuth",
  "/register/AuthView/createAuth",
  "/projects/:projectId/tasks/:taskId/ProjectsView/createSingleProjectPage",
  "/teams/TeamsView/createTeams",
  "/tasks/TasksView/createTasks",
  "/reports/ReportsView/createReports",
]);

router.route();

getUser().then(() => {
  createSidebar();
  createMainContent();
  store.subscribe(activeLink, "activeLink");
  userStore.subscribe(updateUserInfo, "username");
});
