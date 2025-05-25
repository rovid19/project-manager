import { TeamsView } from "../Views/Teams/TeamsView";
import { TeamsService } from "../Services/TeamsService";
import { store } from "../Store/Store";
import { userStore } from "../Store/UserStore";
import { CreateNewTeamPopup } from "../Views/Teams/CreateNewTeamPopup";

// 👇 Adjust these as needed
jest.mock("../Services/TeamsService");

describe("Team Creation Integration", () => {
  let view: TeamsView;
  let createNewTeamPopup: CreateNewTeamPopup;

  beforeEach(async () => {
    // Mock user ID for team creator
    userStore.getState = () => ({ userId: "user-1" });

    // Reset DOM to match app structure
    document.body.innerHTML = `
      <div id="app">
        <aside class="sidebar"></aside>
        <section class="mainSection"></section>
      </div>
    `;

    // Set correct mainSection in store
    store.setState({
      mainSection: document.querySelector(".mainSection") as HTMLElement,
    });
    store.setState({
      mainDivApp: document.getElementById("app") as HTMLElement,
    });

    // Setup mock for initial team fetch (empty at first)
    (TeamsService.prototype.getAllTeams as jest.Mock).mockResolvedValueOnce([]);

    // Render the Teams view
    view = new TeamsView();
    await view.renderTeams();

    // Render the Create New Team Popup
    new CreateNewTeamPopup(view.renderTeamCards, view.fetchAllTeams);
  });

  test("creates a new team and displays it", async () => {
    // Click the "Create New Team" button
    const openPopupBtn = document.querySelector(".create-team-btn")!;
    openPopupBtn.dispatchEvent(new Event("click", { bubbles: true }));

    // Fill in form fields
    const nameInput = document.querySelector(
      ".team-name-input"
    ) as HTMLInputElement;
    const descInput = document.querySelector(
      ".team-description-input"
    ) as HTMLTextAreaElement;
    nameInput.value = "My New Team";
    descInput.value = "Team for testing";

    // triggers change event on input
    nameInput.dispatchEvent(new Event("change", { bubbles: true }));
    descInput.dispatchEvent(new Event("change", { bubbles: true }));

    // Setup mock for team creation call
    (TeamsService.prototype.createTeam as jest.Mock).mockResolvedValueOnce(
      undefined
    );

    // Setup mock for refetching teams after creation
    (TeamsService.prototype.getAllTeams as jest.Mock).mockResolvedValueOnce([
      {
        teamId: "team-1",
        teamName: "My New Team",
        teamDescription: "Team for testing",
        isAdmin: true,
        teamMembers: "[]",
      },
    ]);

    // Click submit
    const submitBtn = document.querySelector(
      ".popup-content .create-team-btn"
    )!;

    // triggers click event on button
    submitBtn.dispatchEvent(new Event("click", { bubbles: true }));

    // Wait for async actions
    await new Promise((r) => setTimeout(r, 50));

    // Assert team card is rendered
    const newCard = document.querySelector(".team-card");
    expect(newCard).toBeTruthy();
    expect(newCard?.textContent).toContain("My New Team");
    expect(newCard?.textContent).toContain("Team for testing");

    // Optionally: check avatar initial
    const avatar = newCard?.querySelector(".team-avatar span")?.textContent;
    expect(avatar).toBe("M");
  });
});
