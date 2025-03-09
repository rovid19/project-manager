export class BaseApi {
  apiUrl: string = "http://localhost:3000";

  constructor(url: string) {
    this.apiUrl = url;
  }

  async get() {
    try {
      const response = await fetch(this.apiUrl, {
        method: "GET",
        headers: { "Content-type": "application/json" },
        credentials: "include", // Ensures cookies (PHPSESSID) are sent
      });

      const result = await response.json();

      return result;
    } catch (error) {
      throw error;
    }
  }

  async post(data: any) {
    try {
      const response = await fetch(this.apiUrl, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        credentials: "include", // bez ovoga mi ne seta cookie session id
        body: JSON.stringify(data),
      });

      const result = await response.json();

      return result;
    } catch (error) {
      throw error;
    }
  }

  async put(data: any) {
    try {
      const token = localStorage.getItem("token");
      let headers: HeadersInit = {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      const response = await fetch(this.apiUrl, {
        method: "POST",
        headers,
        body: JSON.stringify(data),
      });

      console.log(response);
    } catch (error) {
      throw error;
    }
  }

  delete() {
    try {
    } catch (error) {
      throw error;
    }
  }
}
