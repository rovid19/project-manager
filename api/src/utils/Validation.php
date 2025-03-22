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
}
