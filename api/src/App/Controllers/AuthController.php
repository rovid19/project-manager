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
        session_start();

        var_dump($_SESSION);
        if (!isset($_SESSION['user-id'])) {
            echo json_encode(["error" => "User not logged in"]);
            exit();
        }

        $userId = $_SESSION['user-id'];

        $user = $this->db->query("SELECT * FROM users WHERE idusers = :idusers", [
            "idusers" => $userId
        ], "select");
        $userFound = isset($user[0]['username']) ? true : false;

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

        $this->startSession(($user));

        echo json_encode(["user" => $user]);

        exit();
    }

    public function registerUser()
    {
        session_start();

        header('Content-Type: application/json');

        // generate unique user id = UUID
        $id = uniqid('', true);
        $data = json_decode(file_get_contents("php://input"), true);

        $this->db->query(
            "INSERT INTO users (userId, username,email,password) VALUES (:userId, :username, :email, :password)",
            [
                "userId" => $id,
                "username" => $data['username'],
                "email" => $data['email'],
                "password" => $data['password'],

            ]
        );
        $user = ["userId" => $id, "username" => $data['username'], "email" => $data['email']];
        $this->startSession($user);

        echo json_encode(["email" => $data['email'], "pass" => $data['password'], "username" => $data['username']]);

        exit();
    }

    public function userLogout()
    {
        session_start();
        // Unset all session variables
        session_unset();
        // Destroy the session
        session_destroy();

        echo json_encode(["message" => "User successfully logged out"]);
    }

    public function startSession($user)
    {
        // session_start();

        // Regenerate session ID for security reasons
        session_regenerate_id(true);

        $_SESSION['user-id'] = $user['userId'];
        $_SESSION['user-username'] = $user['username'];
        $_SESSION['user-email'] = $user['email'];
    }
}
