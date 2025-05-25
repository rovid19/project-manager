<?php

namespace Controllers;

use Framework\Validation;

class TasksController
{
    private $db;
    private $validation;
    private $params;

    public function __construct($db, $params = "")
    {
        $this->db = $db;
        $this->validation = new Validation();
        $this->params = $params;
    }

    public function createNewTask()
    {
        $taskData = json_decode(file_get_contents("php://input"), true);


        if (
            isset($taskData['title'])
            && isset($taskData['assignee'])
            && isset($taskData['deadline'])
            && isset($taskData['projectId'])
        ) {
            $title = $this->validation->sanitizeString($taskData['title']);
            $description = $this->validation->sanitizeString($taskData['description']);
            $assignee = $this->validation->sanitizeString($taskData['assignee']);
            $deadline = htmlspecialchars(trim($taskData['deadline']), ENT_QUOTES, 'UTF-8');
            $projectId = $this->validation->sanitizeString($taskData['projectId']);
            $taskId = uniqid(true);

            // find a team assigned to this project and get its teamId 
            $project = $this->db->query("SELECT teamId FROM project WHERE projectId = :projectId", ["projectId" => $projectId], "return");

            $sql = "INSERT INTO task (taskId, title, description,deadline, assignee, projectId, teamId, isCompleted) VALUES(:taskId, :title, :description, :deadline, :assignee, :projectId, :teamId, :isCompleted)";
            $this->db->query($sql, [
                "taskId" => $taskId,
                "title" => $title,
                "description" => $description,
                "deadline" => $deadline,
                "assignee" => $assignee,
                "projectId" => $projectId,
                "teamId" => $project[0]["teamId"],
                "isCompleted" => 0
            ]);

            http_response_code(201);
            echo json_encode(["message" => "Task created successfully", "taskId" => $taskId]);
        } else {
            http_response_code(404);
            echo json_encode(["error" => "Task data not valid"]);
            return;
        }
    }

    public function handleRemoveTask()
    {
        $requestData = json_decode(file_get_contents("php://input"), true);

        if (isset($requestData)) {
            $taskId = $this->validation->sanitizeString($requestData);

            $this->db->query("DELETE FROM task WHERE taskId = :taskId", ["taskId" => $taskId]);
            echo json_encode("task has been deleted");
            exit();
        } else {
            echo json_encode("taskId isnt set correctly");
            exit();
        }
    }


    public function getAllUserTasks()
    {
        session_start();

        $userId = $_SESSION["user-id"];

        if (!empty($userId)) {

            $taskArrayWithProjectName = [];

            $allTasks = $this->db->query("SELECT * FROM task WHERE assignee = :assignee", ["assignee" => $userId], "return");

            foreach ($allTasks as $task) {
                $project = $this->db->query("SELECT * FROM project WHERE projectId = :projectId", ["projectId" => $task["projectId"]], "return");
                $task['projectName'] = $project[0]["title"];
                $taskArrayWithProjectName[] = $task;
            }


            echo json_encode($taskArrayWithProjectName);
        }
    }

    public function markTaskAsComplete()
    {
        $requestData = json_decode(file_get_contents("php://input"), true);

        if (isset($requestData["taskId"]) && isset($requestData["taskStatus"])) {
            $taskId = $this->validation->sanitizeString($requestData["taskId"]);
            $taskStatus = $this->validation->sanitizeString($requestData["taskStatus"]);
            $isTask = $taskStatus === "complete" ? 1 : 0;

            $this->db->query("UPDATE task SET isCompleted = :isCompleted WHERE taskId = :taskId", ["taskId" => $taskId, "isCompleted" => $isTask]);
            echo json_encode("task has been marked as complete");
            exit();
        } else {
            echo json_encode("taskId isnt set correctly");
            exit();
        }
    }
}
