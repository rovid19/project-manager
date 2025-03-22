<?php

namespace Controllers;

use Framework\Validation;

class TasksController
{
    private $db;
    private $validation;

    public function __construct($db)
    {
        $this->$db = $db;
        $this->validation = new Validation();
    }

    private function createNewTask()
    {
        $taskData = json_decode(file_get_contents("php://input"), true);


        if (isset($taskData['title']) && isset($taskData['asignee']) && isset($taskData['deadline'])) {
            // sanitize data
            $title = $this->validation->sanitizeString($taskData['title']);
            $description = $this->validation->sanitizeString($taskData['description']);
            $assignee = $this->validation->validateEmail($taskData['assignee']);
            $deadline = $this->validation->validateDate($taskData['deadline']);

            $title =
                $taskId = uniqid(true);
            $sql = "INSERT INTO task (taskId, title, description,deadline, assignee) VALUES(:taskId, :title, :description, :deadline, :assignee)";
            $this->db->query($sql, [
                "taskId" => $taskId,
                "title" => $title,
                "description" => $description,
                "deadline" => $deadline,
                "assignee" => $assignee
            ]);
        } else {
            http_response_code(404);
            echo json_encode(["error" => "Task data not valid"]);
            return;
        }
    }
}
