<?php


namespace Framework;



class Router
{
    protected $routes = [];


    public function registerRoute($method, $uri, $action)
    {
        [$controller, $controllerMethod] = explode('@', $action);

        $this->routes[] = [
            'method' => "$method",
            'uri' => "$uri",
            'controller' => "$controller",
            'controllerMethod' => "$controllerMethod"
        ];
    }


    public function get($uri, $controller)
    {
        $this->registerRoute("GET", $uri, $controller);
    }

    public function post($uri, $controller)
    {
        $this->registerRoute("POST", $uri, $controller);
    }

    public function put($uri, $controller)
    {
        $this->registerRoute("PUT", $uri, $controller);
    }

    public function delete($uri, $controller)
    {
        $this->registerRoute("DELETE", $uri, $controller);
    }


    public function route($uri, $method, $db)
    {
        $isMatched = false;
        $requestMethod = $_SERVER['REQUEST_METHOD'];
        $uriSegments = explode("/",  trim($uri, "/"));

        // normal routing
        foreach ($this->routes as $route) {
            if ($route['method'] === $requestMethod && $route['uri'] === $uri) {
                $isMatched = true;
                if ($this->handleRoute($isMatched, $route, $db, null)) {
                    break;
                }
            }
        }

        // routing kad imam paramse
        if (!$isMatched) {
            foreach ($this->routes as $route) {
                $routeSegments = explode("/", trim($route['uri'], "/"));
                $params = [];

                if (!$isMatched && count($routeSegments) === count($uriSegments) && $requestMethod === $route['method']) {
                    for ($i = 0; $i < count($uriSegments); $i++) {
                        if ($uriSegments[$i] === $routeSegments[$i]) {
                            $isMatched = true;
                        } elseif (preg_match('/\{(.+?)\}/', $routeSegments[$i], $matches)) {
                            $isMatched = true;
                            $params[$matches[1]] = $uriSegments[$i];
                        } else {
                            inspect($uriSegments[$i]);
                            $isMatched = false;
                            break;
                        }
                    }
                }

                if ($this->handleRoute($isMatched, $route, $db, $params)) {
                    break;
                }
            };
        }
    }

    public function error($httpCode = "404") {}

    public function handleRoute($isMatched, $route, $db, $params)
    {
        $paramValue = is_array($params) ? $params : null;

        if ($isMatched) {
            $this->executeRoute(
                $route['controller'],
                $route['controllerMethod'],
                $db,
                $paramValue

            );
            return true;
        } else {
            $this->error();
        }
    }

    public function executeRoute($controller, $controllerMethod, $db, $params)
    {
        $controllerRoute = 'Controllers\\' . $controller;
        if ($params) $controllerInstance = new $controllerRoute($db, $params);
        else $controllerInstance = new $controllerRoute($db);
        $controllerInstance->$controllerMethod();
    }
}
