import { createElement } from "../../../Utils/Helpers";
import { TeamView } from "./TeamView";

export class TeamMembersManager extends TeamView {
  handleManagerClassReset: () => Promise<void>;

  constructor(
    innerSection: HTMLElement,
    handleManagerClassReset: () => Promise<void>,
    teamId: string
  ) {
    super();
    this.innerSection = innerSection;
    this.renderTeamMembersSection();
    this.handleManagerClassReset = handleManagerClassReset;
    this.teamId = teamId;
  }

  //UI RENDER------------------------------------------------------
  renderTeamMembersSection() {
    const teamMembersSection = createElement({
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
              //onClick: () => this.openAddMembersPopup(),
            }),
          ],
        }),
        createElement({
          tag: "div",
          className: "members-list",
          children: this.renderTeamMembers(),
        }),
      ],
    });

    this.innerSection?.appendChild(teamMembersSection);
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
              member.isAdmin
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
              !member.isAdmin
                ? createElement({
                    tag: "button",
                    className: "make-admin-btn",
                    text: "Make Admin",
                    //onClick: () => this.makeAdmin(member.userId),
                  })
                : null,
              createElement({
                tag: "button",
                className: "remove-member-btn",
                text: "Remove",
                //onClick: () => this.removeMember(member.userId),
              }),
            ],
          }),
        ],
      })
    );
  }

  //CORE LOGIC-----------------------------------------------------

  //API CALLS------------------------------------------------------

  //LISTENERS------------------------------------------------------
}
