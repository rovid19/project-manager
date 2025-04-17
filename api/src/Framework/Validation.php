<?php

namespace Framework;

class Validation
{
    public function isUserLoggedIn()
    {
        session_start();
        if (isset($_SESSION['user-id'])) {
            $userId = $_SESSION['user-id'];

            return $userId;
        } else {
            echo json_encode("user isn't logged in");
            exit();
        }
    }
    public function sanitizeString($inputString)
    {

        return htmlspecialchars(trim($inputString));
    }

    public function sanitizeArray($inputArray)
    {
        array_walk($inputArray, function (&$arrayItem) {
            $arrayItem = $this->sanitizeString($arrayItem);
        });
        return $inputArray;
    }

    public function validateEmail($inputEmail)
    {
        return filter_var($this->sanitizeString($inputEmail), FILTER_VALIDATE_EMAIL);
    }

    public function validateDate($inputDate)
    {
        return strtotime($this->sanitizeString($inputDate));
    }
    public function validateUniqueId($inputId)
    {
        return preg_match('/^[a-f0-9]{13}\.\d{8,}$/', $inputId); // Matches the format uniqid() produces
    }

    /*
    uuid
    public function validateUUID($inputId)
    {
        return preg_match('/^[a-f0-9-]{36}$/', $inputId);
    }*/
}
