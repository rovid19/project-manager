<?php

namespace Framework;

class Validation
{

    public function sanitizeString($inputString)
    {
        return htmlspecialchars(trim($inputString));
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
        return preg_match('/^[a-f0-9]+\.[0-9]+$/', $inputId); // Matches the format uniqid() produces
    }

    /*
    uuid
    public function validateUUID($inputId)
    {
        return preg_match('/^[a-f0-9-]{36}$/', $inputId);
    }*/
}
