<?php

namespace Controllers;

class ProjectsController
{
    private $db;
    private $projectId;

    public function __construct($db, $projectId = "")
    {
        $this->db = $db;
        $this->projectId = $projectId;
    }

    public function getAllUserProjects()
    {
        session_start();

        $userId = $_SESSION['user-id'];

        $allUserProjects = $this->db->query("SELECT * FROM  project WHERE userId = :userId", ["userId" => $userId], "return");


        echo json_encode($allUserProjects);
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

    public function getUserProject()
    {
        session_start();
        $userId = $_SESSION['user-id'];

        $project = $this->db->query("SELECT * FROM project WHERE projectId = :projectId", [
            "projectId" => $this->projectId['projectId']
        ], "return");


        echo json_encode($project[0]);

        exit();
    }

    public function handleProjectSubmission()
    {
        $payload = json_decode(file_get_contents("php://input"), true);

        // update selektanih fieldova
        $sql = "UPDATE project SET title = :title, description = :description WHERE projectId = :projectId";
        $this->db->query($sql, [
            "title" => $payload['title'],
            "description" => $payload['description'],
            "projectId" => $this->projectId['projectId']
        ]);

        // trazenje tog projekta jer UPDATE query ne returna nis
        $project = $this->db->query("SELECT * FROM project WHERE projectId = :projectId", [
            "projectId" => $this->projectId['projectId']
        ], "return");

        echo json_encode($project);
    }

    public function handleDeleteProject()
    {
        $projectId = $this->projectId['projectId'];

        $this->db->query("DELETE FROM project WHERE projectId = :projectId", [
            "projectId" => $projectId
        ]);

        echo json_encode(["message" => "project successfully deleted"]);
    }
}
