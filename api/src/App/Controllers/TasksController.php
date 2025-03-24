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
            $deadline = $this->validation->validateDate($taskData['deadline']);
            $projectId = $this->validation->sanitizeString($taskData['projectId']);


            if (empty($title)) {
                http_response_code(400);
                echo json_encode(["message" => "title field cannot be empty"]);
                return;
            }

            /*if (!$assignee) {
                http_response_code(400);
                echo json_encode(["message" => "email isnt valid"]);
                return;
            }*/

            if (!$deadline) {
                http_response_code(400);
                echo json_encode(["message" => "data isnt valid"]);
                return;
            }

            if (!$this->validation->validateUniqueId($projectId)) {
                http_response_code(400);
                echo json_encode(["error" => "Invalid project ID"]);
                return;
            }


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
}
