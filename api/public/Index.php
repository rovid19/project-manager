<?php
require __DIR__ . '/../vendor/autoload.php';
require "../src/utils/Helpers.php";


use Framework\Router;

$router = new Router();
$routes  = require "../src/Routes.php";

$uri = $_SERVER['REQUEST_URI'];
$method = $_SERVER['REQUEST_METHOD'];


$router->route($uri, $method);

?>