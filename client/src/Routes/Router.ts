import { store } from "../Store/Store";

type Routes = {
  [key: string]: { controller: string; controllerMethod: string };
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
      this.routes[routeArray[0]] = {
        controller: routeArray[1],
        controllerMethod: routeArray[2],
      };
    });
  }

  route(uri: string = ""): void {
    let isMatched = false;
    const path =
      uri.length > 0
        ? uri.toLowerCase()
        : window.location.pathname.slice(1).toLowerCase();

    store.setState({ activeLink: path });

    for (const [key, route] of Object.entries(this.routes)) {
      console.log(key, route, uri);
      if (path === key) {
        this.loadController(route.controller, route.controllerMethod);
        isMatched = true;
        return;
      }
    }

    if (!isMatched) {
      this.loadController("ErrorController", "createError");
    }
  }

  async loadController(controllerName: string, controllerMethod: string) {
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
    this.controller.delete();
    this.controller = null;
  }
}
