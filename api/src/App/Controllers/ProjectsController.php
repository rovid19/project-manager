<?php

class ProjectsController
{

    public function createNewProject()
    {
        $data = json_decode(file_get_contents("php://input"), true);
    }
}
