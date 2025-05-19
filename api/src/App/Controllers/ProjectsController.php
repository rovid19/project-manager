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
        $teamId = "";
        if (array_key_exists("teamId", $data)) {
            $teamId = $this->validation->sanitizeString($data["teamId"]);
        }



        $this->db->query("INSERT INTO project (projectId, title, description, icon, userId, members, teamId) VALUES (:projectId,:title, :description, :icon, :userId, :members, :teamId)", [
            "projectId" => $projectId,
            "title" => $data['title'],
            "description" => "",
            "icon" => $data['icon'],
            "userId" => $userId,
            "members" => "[]",
            "teamId" => /* $teamId ? $teamId :*/ "noTeam"
        ]);

        // $this->insertUserWhoCreatedProjectAsProjectMember($userId, $projectId);


        echo json_encode(["message" => "project successfully created"]);
    }

    /* public function insertUserWhoCreatedProjectAsProjectMember($userId, $projectId)
    {

        $this->db->query("INSERT INTO project_member (projectMemberId, userId, projectId) VALUES (:projectMemberId, :userId, :projectId)", [
            "projectMemberId" => uniqid("", true),
            "userId" => $userId,
            "projectId" => $projectId
        ]);
    }*/

    public function getUserProject()
    {
        if (isset($this->projectId['projectId'])) {
            $projectId = $this->validation->sanitizeString($this->projectId['projectId']);
            $teamId = $this->validation->sanitizeString($this->projectId["teamId"]);
            $project = $this->db->query("SELECT * FROM project WHERE projectId = :projectId ", ["projectId" => $projectId], "return");

            $projectMemberData = [];
            if ($this->projectId["teamId"] !== "noTeam") {
                $projectMemberData = $this->db->query("
            SELECT
            u.userId,
            u.username,
            u.email,
            tm.isAdmin
            FROM users AS u
            JOIN team_member AS tm
            ON tm.userId = u.userId
            WHERE tm.teamId = :teamId
            ", ["teamId" => $teamId], "return");
            }

            $projectTaskData = $this->db->query("
            SELECT
            t.taskId,
            t.title,
            t.description,
            t.deadline,
            t.assignee,
            u.username,
            u.userId
            FROM task t
            JOIN users u ON t.assignee = u.userId
            WHERE projectId = :projectId
            ", ["projectId" => $projectId], "return");

            echo json_encode(["project" => $project[0], "membersData" => $projectMemberData, "taskData" => $projectTaskData]);
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

        if (count($requestData) > 0) {
            /* $membersString = str_replace(['"', '[', "]"], "", $requestData);
            $membersArray = explode(",", $membersString);
            $sanitizedMembersArray = $this->validation->sanitizeArray($membersArray);*/
            $sanitizedMembersArray = $this->validation->sanitizeArray($requestData);

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
            $id = uniqid("", true);
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

            /*$query = "UPDATE project
            SET members = IF(members IS NULL, JSON_ARRAY(:memberId), JSON_ARRAY_APPEND(members, '$', :memberId))
            WHERE projectId = :projectId";*/

            $query = "INSERT INTO project_member (projectMemberId, userId, projectId) VALUES (:projectMemberId, :userId, :projectId) ";

            $this->db->query($query, ["projectMemberId" => $id, "userId" => $memberId, "projectId" => $projectId]);

            echo json_encode(["meesage" => "member has been added to the project"]);
            exit();
        } else {
            http_response_code(400);
            echo json_encode(["error" => "projectId or memberId isnt set correctly"]);
        }
    }

    public function addTeam()
    {
        $requestData = json_decode(file_get_contents("php://input"), true);

        if (!empty($requestData && !empty($this->projectId["projectId"]))) {
            $teamId = $this->validation->sanitizeString($requestData);
            $projectId = $this->validation->sanitizeString($this->projectId["projectId"]);

            $this->db->query("UPDATE project SET teamId = :teamId WHERE projectId = :projectId", ["teamId" => $teamId, "projectId" => $projectId]);

            echo json_encode("successfully added");
        }
    }


    public function handleRemoveMember()
    {
        $requestData = json_decode(file_get_contents("php://input"), true);


        if (isset($requestData['projectId']) && isset($requestData['projectMemberId'])) {
            $projectId = $this->validation->sanitizeString($requestData['projectId']);
            $memberId = $this->validation->sanitizeString($requestData['projectMemberId']);
            /*
            $query = "UPDATE project
            SET members = JSON_REMOVE(members, JSON_UNQUOTE(JSON_SEARCH(members, 'one', :memberId)))
            WHERE projectId = :projectId";
*/
            $query = "DELETE FROM project_member WHERE projectId = :projectId AND userId = :userId";
            $this->db->query($query, ["userId" => $memberId, "projectId" => $projectId]);

            echo json_encode(["meesage" => "member has been removed from the project"]);
            exit();
        } else {
            echo json_encode("projectId or memberId arent correctly set");
        }
    }


    public function getAllTeams()
    {

        if (!empty($this->projectId["userId"])) {

            $userId = $this->validation->sanitizeString($this->projectId["userId"]);
            //$teamId = $this->validation->sanitizeString($this->projectId["teamId"]);

            $allUserTeams = $this->db->query("
            SELECT 
            t.teamId,
            t.teamDescription,
            t.teamName,
            t.teamMembers
            FROM teams AS t 
            JOIN team_member AS tm
            ON tm.teamId = t.teamId
            WHERE tm.userId = :userId AND tm.isAdmin = :isAdmin", ["userId" => $userId, "isAdmin" => 1], "return");

            //$teamMembers = $this->db->query("SELECT");
            // $memberCount = $this->countMembersInTeam($teamId);


            echo json_encode(["allTeams" => $allUserTeams /*"memberCount" => $memberCount*/]);
        }
    }



    /*  public function countMembersInTeam($teamId)
    {
        $teamMmebers = $this->db->query("SELECT * FROM team_member WHERE teamId = :teamId", ["teamId" => $teamId], "return");
        return count($teamMmebers);
    }*/


    public function removeTeam()
    {
        if (!empty($this->projectId["projectId"]) && !empty($this->projectId["teamId"])) {
            $projectId = $this->validation->sanitizeString($this->projectId["projectId"]);
            $teamId = $this->validation->sanitizeString($this->projectId["teamId"]);

            $this->db->query("UPDATE project SET teamId = :teamId WHERE projectId = :projectId", ["projectId" => $projectId, "teamId" => "noTeam"]);



            echo json_encode(["message" => "team successfully removed"]);
        }
    }
}
