import { createMainContent } from "./Components/MainContent";
import {
  activeLink,
  createSidebar,
  updateUserInfo,
} from "./Components/Sidebar";
import { Router } from "./Routes/Router";
import { store } from "./Store/Store";
import { userStore } from "./Store/UserStore";
import "./Styles/Root.css";
import { getUser } from "./Utils/Helpers";

export const router = new Router([
  // auth
  "/login/AuthView/createAuth/@Auth",
  "/register/AuthView/createAuth/@Auth",
  // dashboard
  "/dashboard/DashboardView/createDashboard/@Dashboard",
  // projects
  "/projects/ProjectsView/renderProjectsPage/@Projects/@ProjectsPage",
  "/projects/:projectId/ProjectView/renderProjectPage/@Projects/@ProjectPage",
  "/projects/:projectId/tasks/:taskId/ProjectsView/createSingleProjectPage",
  // tasks
  "/tasks/TasksView/createTasks/@Tasks",
  // teams
  "/teams/TeamsView/renderTeams/@Teams/@TeamsPage",
  "/teams/:teamId/TeamView/renderTeam/@Teams/@TeamPage",
  // reports
  "/reports/ReportsView/createReports/@Reports",
]);

getUser().then(() => {
  createSidebar();
  createMainContent();
  store.subscribe(activeLink, "activeLink");
  userStore.subscribe(updateUserInfo, "username");
  router.route();
});
