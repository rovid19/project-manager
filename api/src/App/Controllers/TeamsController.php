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

            $this->db->query("INSERT INTO teams (teamId, teamName, teamDescription) VALUES (:teamId, :teamName, :teamDescription)", [
                "teamId" => $teamId,
                "teamName" => $teamName,
                "teamDescription" => $teamDescription
            ]);

            foreach ($requestData['selectedMembers'] as $member) {
                $memberArray = $this->validation->sanitizeArray($member);
                $userTeamId = uniqid("", true);
                $this->db->query("INSERT INTO user_teams (userTeamsId,teamId,userId, isAdmin) VALUES (:userTeamsId, :teamId, :userId, :isAdmin)", [
                    "userTeamsId" => $userTeamId,
                    "teamId" => $teamId,
                    "userId" => $memberArray['userId'],
                    "isAdmin" => $memberArray['isAdmin'] ? 1 : 0
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

    public function fetchAllTeamMembers()
    {
        if (!empty($this->teamId)) {
            $teamId = $this->validation->sanitizeString($this->teamId);

            $teamMembers = $this->db->query("
            SELECT ut.,
            ut.isAdmin
            u.username,
            u.email,
            u.userId
            FROM user_teams AS ut
            JOIN users AS u 
            ON ut.userId = u.userId
            WHERE ut.teamId = :teamId
            ", ["teamId" => $teamId], "return");

            echo json_encode($teamMembers);
        }
    }
}
