<?php

// auth routes
$router->get('/get-user', 'AuthController@getUser');
$router->post('/login-user', 'AuthController@loginUser');
$router->post('/register-user', 'AuthController@registerUser');
$router->post("/user-logout", "AuthController@userLogout");


$router->post("/create-new-project", "ProjectsController@createNewProject");
$router->get("/get-all-user-projects", "ProjectsController@getAllUserProjects");
$router->get("/projects/get/{projectId}/team/{teamId}", "ProjectsController@getUserProject");
$router->put("/handle-project-submissions/{projectId}", "ProjectsController@handleProjectSubmission");
$router->delete("/handle-delete-project/{projectId}", "ProjectsController@handleDeleteProject");
$router->post('/get-all-users', 'ProjectsController@getAllUsers');
//$router->put('/handle-add-member-to-project', 'ProjectsController@handleAddMember');
//$router->put('/handle-remove-member', 'ProjectsController@handleRemoveMember');
$router->post("/projects/{projectId}/add/team", "ProjectsController@addTeam");

// tasks
$router->post("/create-new-task", "TasksController@createNewTask");
$router->put('/handle-remove-task', 'TasksController@handleRemoveTask');
$router->get("/tasks/get/{userId}", "TasksController@getAllUserTasks");

// teams
$router->get("/get-all-user-teams", "TeamsController@getAllUserTeams");
$router->post("/handle-create-team", "TeamsController@handleCreateTeam");
$router->get("/fetch-all-team-members/{teamId}", "TeamsController@fetchAllTeamMembers");
$router->get("/fetch-specific-team/{teamId}", "TeamsController@fetchSpecificTeam");
$router->put("/team/{teamId}", "TeamsController@saveTeamDetails");
$router->delete("/team/{teamId}/delete", "TeamsController@deleteTeam");
$router->post("/team/{teamId}/add/member", "TeamsController@addTeamMember");
$router->post("/team/{teamId}/add/admin", "TeamsController@addAdmin");
$router->delete("/team/{teamId}/remove/member/{userId}", "TeamsController@removeMember");
$router->delete("/projects/{projectId}/remove/{teamId}", "ProjectsController@removeTeam");


// user
$router->get("/user/{userId}/get/teams", "ProjectsController@getAllTeams");
