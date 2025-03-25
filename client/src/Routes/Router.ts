import { store } from "../Store/Store";

type Routes = {
  [key: string]: {
    controller: string;
    controllerMethod: string;
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

      // postavaljanje path parama na existing route
      if (routeArray.length > 3) this.registerPathParameter(routeArray);
      else {
        this.routes[routeArray[0]] = {
          controller: routeArray[1],
          controllerMethod: routeArray[2],
        };
      }
    });
  }

  route(uri: string = ""): void {
    //projects/192321390 projects/:projectId

    let isMatched = false;
    let isCorrectPath = false;

    const path =
      uri.length > 0
        ? uri.toLowerCase()
        : window.location.pathname.slice(1).toLowerCase();

    store.setState({ activeLink: path.split("/").filter(Boolean)[0] });
    //console.log(path.split("/").filter(Boolean));
    for (const [key, route] of Object.entries(this.routes)) {
      const pathArray = path.split("/");
      const keyArray = key.split("/");

      if (keyArray.length > 1 && pathArray.length > 1) {
        keyArray.forEach((item) => {
          if (item.startsWith(":") || pathArray.find((key) => key === item))
            isCorrectPath = true;
          else isCorrectPath = false;
        });

        if (isCorrectPath) {
          this.loadController(route.controller, route.controllerMethod);
        }

        return;
      } else {
        if (path === key) {
          this.loadController(route.controller, route.controllerMethod);

          isMatched = true;
          return;
        }
      }
    }
    /*
    if (!isMatched) {
      for (const [key, value] of Object.entries(this.routes)) {
      }
    }*/

    if (!isMatched) {
      this.loadController("ErrorController", "createError");
    }
  }

  async loadController(controllerName: string, controllerMethod: string) {
    console.log(controllerMethod, controllerName);
    // obrisi prethodni controller - stoream controller na klasi da ih konstantno brisem i da je samo jedan controller aktivan atm
    if (this.controller) this.removePreviousController();

    // import module klase, trenutno imam named export, ali moguce je i default loadat samo je malo drugaciji kod onda
    const module = await import(`../Controllers/App/${controllerName}`);

    // tu je kod drugaciji ak loadam default onda mogu accessati ko objekt new module.default, a ko named export je na ovaj nacin
    this.controller = new module[controllerName]();

    // lodanje controllera
    this.controller[controllerMethod]();
  }

  removePreviousController() {
    console.log(this.controller);
    this.controller.delete();
    this.controller = null;
    console.log(this.controller);
  }

  registerPathParameter(route: any) {
    const routeName = this.defineRouteName(route);
    const controllerArray = route.reverse().slice(0, 2).reverse();
    this.routes[routeName] = {
      controller: controllerArray[0],
      controllerMethod: controllerArray[1],
    };
  }

  defineRouteName(route: any): string {
    // slice s minus prefixom roka sve od 0 indexa i staje prije zadnja dva
    const sliceLastTwoItemsFromArray = route.slice(0, -2);
    const arrayToString = sliceLastTwoItemsFromArray.join("/");

    return arrayToString;
  }
}
