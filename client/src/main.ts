import { createMainContent } from "./Components/MainContent";
import { createSidebar } from "./Components/Sidebar";
import { Router } from "./Routes/Router";
import "./Styles/Root.css";

export const router = new Router([
  "/dashboard/SectionController/createDashboard",
  "/projects/SectionController/createProjects",
  "/tasks/SectionController/createTasks",
  "/teams/SectionController/createTeams",
  "/reports/SectionController/createReports",
]);

createSidebar();
createMainContent();

document.addEventListener("DOMContentLoaded", () => {});
