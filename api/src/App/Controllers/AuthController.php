<?php

namespace Controllers;




class AuthController
{
    private $db;

    public function __construct($db)
    {
        $this->db = $db;
    }




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

        $user = $this->db->query("SELECT * FROM users WHERE username = :username AND password = :password;", [
            "username" => $data['username'],
            "password" => $data['password']
        ], "select");

        echo json_encode(["user" => $user]);
        exit();
    }

    public function registerUser()
    {
        header('Content-Type: application/json');

        // generate unique user id = UUID
        $id = uniqid('', true);

        $token = bin2hex(random_bytes(32));
        $data = json_decode(file_get_contents("php://input"), true);

        $this->db->query(
            "INSERT INTO users (idusers, username,email,password) VALUES (:idusers, :username, :email, :password)",
            [
                "idusers" => $id,
                "username" => $data['username'],
                "email" => $data['email'],
                "password" => $data['password']
            ]
        );

        echo json_encode(["email" => $data['email'], "pass" => $data['password'], "users" => "da", "token" => $token]);

        exit();
    }
}
