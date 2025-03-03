<?php

namespace Controllers;




class AuthController
{




    public function getUser()
    {
        inspect("yo");
        $data = json_decode(file_get_contents("php://input"), true);

        // test
        echo json_encode(["message" => "Received", "data" => $data]);

        exit();
    }


    public function loginUser()

    {
        header('Content-Type: application/json');

        $data = json_decode(file_get_contents("php://input"), true);


        echo json_encode(["message" => "Received", "data" => $data]);
        exit();
    }

    public function registerUser()
    {
        global $database;
        header('Content-Type: application/json');
        $token = bin2hex(random_bytes(32));

        $data = json_decode(file_get_contents("php://input"), true);

        /*$database->query(
            "INSERT INTO users (username,email,password) VALUES (:username, :email, :password)",
            ["username" => $data['username'], "email" => $data['email'], "password" => $data['password']]
        );*/

        echo json_encode(["email" => $data['email'], "pass" => $data['password']]);

        exit();
    }
}
