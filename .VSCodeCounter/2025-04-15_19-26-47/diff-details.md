# Diff Details

Date : 2025-04-15 19:26:47

Directory /Users/rock/Documents/Projekti/project-manager/client

Total : 74 files,  3762 codes, -240 comments, 239 blanks, all 3761 lines

[Summary](results.md) / [Details](details.md) / [Diff Summary](diff.md) / Diff Details

## Files
| filename | language | code | comment | blank | total |
| :--- | :--- | ---: | ---: | ---: | ---: |
| [api/composer.json](/api/composer.json) | JSON | -16 | 0 | -1 | -17 |
| [api/composer.lock](/api/composer.lock) | JSON | -18 | 0 | -1 | -19 |
| [api/public/Index.php](/api/public/Index.php) | PHP | -19 | -2 | -9 | -30 |
| [api/src/App/Controllers/AuthController.php](/api/src/App/Controllers/AuthController.php) | PHP | -73 | -5 | -35 | -113 |
| [api/src/App/Controllers/ProjectsController.php](/api/src/App/Controllers/ProjectsController.php) | PHP | -146 | -14 | -49 | -209 |
| [api/src/App/Controllers/TasksController.php](/api/src/App/Controllers/TasksController.php) | PHP | -60 | -7 | -16 | -83 |
| [api/src/Config/db.php](/api/src/Config/db.php) | PHP | -8 | 0 | -2 | -10 |
| [api/src/Framework/Database.php](/api/src/Framework/Database.php) | PHP | -39 | -12 | -12 | -63 |
| [api/src/Framework/Router.php](/api/src/Framework/Router.php) | PHP | -91 | -2 | -25 | -118 |
| [api/src/Framework/Validation.php](/api/src/Framework/Validation.php) | PHP | -28 | -6 | -9 | -43 |
| [api/src/Routes.php](/api/src/Routes.php) | PHP | -14 | -2 | -6 | -22 |
| [api/src/utils/Helpers.php](/api/src/utils/Helpers.php) | PHP | -17 | -10 | -8 | -35 |
| [api/vendor/autoload.php](/api/vendor/autoload.php) | PHP | -20 | -1 | -5 | -26 |
| [api/vendor/composer/ClassLoader.php](/api/vendor/composer/ClassLoader.php) | PHP | -286 | -235 | -59 | -580 |
| [api/vendor/composer/InstalledVersions.php](/api/vendor/composer/InstalledVersions.php) | PHP | -188 | -140 | -51 | -379 |
| [api/vendor/composer/autoload\_classmap.php](/api/vendor/composer/autoload_classmap.php) | PHP | -6 | -1 | -4 | -11 |
| [api/vendor/composer/autoload\_namespaces.php](/api/vendor/composer/autoload_namespaces.php) | PHP | -5 | -1 | -4 | -10 |
| [api/vendor/composer/autoload\_psr4.php](/api/vendor/composer/autoload_psr4.php) | PHP | -7 | -1 | -4 | -12 |
| [api/vendor/composer/autoload\_real.php](/api/vendor/composer/autoload_real.php) | PHP | -24 | -4 | -9 | -37 |
| [api/vendor/composer/autoload\_static.php](/api/vendor/composer/autoload_static.php) | PHP | -36 | -1 | -8 | -45 |
| [api/vendor/composer/installed.json](/api/vendor/composer/installed.json) | JSON | -5 | 0 | -1 | -6 |
| [api/vendor/composer/installed.php](/api/vendor/composer/installed.php) | PHP | -23 | 0 | -1 | -24 |
| [client/index.html](/client/index.html) | HTML | 13 | 0 | 1 | 14 |
| [client/package-lock.json](/client/package-lock.json) | JSON | 920 | 0 | 1 | 921 |
| [client/package.json](/client/package.json) | JSON | 15 | 0 | 1 | 16 |
| [client/src/Assets/Icons.ts](/client/src/Assets/Icons.ts) | TypeScript | 57 | 0 | 11 | 68 |
| [client/src/Components/MainContent.ts](/client/src/Components/MainContent.ts) | TypeScript | 12 | 0 | 2 | 14 |
| [client/src/Components/PopupModal.ts](/client/src/Components/PopupModal.ts) | TypeScript | 26 | 0 | 3 | 29 |
| [client/src/Components/ProjectCard.ts](/client/src/Components/ProjectCard.ts) | TypeScript | 57 | 0 | 6 | 63 |
| [client/src/Components/Sidebar.ts](/client/src/Components/Sidebar.ts) | TypeScript | 188 | 13 | 24 | 225 |
| [client/src/Routes/Router.ts](/client/src/Routes/Router.ts) | TypeScript | 88 | 14 | 23 | 125 |
| [client/src/Services/AuthService.ts](/client/src/Services/AuthService.ts) | TypeScript | 49 | 0 | 9 | 58 |
| [client/src/Services/BaseService.ts](/client/src/Services/BaseService.ts) | TypeScript | 55 | 1 | 11 | 67 |
| [client/src/Services/ProjectsService.ts](/client/src/Services/ProjectsService.ts) | TypeScript | 47 | 0 | 13 | 60 |
| [client/src/Services/TaskService.ts](/client/src/Services/TaskService.ts) | TypeScript | 13 | 0 | 3 | 16 |
| [client/src/Store/Store.ts](/client/src/Store/Store.ts) | TypeScript | 48 | 21 | 16 | 85 |
| [client/src/Store/UserStore.ts](/client/src/Store/UserStore.ts) | TypeScript | 33 | 0 | 6 | 39 |
| [client/src/Styles/Dashboard.css](/client/src/Styles/Dashboard.css) | CSS | 45 | 44 | 9 | 98 |
| [client/src/Styles/Error.css](/client/src/Styles/Error.css) | CSS | 11 | 0 | 2 | 13 |
| [client/src/Styles/Login.css](/client/src/Styles/Login.css) | CSS | 81 | 0 | 13 | 94 |
| [client/src/Styles/MainContent.css](/client/src/Styles/MainContent.css) | CSS | 5 | 1 | 1 | 7 |
| [client/src/Styles/Project.css](/client/src/Styles/Project.css) | CSS | 315 | 43 | 54 | 412 |
| [client/src/Styles/ProjectMemberPopup.css](/client/src/Styles/ProjectMemberPopup.css) | CSS | 89 | 0 | 14 | 103 |
| [client/src/Styles/ProjectPopup.css](/client/src/Styles/ProjectPopup.css) | CSS | 71 | 0 | 10 | 81 |
| [client/src/Styles/Projects.css](/client/src/Styles/Projects.css) | CSS | 146 | 2 | 25 | 173 |
| [client/src/Styles/Reports.css](/client/src/Styles/Reports.css) | CSS | 0 | 0 | 1 | 1 |
| [client/src/Styles/Root.css](/client/src/Styles/Root.css) | CSS | 12 | 0 | 3 | 15 |
| [client/src/Styles/SharedStylings/Popup.css](/client/src/Styles/SharedStylings/Popup.css) | CSS | 41 | 0 | 6 | 47 |
| [client/src/Styles/SharedStylings/ProjectCards.css](/client/src/Styles/SharedStylings/ProjectCards.css) | CSS | 43 | 1 | 8 | 52 |
| [client/src/Styles/SharedStylings/SectionHeader.css](/client/src/Styles/SharedStylings/SectionHeader.css) | CSS | 11 | 0 | 2 | 13 |
| [client/src/Styles/SharedStylings/UpperInnerSection.css](/client/src/Styles/SharedStylings/UpperInnerSection.css) | CSS | 27 | 0 | 2 | 29 |
| [client/src/Styles/Sidebar.css](/client/src/Styles/Sidebar.css) | CSS | 110 | 1 | 18 | 129 |
| [client/src/Styles/Tasks.css](/client/src/Styles/Tasks.css) | CSS | 0 | 0 | 1 | 1 |
| [client/src/Styles/TeamPopup.css](/client/src/Styles/TeamPopup.css) | CSS | 62 | 0 | 9 | 71 |
| [client/src/Styles/Teams.css](/client/src/Styles/Teams.css) | CSS | 236 | 28 | 39 | 303 |
| [client/src/Types/css.d.ts](/client/src/Types/css.d.ts) | TypeScript | 4 | 0 | 0 | 4 |
| [client/src/Utils/Helpers.ts](/client/src/Utils/Helpers.ts) | TypeScript | 76 | 4 | 18 | 98 |
| [client/src/Views/App/AuthView.ts](/client/src/Views/App/AuthView.ts) | TypeScript | 177 | 11 | 23 | 211 |
| [client/src/Views/App/DashboardView.ts](/client/src/Views/App/DashboardView.ts) | TypeScript | 159 | 6 | 20 | 185 |
| [client/src/Views/App/ErrorView.ts](/client/src/Views/App/ErrorView.ts) | TypeScript | 41 | 0 | 6 | 47 |
| [client/src/Views/App/ProjectView.ts](/client/src/Views/App/ProjectView.ts) | TypeScript | 496 | 4 | 44 | 544 |
| [client/src/Views/App/ProjectsView.ts](/client/src/Views/App/ProjectsView.ts) | TypeScript | 256 | 3 | 30 | 289 |
| [client/src/Views/App/ReportsView.ts](/client/src/Views/App/ReportsView.ts) | TypeScript | 38 | 0 | 4 | 42 |
| [client/src/Views/App/TasksView.ts](/client/src/Views/App/TasksView.ts) | TypeScript | 38 | 0 | 4 | 42 |
| [client/src/Views/App/TeamsView.ts](/client/src/Views/App/TeamsView.ts) | TypeScript | 158 | 0 | 6 | 164 |
| [client/src/Views/ProjectPopupViews/ProjectPopupMemberView.ts](/client/src/Views/ProjectPopupViews/ProjectPopupMemberView.ts) | TypeScript | 118 | 1 | 13 | 132 |
| [client/src/Views/ProjectPopupViews/ProjectPopupTaskView.ts](/client/src/Views/ProjectPopupViews/ProjectPopupTaskView.ts) | TypeScript | 199 | 1 | 17 | 217 |
| [client/src/Views/ProjectPopupViews/ProjectPopupView.ts](/client/src/Views/ProjectPopupViews/ProjectPopupView.ts) | TypeScript | 65 | 1 | 10 | 76 |
| [client/src/Views/TeamsPopupView/TeamsPopupView.ts](/client/src/Views/TeamsPopupView/TeamsPopupView.ts) | TypeScript | 68 | 1 | 5 | 74 |
| [client/src/index.html](/client/src/index.html) | HTML | 12 | 0 | 2 | 14 |
| [client/src/main.ts](/client/src/main.ts) | TypeScript | 32 | 0 | 3 | 35 |
| [client/src/vite-env.d.ts](/client/src/vite-env.d.ts) | TypeScript | 0 | 1 | 1 | 2 |
| [client/tsconfig.json](/client/tsconfig.json) | JSON with Comments | 19 | 2 | 3 | 24 |
| [client/vite.config.ts](/client/vite.config.ts) | TypeScript | 9 | 0 | 2 | 11 |

[Summary](results.md) / [Details](details.md) / [Diff Summary](diff.md) / Diff Details