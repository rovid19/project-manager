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

        $data = json_decode(file_get_contents("php://input"), true);


        echo json_encode(["message" => "Received", "data" => $data]);

        exit();
    }
}
