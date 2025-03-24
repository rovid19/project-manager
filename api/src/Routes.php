<?php

// auth routes
$router->get('/get-user', 'AuthController@getUser');
$router->post('/login-user', 'AuthController@loginUser');
$router->post('/register-user', 'AuthController@registerUser');
$router->post("/user-logout", "AuthController@userLogout");


$router->post("/create-new-project", "ProjectsController@createNewProject");
$router->get("/get-all-user-projects", "ProjectsController@getAllUserProjects");
$router->get("/get-project/{projectId}", "ProjectsController@getUserProject");
$router->put("/handle-project-submissions/{projectId}", "ProjectsController@handleProjectSubmission");
$router->delete("/handle-delete-project", "ProjectsController@handleDeleteProject");
$router->get('/get-all-users', 'ProjectsController@getAllUsers');

// tasks
$router->post("/create-new-task", "TasksController@createNewTask");
