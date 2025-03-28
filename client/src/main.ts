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

store.subscribe(activeLink, "activeLink");
userStore.subscribe(updateUserInfo, "username");

export const router = new Router([
  "/dashboard/DashboardController/createDashboard",
  "/projects/ProjectsController/createProjects",
  "/projects/:projectId/ProjectController/createProject",
  "/tasks/TasksController/createTasks",
  "/teams/TeamsController/createTeams",
  "/reports/ReportsController/createReports",
  "/login/AuthController/createAuth",
  "/register/AuthController/createAuth",
  "/projects/:projectId/tasks/:taskId/ProjectsController/createSingleProjectPage",
]);

router.route();

getUser();
createSidebar();
createMainContent();
