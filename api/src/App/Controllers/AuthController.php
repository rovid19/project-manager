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
        $headers = getallheaders();
        $authHeader = isset($headers['Authorization']) ? $headers['Authorization'] : '';
        $token = str_replace("Bearer ", "", $authHeader);

        $user = $this->db->query("SELECT * FROM users WHERE token = :token", [
            "token" => $token
        ], "select");
        $userFound = isset($user[0]['username']) ? true : false;

        // test 
        echo json_encode(["username" => $userFound ? $user[0]['username'] : "", "email" => $userFound ? $user[0]['email'] : ""]);

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
            "INSERT INTO users (idusers, username,email,password,token) VALUES (:idusers, :username, :email, :password, :token)",
            [
                "idusers" => $id,
                "username" => $data['username'],
                "email" => $data['email'],
                "password" => $data['password'],
                "token" => $token
            ]
        );

        echo json_encode(["email" => $data['email'], "pass" => $data['password'], "username" => $data['username'], "token" => $token]);

        exit();
    }
}
