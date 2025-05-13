import { BaseApi } from "./BaseService";

type TaskData = {
  title: string;
  description: string;
  deadline: Date;
  assignee: string;
  projectId: string;
};

export class TaskService extends BaseApi {
  async handleTaskCreation(taskData: TaskData) {
    await this.post(taskData);
  }

  async getAllTasks() {
    return await this.get();
  }
}
