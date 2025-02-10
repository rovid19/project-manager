import { createMainContent } from "./Components/MainContent";
import { createSidebar } from "./Components/Sidebar";
import { Router } from "./Routes/Router";
import "./Styles/Root.css";

export const router = new Router([
  "/dashboard/DashboardController/createDashboard",
  "/projects/ProjectsController/createProjects",
  "/tasks/TasksController/createTasks",
  "/teams/TeamsController/createTeams",
  "/reports/ReportsController/createReports",
]);

router.route();
createSidebar();
createMainContent();

document.addEventListener("DOMContentLoaded", () => {});
