import { createElement } from "../../../Utils/Helpers";
import "../../../Styles/SharedStylings/UpperInnerSection.css";
import "../../../Styles/SharedStylings/SectionHeader.css";
import "../../../Styles/Team.css";
import { store } from "../../../Store/Store";
import { TeamMember } from "../../../Types/TeamsTypes";

export class TeamView {
  teamMembers: TeamMember[] = [];
  teamName: string = "";
  teamDescription: string = "";
  teamId: string = "";

  constructor() {}

  //UI RENDER------------------------------------------------------
  delete() {
    document.querySelector(".upper-section")?.remove();
  }

  renderTeam() {
    const teamPage = createElement({
      tag: "div",
      className: "upper-section",
      children: [
        createElement({
          tag: "section",
          className: "inner-section",
          children: [
            createElement({
              tag: "div",
              className: "section-header",
              children: [
                createElement({
                  tag: "h3",
                  className: "section-title",
                  text: "Teams",
                }),
                createElement({
                  tag: "button",
                  className: "delete-team-btn",
                  text: "Delete",
                  // onClick: () => this.handleCreateTeamPopup(),
                }),
              ],
            }),
            // Adding team management layout
            createElement({
              tag: "div",
              className: "team-management-container",
              children: [
                // Left side - Team settings
                createElement({
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
                              value: this.teamName,
                              onChange: (e: Event) => this.handleNameChange(e),
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
                              onChange: (e: Event) =>
                                this.handleDescriptionChange(e),
                            }),
                          ],
                        }),
                        createElement({
                          tag: "button",
                          className: "save-team-info-btn",
                          text: "Save Changes",
                          onClick: () => this.saveTeamInfo(),
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
                }),
                // Right side - Member management
                createElement({
                  tag: "div",
                  className: "team-members-section",
                  children: [
                    createElement({
                      tag: "div",
                      className: "members-header",
                      children: [
                        createElement({
                          tag: "h4",
                          className: "team-section-title",
                          text: "Team Members",
                        }),
                        createElement({
                          tag: "button",
                          className: "add-member-btn",
                          text: "Add Members",
                          onClick: () => this.openAddMembersPopup(),
                        }),
                      ],
                    }),
                    createElement({
                      tag: "div",
                      className: "members-list",
                      children: this.renderTeamMembers(),
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ],
    });
    store.getState().mainSection.appendChild(teamPage);
  }

  //CORE LOGIC-----------------------------------------------------

  private handleNameChange(e: Event) {
    this.teamName = (e.target as HTMLInputElement).value;
  }

  private handleDescriptionChange(e: Event) {
    this.teamDescription = (e.target as HTMLTextAreaElement).value;
  }

  private saveTeamInfo() {
    console.log("Saving team info:", this.teamName, this.teamDescription);
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

  private renderTeamMembers() {
    if (this.teamMembers.length === 0) {
      return [
        createElement({
          tag: "div",
          className: "no-members",
          text: "No members in this team yet.",
        }),
      ];
    }

    return this.teamMembers.map((member) =>
      createElement({
        tag: "div",
        className: "member-item",
        children: [
          createElement({
            tag: "div",
            className: "member-info",
            children: [
              createElement({
                tag: "span",
                className: "member-name",
                text: member.username,
              }),
              createElement({
                tag: "span",
                className: "member-email",
                text: member.email,
              }),
              member.isAdming
                ? createElement({
                    tag: "span",
                    className: "admin-badge",
                    text: "Admin",
                  })
                : null,
            ],
          }),
          createElement({
            tag: "div",
            className: "member-actions",
            children: [
              !member.isAdming
                ? createElement({
                    tag: "button",
                    className: "make-admin-btn",
                    text: "Make Admin",
                    onClick: () => this.makeAdmin(member.userId),
                  })
                : null,
              createElement({
                tag: "button",
                className: "remove-member-btn",
                text: "Remove",
                onClick: () => this.removeMember(member.userId),
              }),
            ],
          }),
        ],
      })
    );
  }

  private makeAdmin(userId: string) {
    console.log("Making user admin:", userId);
    // Implement API call to make user admin
  }

  private removeMember(userId: string) {
    console.log("Removing member:", userId);
    // Implement API call to remove member
  }

  private openAddMembersPopup() {
    console.log("Opening add members popup");
    // Implement popup to add members
  }
}
