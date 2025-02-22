<?php

$router->get('/get-user', 'AuthController@getUser');
$router->post('/login-user', 'AuthCoontroller@loginUser');
$router->post('/register-user', 'AuthCoontroller@registerUser');



?>