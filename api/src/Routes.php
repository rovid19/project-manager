<?php

// auth routes
$router->get('/get-user', 'AuthController@getUser');
$router->post('/login-user', 'AuthController@loginUser');
$router->post('/register-user', 'AuthController@registerUser');
$router->post("/user-logout", "AuthController@userLogout");


$router->post("/create-new-project", "ProjectsController@createNewProject");
