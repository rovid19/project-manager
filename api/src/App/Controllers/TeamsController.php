<?php


namespace Controllers;

use Framework\Validation;


class TeamsController
{
    private $db;
    private $validation;
    private $teamId;
    public function __construct($db, $teamId = "")
    {
        $this->db = $db;
        $this->validation = new Validation();
        $this->teamId = $teamId;
    }


    public function getAllUserTeams()
    {
        session_start();

        if (isset($_SESSION['user-id'])) {
            $userId = $_SESSION['user-id'];

            $teams = $this->db->query("
            SELECT t.*,
            ut.isAdmin
            FROM teams AS t
            JOIN user_teams AS ut ON ut.teamId = t.teamId
            WHERE ut.userId = :userId
            ", ["userId" => $userId], "return");


            echo json_encode($teams);
        } else {
            echo json_encode("user isnt logged in");
        }
    }


    public function handleCreateTeam()
    {
        $userId = $this->validation->isUserLoggedIn();
        $requestData = json_decode(file_get_contents("php://input"), true);


        if (!empty($requestData['teamName']) && !empty($requestData['selectedMembers'])) {
            $teamName = $this->validation->sanitizeString($requestData['teamName']);
            $teamDescription = "";
            if ($requestData['teamDescription']) $teamDescription = $this->validation->sanitizeString($requestData['teamDescription']);
            $teamId = uniqid("", true);
            $teamMembers = "";
            $memberArray = [];

            foreach ($requestData['selectedMembers'] as $member) {
                $sanitizedMember = $this->validation->sanitizeArray($member);
                $memberArray[] = $sanitizedMember;
                $teamMembers .= $sanitizedMember["userId"] . ",";
            }

            $this->db->query("INSERT INTO teams (teamId, teamName, teamDescription, teamMembers) VALUES (:teamId, :teamName, :teamDescription, :teamMembers)", [
                "teamId" => $teamId,
                "teamName" => $teamName,
                "teamDescription" => $teamDescription,
                "teamMembers" => $teamMembers
            ]);


            for ($i = 0; $i < count($memberArray); $i++) {
                $userTeamId = uniqid("", true);
                $this->db->query("INSERT INTO user_teams (userTeamsId, teamId, userId, isAdmin) VALUES (:userTeamsId, :teamId, :userId, :isAdmin)", [
                    "userTeamsId" => $userTeamId,
                    "teamId" => $teamId,
                    "userId" => $memberArray[$i]['userId'],
                    "isAdmin" => $memberArray[$i]['isAdmin'] ? 1 : 0
                ]);
            }

            echo json_encode("done successfully");
            exit();
        } else {
            http_response_code(400);
            echo json_encode("teamName or selectedMembers werent set properly");
            exit();
        }
    }

    public function fetchAllTeamMembers($returnCondition = "")
    {
        if (!empty($this->teamId)) {
            $teamId = $this->validation->sanitizeString($this->teamId['teamId']);

            $teamMembers = $this->db->query("
            SELECT
            ut.isAdmin,
            u.username,
            u.email,
            u.userId
            FROM user_teams AS ut
            JOIN users AS u 
            ON ut.userId = u.userId
            WHERE ut.teamId = :teamId
            ", ["teamId" => $teamId], "return");

            if ($returnCondition === "return") {
                return $teamMembers;
            } else {
                echo json_encode($teamMembers);
            }
        }
    }

    public function fetchSpecificTeam()
    {
        if (!empty($this->teamId["teamId"])) {
            $teamId = $this->validation->sanitizeString($this->teamId["teamId"]);

            $team = $this->db->query("SELECT * FROM teams WHERE teamId = :teamId", ["teamId" => $teamId], "return");
            $teamMembers = $this->fetchAllTeamMembers("return");

            echo json_encode(["team" => $team, "teamMembers" => $teamMembers]);
        } else {
            echo json_encode("teeamId is missing");
            exit();
        }
    }

    public function fetchAllTeamProjects($teamId) {}


    public function saveTeamDetails()
    {
        $requestData = json_decode(file_get_contents("php://input"), true);

        if (!empty($requestData["teamName"]) || !empty($requestData["teamDescription"])) {
            $teamName = $this->validation->sanitizeString(($requestData["teamName"]));
            $teamDescription = $this->validation->sanitizeString($requestData["teamDescription"]);
            $teamId = $this->validation->sanitizeString($this->teamId["teamId"]);

            $this->db->query(
                "UPDATE teams 
                SET teamName = :teamName, 
                teamDescription = :teamDescription 
                WHERE teamId = :teamId",
                [
                    "teamName" => $teamName,
                    "teamDescription" => $teamDescription,
                    "teamId" => $teamId
                ]
            );

            echo json_encode(["message" => "successfully updated"]);
        } else {
            echo json_encode("you have to edit atleast one of the fields to save new team details");
        }
    }

    public function deleteTeam()
    {
        if (!empty($this->teamId["teamId"])) {
            $teamId = $this->validation->sanitizeString(($this->teamId["teamId"]));

            $this->db->query("DELETE FROM teams WHERE teamId = :teamId", ["teamId" => $teamId]);

            echo json_encode(["message" => "team successfully deleted"]);
        } else {
            echo json_encode(["message" => "teamId is missing"]);
        }
    }

    public function addTeamMember()
    {
        $requestData = json_decode(file_get_contents("php://input"), true);

        if (!empty($requestData["selectedMember"] && !empty($this->teamId['teamId']))) {
            $teamId = $this->validation->sanitizeString($this->teamId['teamId']);
            $userId = $this->validation->sanitizeString($requestData["selectedMember"]);
            $userTeamId = uniqid("", true);
            $this->addMemberToTeamMemberArray($teamId);

            $this->db->query("INSERT INTO user_teams (userTeamsId, teamId, userId, isAdmin) VALUES (:userTeamsId, :teamId, :userId, :isAdmin)", [
                "userTeamsId" => $userTeamId,
                "teamId" => $teamId,
                "userId" => $userId,
                "isAdmin" => 0
            ]);

            echo json_encode(["message" => "team member added successfully!"]);
        }
    }

    public function addAdmin()
    {
        $requestData = json_decode(file_get_contents("php://input"), true);

        if (!empty($requestData) && !empty($this->teamId["teamId"])) {
            $userId = $this->validation->sanitizeString($requestData);
            $teamId = $this->validation->sanitizeString($this->teamId["teamId"]);

            $this->db->query("UPDATE user_teams SET isAdmin  = :isAdmin WHERE userId = :userId AND teamId = :teamId ", [
                'isAdmin' => 1,
                'userId' => $userId,
                "teamId" => $teamId
            ]);


            echo json_encode(["message" => "user is now admin"]);
        }
    }

    public function removeMember()
    {
        if (!empty($this->teamId["teamId"]) && !empty($this->teamId["userId"])) {
            $teamId = $this->validation->sanitizeString($this->teamId["teamId"]);
            $userId = $this->validation->sanitizeString($this->teamId["userId"]);
            $this->removeMemberFromTeamMemberArray(($teamId));

            $this->db->query("DELETE FROM user_teams WHERE teamId = :teamId AND userId = :userId", ["teamId" => $teamId, "userId" => $userId]);

            json_encode(["message" => "member successfully removed"]);
        }
    }

    public function removeMemberFromTeamMemberArray($teamId)
    {
        $team = $this->db->query("SELECT
        t.teamMembers
        FROM teams as T 
        WHERE teamId = :teamId", ["teamId" => $teamId], "return");


        $teamMembers = implode(",", array_slice(explode(",", $team[0]['teamMembers']), 1));
        inspect($teamMembers);
        $this->db->query("UPDATE teams SET teamMembers = :teamMembers WHERE teamId = :teamId", ["teamMembers" => $teamMembers, "teamId" => $teamId]);
    }

    public function addMemberToTeamMemberArray($teamId)
    {
        $team = $this->db->query("SELECT
        t.teamMembers
        FROM teams as T 
        WHERE teamId = :teamId", ["teamId" => $teamId], "return");

        $teamMembers = $team[0]["teamMembers"] . ",1";


        $this->db->query("UPDATE teams SET teamMembers = :teamMembers WHERE teamId = :teamId", ["teamMembers" => $teamMembers, "teamId" => $teamId]);
    }
}
