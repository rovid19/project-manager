<?php
header('Access-Control-Allow-Origin: http://localhost:5173'); // Your frontend URL
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true');
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require __DIR__ . '/../vendor/autoload.php';
require "../src/utils/Helpers.php";




use Framework\Router;


$router = new Router();
$routes  = require "../src/Routes.php";




$uri = $_SERVER['REQUEST_URI'];
$method = $_SERVER['REQUEST_METHOD'];


$router->route($uri, $method);
