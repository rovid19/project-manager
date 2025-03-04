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



        foreach ($this->routes as $route) {

            if ($route['method'] === $method && $route['uri'] === $uri) {
                $isMatched = true;

                $this->executeRoute($route['controller'], $route['controllerMethod'], $db);
            }
        };

        if (!$isMatched) {
            $this->error();
        }
    }

    public function error($httpCode = "404") {}

    public function executeRoute($controller, $controllerMethod, $db)
    {
        $controllerRoute = 'Controllers\\' . $controller;
        $controllerInstance = new $controllerRoute($db);
        $controllerInstance->$controllerMethod();
    }
}
