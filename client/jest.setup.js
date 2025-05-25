global.fetch = (input, init) => {
  console.log("🚨 FETCH CALLED WITH:", input);

  if (typeof input === "string" && input.includes("get-user")) {
    return Promise.resolve({
      ok: true,
      json: async () => ({
        username: "testuser",
        email: "test@example.com",
        teams: [],
        projects: [],
        userId: "user-1",
        allTeams: [],
      }),
    });
  }

  if (typeof input === "string" && input.includes("get-all-user-projects")) {
    return Promise.resolve({
      ok: true,
      json: async () => [],
    });
  }

  if (typeof input === "string" && input.includes("get-all-users")) {
    return Promise.resolve({
      ok: true,
      json: async () => [],
    });
  }

  if (typeof input === "string" && input.includes("get-all-tasks")) {
    return Promise.resolve({
      ok: true,
      json: async () => [],
    });
  }

  if (
    typeof input === "string" &&
    input.includes("/user/") &&
    input.includes("/get/teams")
  ) {
    return Promise.resolve({
      ok: true,
      json: async () => ({
        allTeams: [], // ✅ Required by getUserData()
      }),
    });
  }
  if (typeof input === "string" && input.includes("get-all-user-teams")) {
    return Promise.resolve({
      ok: true,
      json: async () => [],
    });
  }

  console.warn("⚠️ No fetch mock matched:", input);
  return Promise.resolve({
    ok: true,
    json: async () => ({}),
  });
};
