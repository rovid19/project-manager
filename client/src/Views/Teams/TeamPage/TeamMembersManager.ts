import { TeamsService } from "../../../Services/TeamsService.ts";
import { TeamMember } from "../../../Types/TeamsTypes.ts";
import { createElement, selectHtmlElement } from "../../../Utils/Helpers";
import { AddMemberContainer } from "../../ReusableComponents/AddMember/AddMemberContainer.ts";
import { TeamView } from "./TeamView";

export class TeamMembersManager extends TeamView {
  membersDiv: HTMLElement | null = null;
  addMemberPopup: AddMemberContainer | null = null;
  membersDivHeader: HTMLElement | null = null;
  selectedUserId: string = "";
  handleManagerClassReset: () => Promise<void>;

  constructor(
    innerSection: HTMLElement,
    handleManagerClassReset: () => Promise<void>,
    teamId: string,
    teamMembers: TeamMember[]
  ) {
    super();
    this.innerSection = innerSection;
    this.teamId = teamId;
    this.teamMembers = teamMembers;
    this.renderTeamMembersSection();
    this.handleManagerClassReset = handleManagerClassReset;
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
              onClick: () => this.switchBetweenAddMembersAndTeamMembers(),
            }),
          ],
        }),
        createElement({
          tag: "div",
          className: "members-list-div",
          children: this.renderTeamMembers(),
        }),
      ],
    });

    this.membersDiv = teamMembersSection.children[1];
    this.membersDivHeader = teamMembersSection.children[0];
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
        className: "member-item-team",
        data: member.userId,
        children: [
          createElement({
            tag: "div",
            className: "member-info-team",
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
            className: "member-actions-team",
            children: [
              !member.isAdmin
                ? createElement({
                    tag: "button",
                    className: "make-admin-btn-team",
                    text: "Make Admin",
                    onClick: async (e: Event) => {
                      e.preventDefault();
                      this.handleMakeAdmin(e);
                    },
                  })
                : null,
              createElement({
                tag: "button",
                className: "remove-member-btn-team",
                text: "Remove",
                onClick: (e: Event) => {
                  e.preventDefault();
                  this.handleRemoveMember(e);
                },
              }),
            ],
          }),
        ],
      })
    );
  }

  //CORE LOGIC-----------------------------------------------------
  switchBetweenAddMembersAndTeamMembers() {
    if (
      (this.membersDivHeader as HTMLElement).children[1].textContent ===
      "Team Members"
    )
      this.handleManagerClassReset();
    else this.renderAddMembersComponent();
  }

  renderAddMembersComponent() {
    this.removeTeamMembersComponent();
    this.changeMembersHeader();

    this.addMemberPopup = new AddMemberContainer(
      "",
      this.membersDiv as HTMLElement,
      this.teamId,
      "team",
      "",
      this.teamMembers.map((item) => item.userId),
      () => {},
      this.handleManagerClassReset,
      () => {},
      () => {}
    );
  }

  removeTeamMembersComponent() {
    document
      .querySelectorAll(".member-item-team")
      .forEach((item) => item.remove());
  }

  changeMembersHeader() {
    (this.membersDivHeader as HTMLElement).children[0].textContent =
      "Select New Members:";
    (this.membersDivHeader as HTMLElement).children[1].textContent =
      "Team Members";
  }

  getUserId(memberElement: HTMLElement) {
    this.selectedUserId = memberElement.dataset.projectId as string;
  }

  async handleMakeAdmin(e: Event) {
    const element = selectHtmlElement(e, ".member-item-team");
    this.getUserId(element);
    await this.submitMemberAsAdmin();
  }

  async handleRemoveMember(e: Event) {
    const element = selectHtmlElement(e, ".member-item-team");
    this.getUserId(element);
    await this.removeMemberFromTeam();
  }

  //API CALLS------------------------------------------------------
  async submitMemberAsAdmin() {
    await new TeamsService(
      `http://localhost:3000/team/${this.teamId}/add/admin`
    ).createNewAdmin(this.selectedUserId);

    this.handleManagerClassReset();
  }

  async removeMemberFromTeam() {
    await new TeamsService(
      `http://localhost:3000/team/${this.teamId}/remove/member/${this.selectedUserId}`
    ).removeMember();

    this.handleManagerClassReset();
  }

  //LISTENERS------------------------------------------------------
}
