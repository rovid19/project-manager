import { createMainContent } from "./Components/MainContent";
import { activeLink, createSidebar } from "./Components/Sidebar";
import { Router } from "./Routes/Router";
import { store } from "./Store/Store";
import { userStore } from "./Store/UserStore";
import "./Styles/Root.css";

console.log(window.location.pathname);

store.subscribe(activeLink, "activeLink");
export const router = new Router([
  "/dashboard/DashboardController/createDashboard",
  "/projects/ProjectsController/createProjects",
  "/tasks/TasksController/createTasks",
  "/teams/TeamsController/createTeams",
  "/reports/ReportsController/createReports",
]);

router.route();

console.log(userStore);
createSidebar();
createMainContent();
