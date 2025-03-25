# Diff Details

Date : 2025-03-25 17:20:29

Directory /Users/rock/Documents/Projekti/project-manager/client

Total : 73 files,  1773 codes, -327 comments, 136 blanks, all 1582 lines

[Summary](results.md) / [Details](details.md) / [Diff Summary](diff.md) / Diff Details

## Files
| filename | language | code | comment | blank | total |
| :--- | :--- | ---: | ---: | ---: | ---: |
| [api/composer.json](/api/composer.json) | JSON | -16 | 0 | -1 | -17 |
| [api/composer.lock](/api/composer.lock) | JSON | -18 | 0 | -1 | -19 |
| [api/public/Index.php](/api/public/Index.php) | PHP | -19 | -2 | -9 | -30 |
| [api/src/App/Controllers/AuthController.php](/api/src/App/Controllers/AuthController.php) | PHP | -73 | -5 | -35 | -113 |
| [api/src/App/Controllers/ProjectsController.php](/api/src/App/Controllers/ProjectsController.php) | PHP | -92 | -13 | -34 | -139 |
| [api/src/App/Controllers/TasksController.php](/api/src/App/Controllers/TasksController.php) | PHP | -60 | -7 | -16 | -83 |
| [api/src/Config/db.php](/api/src/Config/db.php) | PHP | -8 | 0 | -2 | -10 |
| [api/src/Framework/Database.php](/api/src/Framework/Database.php) | PHP | -39 | -11 | -11 | -61 |
| [api/src/Framework/Router.php](/api/src/Framework/Router.php) | PHP | -91 | -2 | -25 | -118 |
| [api/src/Framework/Validation.php](/api/src/Framework/Validation.php) | PHP | -21 | -6 | -7 | -34 |
| [api/src/Routes.php](/api/src/Routes.php) | PHP | -13 | -2 | -5 | -20 |
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
| [client/package.json](/client/package.json) | JSON | 15 | 0 | 1 | 16 |
| [client/src/Assets/Icons.ts](/client/src/Assets/Icons.ts) | TypeScript | 54 | 0 | 10 | 64 |
| [client/src/Assets/bicep.svg](/client/src/Assets/bicep.svg) | XML | 1 | 0 | 0 | 1 |
| [client/src/Assets/ecology.svg](/client/src/Assets/ecology.svg) | XML | 1 | 0 | 0 | 1 |
| [client/src/Assets/energy.svg](/client/src/Assets/energy.svg) | XML | 1 | 0 | 0 | 1 |
| [client/src/Assets/handshake.svg](/client/src/Assets/handshake.svg) | XML | 1 | 0 | 0 | 1 |
| [client/src/Assets/icons.svg](/client/src/Assets/icons.svg) | XML | 1 | 0 | 0 | 1 |
| [client/src/Assets/settings.svg](/client/src/Assets/settings.svg) | XML | 1 | 0 | 0 | 1 |
| [client/src/Assets/skull.svg](/client/src/Assets/skull.svg) | XML | 1 | 0 | 0 | 1 |
| [client/src/Assets/spaceship.svg](/client/src/Assets/spaceship.svg) | XML | 1 | 0 | 0 | 1 |
| [client/src/Assets/theater.svg](/client/src/Assets/theater.svg) | XML | 1 | 0 | 0 | 1 |
| [client/src/Assets/wireframe.svg](/client/src/Assets/wireframe.svg) | XML | 1 | 0 | 0 | 1 |
| [client/src/Components/MainContent.ts](/client/src/Components/MainContent.ts) | TypeScript | 12 | 0 | 2 | 14 |
| [client/src/Components/ProjectCard.ts](/client/src/Components/ProjectCard.ts) | TypeScript | 57 | 0 | 6 | 63 |
| [client/src/Components/Sidebar.ts](/client/src/Components/Sidebar.ts) | TypeScript | 184 | 13 | 24 | 221 |
| [client/src/Controllers/App/AuthController.ts](/client/src/Controllers/App/AuthController.ts) | TypeScript | 177 | 11 | 23 | 211 |
| [client/src/Controllers/App/DashboardController.ts](/client/src/Controllers/App/DashboardController.ts) | TypeScript | 146 | 6 | 20 | 172 |
| [client/src/Controllers/App/ErrorController.ts](/client/src/Controllers/App/ErrorController.ts) | TypeScript | 41 | 0 | 6 | 47 |
| [client/src/Controllers/App/ProjectController.ts](/client/src/Controllers/App/ProjectController.ts) | TypeScript | 257 | 1 | 30 | 288 |
| [client/src/Controllers/App/ProjectsController.ts](/client/src/Controllers/App/ProjectsController.ts) | TypeScript | 247 | 3 | 29 | 279 |
| [client/src/Controllers/App/ReportsController.ts](/client/src/Controllers/App/ReportsController.ts) | TypeScript | 6 | 1 | 1 | 8 |
| [client/src/Controllers/App/TasksController.ts](/client/src/Controllers/App/TasksController.ts) | TypeScript | 8 | 1 | 1 | 10 |
| [client/src/Controllers/App/TeamsController.ts](/client/src/Controllers/App/TeamsController.ts) | TypeScript | 8 | 1 | 1 | 10 |
| [client/src/Controllers/ProjectPopupControllers/ProjectPopupController.ts](/client/src/Controllers/ProjectPopupControllers/ProjectPopupController.ts) | TypeScript | 53 | 0 | 9 | 62 |
| [client/src/Controllers/ProjectPopupControllers/ProjectPopupMemberController.ts](/client/src/Controllers/ProjectPopupControllers/ProjectPopupMemberController.ts) | TypeScript | 93 | 1 | 13 | 107 |
| [client/src/Controllers/ProjectPopupControllers/ProjectPopupTaskController.ts](/client/src/Controllers/ProjectPopupControllers/ProjectPopupTaskController.ts) | TypeScript | 161 | 0 | 13 | 174 |
| [client/src/Routes/Router.ts](/client/src/Routes/Router.ts) | TypeScript | 86 | 13 | 23 | 122 |
| [client/src/Services/ApiService.ts](/client/src/Services/ApiService.ts) | TypeScript | 54 | 1 | 11 | 66 |
| [client/src/Services/AuthService.ts](/client/src/Services/AuthService.ts) | TypeScript | 53 | 0 | 9 | 62 |
| [client/src/Services/ProjectsService.ts](/client/src/Services/ProjectsService.ts) | TypeScript | 42 | 0 | 11 | 53 |
| [client/src/Services/TaskService.ts](/client/src/Services/TaskService.ts) | TypeScript | 14 | 0 | 3 | 17 |
| [client/src/Store/Store.ts](/client/src/Store/Store.ts) | TypeScript | 60 | 12 | 16 | 88 |
| [client/src/Store/UserStore.ts](/client/src/Store/UserStore.ts) | TypeScript | 26 | 0 | 4 | 30 |
| [client/src/Styles/Dashboard.css](/client/src/Styles/Dashboard.css) | CSS | 69 | 39 | 11 | 119 |
| [client/src/Styles/Error.css](/client/src/Styles/Error.css) | CSS | 11 | 0 | 2 | 13 |
| [client/src/Styles/Login.css](/client/src/Styles/Login.css) | CSS | 81 | 0 | 13 | 94 |
| [client/src/Styles/MainContent.css](/client/src/Styles/MainContent.css) | CSS | 5 | 1 | 1 | 7 |
| [client/src/Styles/Project.css](/client/src/Styles/Project.css) | CSS | 154 | 0 | 26 | 180 |
| [client/src/Styles/ProjectMemberPopup.css](/client/src/Styles/ProjectMemberPopup.css) | CSS | 84 | 0 | 15 | 99 |
| [client/src/Styles/ProjectPopup.css](/client/src/Styles/ProjectPopup.css) | CSS | 83 | 0 | 14 | 97 |
| [client/src/Styles/Projects.css](/client/src/Styles/Projects.css) | CSS | 210 | 3 | 35 | 248 |
| [client/src/Styles/Root.css](/client/src/Styles/Root.css) | CSS | 12 | 0 | 3 | 15 |
| [client/src/Styles/Sidebar.css](/client/src/Styles/Sidebar.css) | CSS | 106 | 1 | 18 | 125 |
| [client/src/Types/css.d.ts](/client/src/Types/css.d.ts) | TypeScript | 4 | 0 | 0 | 4 |
| [client/src/Utils/Helpers.ts](/client/src/Utils/Helpers.ts) | TypeScript | 76 | 4 | 18 | 98 |
| [client/src/index.html](/client/src/index.html) | HTML | 12 | 0 | 2 | 14 |
| [client/src/main.ts](/client/src/main.ts) | TypeScript | 28 | 0 | 5 | 33 |
| [client/src/vite-env.d.ts](/client/src/vite-env.d.ts) | TypeScript | 0 | 1 | 1 | 2 |
| [client/tsconfig.json](/client/tsconfig.json) | JSON with Comments | 19 | 2 | 3 | 24 |
| [client/vite.config.ts](/client/vite.config.ts) | TypeScript | 9 | 0 | 2 | 11 |

[Summary](results.md) / [Details](details.md) / [Diff Summary](diff.md) / Diff Details