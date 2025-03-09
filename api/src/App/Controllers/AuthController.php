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

        if (!isset($_SESSION['user-id'])) {
            echo json_encode(["error" => "User not logged in"]);
            exit();
        }

        $userId = $_SESSION['user-id'];

        $user = $this->db->query("SELECT * FROM users WHERE userId = :userId", [
            "userId" => $userId
        ], "return");
        $userFound = isset($user[0]['username']) ? true : false;

        echo json_encode(["username" => $userFound ? $user[0]['username'] : "", "email" => $userFound ? $user[0]['email'] : ""]);

        exit();
    }


    public function loginUser()

    {
        session_start();

        header('Content-Type: application/json');

        $data = json_decode(file_get_contents("php://input"), true);
        $user = $this->db->query("SELECT * FROM users WHERE username = :username AND password = :password;", [
            "username" => $data['username'],
            "password" => $data['password']
        ], "return");

        $this->storeUserSession(($user));

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
        $user = [["userId" => $id, "username" => $data['username'], "email" => $data['email']]];
        $this->storeUserSession($user);
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

        // remove cookie on frontend
        setcookie(session_name(), '', time() - 3600, '/'); // Expire cookie


        echo json_encode(["message" => "User successfully logged out"]);
    }

    public function storeUserSession($user)
    {
        // Regenerate session ID for security reasons
        session_regenerate_id(true);


        $_SESSION['user-id'] = $user[0]['userId'];
        $_SESSION['user-username'] = $user[0]['username'];
        $_SESSION['user-email'] = $user[0]['email'];
    }
}
