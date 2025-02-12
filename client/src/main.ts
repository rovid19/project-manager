import { createMainContent } from "./Components/MainContent";
import { activeLink, createSidebar } from "./Components/Sidebar";
import { Router } from "./Routes/Router";
import { store } from "./Store/Store";
import "./Styles/Root.css";

export const router = new Router([
  "/dashboard/DashboardController/createDashboard",
  "/projects/ProjectsController/createProjects",
  "/tasks/TasksController/createTasks",
  "/teams/TeamsController/createTeams",
  "/reports/ReportsController/createReports",
]);

router.route();
store.subscribe(activeLink, "activeLink");
createSidebar();
createMainContent();

document.addEventListener("DOMContentLoaded", () => {});
