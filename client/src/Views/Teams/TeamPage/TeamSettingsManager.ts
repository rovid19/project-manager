import { TeamsService } from "../../../Services/TeamsService";
import { createElement } from "../../../Utils/Helpers";
import { TeamView } from "./TeamView";

export class TeamSettingsManager extends TeamView {
  teamForm: HTMLElement | null = null;
  handleManagerClassReset: () => Promise<void>;

  constructor(
    innerSection: HTMLElement,
    handleManagerClassReset: () => Promise<void>,
    teamId: string
  ) {
    super();
    this.innerSection = innerSection;
    this.renderTeamSettingsSection();
    this.handleManagerClassReset = handleManagerClassReset;
    this.teamId = teamId;
  }

  //UI RENDER------------------------------------------------------
  renderTeamSettingsSection() {
    const teamSettingsSection = createElement({
      tag: "div",
      className: "team-settings-section",
      children: [
        createElement({
          tag: "h4",
          className: "team-section-title",
          text: "Team Settings",
        }),
        createElement({
          tag: "div",
          className: "team-info-form",
          children: [
            createElement({
              tag: "div",
              className: "team-field-group",
              children: [
                createElement({
                  tag: "label",
                  text: "Team Name",
                }),
                createElement({
                  tag: "input",
                  className: "team-name-input",
                  type: "text",
                  name: "team-name",
                  value: this.teamName,
                  placeholder: this.teamName,
                }),
              ],
            }),
            createElement({
              tag: "div",
              className: "team-field-group",
              children: [
                createElement({
                  tag: "label",
                  text: "Team Description",
                }),
                createElement({
                  tag: "textarea",
                  className: "team-description-input",
                  value: this.teamDescription,
                  placeholder: this.teamDescription,
                  name: "team-description",
                }),
              ],
            }),
            createElement({
              tag: "button",
              className: "save-team-info-btn",
              text: "Save Changes",
              onClick: () => this.submitTeamDetails(),
            }),
          ],
        }),
        createElement({
          tag: "div",
          className: "team-projects-section",
          children: [
            createElement({
              tag: "h4",
              className: "team-section-title",
              text: "Team Projects",
            }),
            createElement({
              tag: "div",
              className: "team-projects-list",
              children: this.renderTeamProjects(),
            }),
          ],
        }),
      ],
    });

    this.innerSection?.appendChild(teamSettingsSection);
    this.teamForm = teamSettingsSection.children[1];

    this.setupTeamFormEventDelegation();
  }

  private renderTeamProjects() {
    // Mock projects for now
    const mockProjects = [
      { id: "1", name: "Website Redesign" },
      { id: "2", name: "Mobile App Development" },
    ];

    return mockProjects.map((project) =>
      createElement({
        tag: "div",
        className: "team-project-item",
        children: [
          createElement({
            tag: "span",
            className: "project-name",
            text: project.name,
          }),
          createElement({
            tag: "a",
            className: "view-project-link",
            text: "View",
            href: `#/projects/${project.id}`,
          }),
        ],
      })
    );
  }

  //CORE LOGIC-----------------------------------------------------

  //API CALLS------------------------------------------------------
  async submitTeamDetails() {
    await new TeamsService(
      `http://localhost:3000/team/${this.teamId}`
    ).updateTeamDetails({
      teamName: this.teamName,
      teamDescription: this.teamDescription,
    });

    this.handleManagerClassReset();
  }

  //LISTENERS------------------------------------------------------
  setupTeamFormEventDelegation() {
    this.teamForm?.addEventListener("change", (e: Event) => {
      const target = e.target as HTMLInputElement;

      if (target.matches("input, textarea")) {
        if (target.name === "team-name") this.teamName = target.value;
        else this.teamDescription = target.value;
      }
    });
  }
}
