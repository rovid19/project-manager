<?php

namespace Controllers;

use Framework\Validation;

class ProjectsController
{
    private $db;
    private $validation;
    private $projectId;

    public function __construct($db, $projectId = "")
    {
        $this->db = $db;
        $this->projectId = $projectId;
        $this->validation = new Validation();
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
        $projectId = uniqid('', true); // true je more secure, a false je less secure id

        $this->db->query("INSERT INTO project (projectId, title, description, icon, userId, members) VALUES (:projectId,:title, :description, :icon, :userId, :members)", [
            "projectId" => $projectId,
            "title" => $data['title'],
            "description" => $data['description'],
            "icon" => $data['icon'],
            "userId" => $userId,
            "members" => "[]"
        ]);


        echo json_encode(["message" => "project successfully created"]);
    }

    public function getUserProject()
    {
        if (isset($this->projectId['projectId'])) {
            $projectId = $this->validation->sanitizeString($this->projectId['projectId']);

            $project = $this->db->query("SELECT * FROM project WHERE projectId = :projectId ", ["projectId" => $projectId], "return");

            $projectMemberData = $this->db->query("
            SELECT
                u.userId,
                u.username,
                u.email
            FROM
                project p
            JOIN users u ON JSON_CONTAINS (
                p.members,
                JSON_QUOTE (CAST(u.userId AS CHAR)),
                '$'
            )
            WHERE
                p.projectId =:projectId
            ", ["projectId" => $projectId], "return");

            echo json_encode(["project" => $project[0], "membersData" => $projectMemberData]);
            exit();
        } else {
            echo json_encode(["message" => "project id isn't set correctly"]);
            exit();
        }
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

    public function getAllUsers()
    {
        $requestData = json_decode(file_get_contents("php://input"), true);

        if ($requestData !== "[]") {
            $membersString = str_replace(['"', '[', "]"], "", $requestData);
            $membersArray = explode(",", $membersString);
            $sanitizedMembersArray = $this->validation->sanitizeArray($membersArray);

            // validacija id-eva
            foreach ($sanitizedMembersArray as $id) {
                if (empty($id)) {
                    echo json_encode("one of ids inside id array isnt set correctly");
                }
            }

            $membersArray = [];
            foreach ($sanitizedMembersArray as $index => $arrayItem) {
                $membersArray["id$index"] = $arrayItem;
            }

            $placeholders = array_fill(0, count($membersArray), ":");
            $placeholders = array_map(fn($item, $index) => $item . "id" . $index, $placeholders, array_keys($placeholders));
            $SQL = implode(",", $placeholders);


            $allUsers = $this->db->query("SELECT userId, username, email FROM users WHERE userId NOT IN ($SQL)", $membersArray, "return");

            echo json_encode($allUsers);
        } else {
            $allUsers = $this->db->query("SELECT * FROM users", [], "return");

            echo json_encode($allUsers);
        }
    }

    public function handleAddMember()
    {
        $data = json_decode(file_get_contents("php://input"), true);

        if (isset($data['memberId']) && isset($data['projectId'])) {
            $memberId = $this->validation->sanitizeString($data['memberId']);
            $projectId = $this->validation->sanitizeString($data['projectId']);

            /* if ($this->validation->validateUniqueId($memberId)) {
                http_response_code(400);
                echo json_encode(["error" => "Invalid member id"]);
                return;
            }

            if ($this->validation->validateUniqueId($projectId)) {
                http_response_code(400);
                echo json_encode(["error" => "Invalid project id"]);
                return;
            }*/

            $query = "UPDATE project
            SET members = IF(members IS NULL, JSON_ARRAY(:memberId), JSON_ARRAY_APPEND(members, '$', :memberId))
            WHERE projectId = :projectId";

            $this->db->query($query, ["memberId" => $memberId, "projectId" => $projectId]);

            echo json_encode(["meesage" => "member has been added to the project"]);
            exit();
        } else {
            http_response_code(400);
            echo json_encode(["error" => "projectId or memberId isnt set correctly"]);
        }
    }
}
