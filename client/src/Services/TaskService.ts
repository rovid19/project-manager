import { BaseApi } from "./ApiService";

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
}
