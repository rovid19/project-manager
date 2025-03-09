<?php

namespace Controllers;

class ProjectsController
{
    private $db;

    public function __construct($db)
    {
        $this->db = $db;
    }

    public function getAllUserProjects()
    {
        session_start();

        $userId = $_SESSION['user-id'];

        $allUserProjects = $this->db->query("SELECT * FROM  project WHERE userId = :userId", ["userId" => $userId], "return");


        echo json_encode(["userProjects" => $allUserProjects]);
    }
    public function createNewProject()
    {
        session_start();

        $data = json_decode(file_get_contents("php://input"), true);
        $userId = $_SESSION['user-id'];
        $projectId = uniqid('', false); // true je more secure, a false je less secure id

        $this->db->query("INSERT INTO project (projectId, title, description, icon, userId) VALUES (:projectId,:title, :description, :icon, :userId)", [
            "projectId" => $projectId,
            "title" => $data['title'],
            "description" => $data['description'],
            "icon" => $data['icon'],
            "userId" => $userId,
        ]);


        echo json_encode(["message" => "project successfully created"]);
    }
}
