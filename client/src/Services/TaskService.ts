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
    console.log(taskData);
    await this.post(taskData);
  }

  async getAllTasks() {
    return await this.get();
  }

  async markTaskAsComplete(taskId: string, taskStatus: string) {
    return await this.put({ taskId, taskStatus });
  }
}
