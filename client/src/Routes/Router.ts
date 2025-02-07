type Routes = {
  [key: string]: { controller: string; controllerMethod: string };
};

export class Router {
  routes: Routes = {};

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

  route(uri: string): void {
    Object.entries(this.routes).forEach((route: any) => {
      if (uri === route[0]) {
        this.loadController(route[1].controller, route[1].controllerMethod);
      }
    });
    const path = window.location.pathname;
  }

  async loadController(controllerName: string, controllerMethod: string) {
    const controller = await import(`../Controllers/${controllerName}`);
    console.log(controller);
    controller.controllerMethod();
  }
}
