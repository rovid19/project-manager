<?php

namespace Framework;

use Exception;
use PDO;
use PDOException;

class Database
{
    public $conn;

    public function __construct($config)
    {
        // iz nekog razloga koji god port da koristim, connection je successful, dunno kaj se dogada
        $dsn = "mysql:host={$config['host']};port={$config['port']};dbname={$config['dbname']}";
        $options = [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_OBJ
        ];
        try {
            $this->conn = new PDO($dsn, $config["username"], $config["password"], $options);

            // samo provjera ako mi je conn instnca PHP data objecta onda je dobra konekcija
            /* if ($this->conn instanceof PDO) {
                echo "Database connected successfully!";
            }*/
        } catch (PDOException $e) {
            throw new Exception("Database connection failed: " . $e->getMessage());
        }
    }

    public function query($query, $params)
    {
        try {
            // prepare performa query, ali ga ne pokrece
            $sth = $this->conn->prepare($query,);

            // na queryu trebam ostaviti samo semicolon i kasnije tu datu moram bindati, jer bindanje tretira datu ko plain text, a ne ko executable query
            // npr. dobar query: "INSERT INTO users (username,email,password) VALUES (:username, :email,: password)"
            // npr. los query: "INSERT INTO users (username,email,password) VALUES ($username, $email, $password)"
            // ne stavljam direktno u values $data['username'], nego samo :username
            // kasnije bindam pravu datu na mjesto semicolona
            foreach ($params as $key => $value) {
                $sth->bindValue(':', $key, $value);
            }

            $sth->execute();
        } catch (PDOException $e) {
            throw new Exception("Query failed: " . $e->getMessage());
        }
    }
}
