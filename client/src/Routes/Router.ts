import { store } from "../Store/Store";

type Routes = {
  [key: string]: {
    controller: string;
    controllerMethod: string;
    folder: string;
    [key: string]: Routes | string;
  };
};

export class Router {
  routes: Routes = {};
  controller: any = null;

  constructor(routes: string[]) {
    this.registerRoutes(routes);
  }

  registerRoutes(routes: string[]): void {
    routes.forEach((route: string) => {
      const routeArray = route.slice(1).split("/");
      const routeFolder = routeArray
        .filter((item) => item.startsWith("@"))
        .map((item) => item.replace("@", "/"))
        .join("");

      const routeArrayWithoutFolder = routeArray.filter(
        (item) => !item.startsWith("@")
      );

      // postavaljanje path parama na existing route
      if (routeArrayWithoutFolder.length > 3)
        this.registerPathParameter(routeArrayWithoutFolder, routeFolder);
      else {
        this.routes[routeArrayWithoutFolder[0]] = {
          controller: routeArrayWithoutFolder[1],
          controllerMethod: routeArrayWithoutFolder[2],
          folder: routeFolder,
        };
      }
    });
  }

  route(uri: string = ""): void {
    //projects/192321390 projects/:projectId

    let isMatched = false;

    let path =
      uri.length > 0
        ? uri.toLowerCase()
        : window.location.pathname.slice(1).toLowerCase();

    // default to dashboard
    if (!path) {
      path = "dashboard";
      history.pushState("", "", "/dashboard");
    }

    store.setState({ activeLink: path.split("/").filter(Boolean)[0] });

    for (const [key, route] of Object.entries(this.routes)) {
      const pathArray = path.split("/");
      const keyArray = key.split("/");

      if (keyArray.length > 1 && pathArray.length > 1) {
        let booleanArray: boolean[] = [];

        // foreach koji checka svaki item u keyarrayu ubacuje true or false u booleanarray na temelju kojeg kasnije znam jel je to taj path ili nije
        keyArray.forEach((item) => {
          if (item.startsWith(":") || pathArray.includes(item))
            booleanArray.push(true);
          else booleanArray.push(false);
        });

        isMatched = booleanArray.every((item) => item === true);

        if (isMatched) {
          this.loadController(
            route.controller,
            route.controllerMethod,
            route.folder
          );
        }

        if (isMatched) break;
      } else {
        if (path === key) {
          this.loadController(
            route.controller,
            route.controllerMethod,
            route.folder
          );

          isMatched = true;
          if (isMatched) break;
        }
      }
    }
    /*
    if (!isMatched) {
      for (const [key, value] of Object.entries(this.routes)) {
      }
    }*/

    if (!isMatched) {
      this.loadController("ErrorView", "createError", "");
    }
  }

  async loadController(
    controllerName: string,
    controllerMethod: string,
    folder: string
  ) {
    // obrisi prethodni controller - stoream controller na klasi da ih konstantno brisem i da je samo jedan controller aktivan atm
    if (this.controller) this.removePreviousController();

    // import module klase, trenutno imam named export, ali moguce je i default loadat samo je malo drugaciji kod onda
    const module = await import(`../Views${folder}/${controllerName}`);

    // tu je kod drugaciji ak loadam default onda mogu accessati ko objekt new module.default, a ko named export je na ovaj nacin
    this.controller = new module[controllerName]();

    // lodanje controllera
    this.controller[controllerMethod]();
  }

  removePreviousController() {
    this.controller.delete();
    this.controller = null;
  }

  registerPathParameter(route: any, routeFolder: string) {
    const routeName = this.defineRouteName(route);
    const controllerArray = route.reverse().slice(0, 2).reverse();
    this.routes[routeName] = {
      controller: controllerArray[0],
      controllerMethod: controllerArray[1],
      folder: routeFolder,
    };
  }

  defineRouteName(route: any): string {
    // slice s minus prefixom roka sve od 0 indexa i staje prije zadnja dva
    const sliceLastTwoItemsFromArray = route.slice(0, -2);
    const arrayToString = sliceLastTwoItemsFromArray.join("/");

    return arrayToString;
  }
}
