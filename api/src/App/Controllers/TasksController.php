<?php

namespace Controllers;

use Framework\Validation;

class TasksController
{
    private $db;
    private $validation;

    public function __construct($db)
    {
        $this->db = $db;
        $this->validation = new Validation();
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
            // sanitize data
            $title = $this->validation->sanitizeString($taskData['title']);
            $description = $this->validation->sanitizeString($taskData['description']);
            //$assignee = $this->validation->validateEmail($this->validation->sanitizeString($taskData['assignee']));
            $assignee = $this->validation->sanitizeString($taskData['assignee']);
            $deadline = htmlspecialchars(trim($taskData['deadline']), ENT_QUOTES, 'UTF-8');
            $projectId = $this->validation->sanitizeString($taskData['projectId']);


            $taskId = uniqid(true);
            $sql = "INSERT INTO task (taskId, title, description,deadline, assignee, projectId) VALUES(:taskId, :title, :description, :deadline, :assignee, :projectId)";
            $this->db->query($sql, [
                "taskId" => $taskId,
                "title" => $title,
                "description" => $description,
                "deadline" => $deadline,
                "assignee" => $assignee,
                "projectId" => $projectId
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
}
