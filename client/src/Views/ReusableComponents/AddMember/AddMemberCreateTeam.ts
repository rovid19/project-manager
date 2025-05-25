import { User } from "../../../Types/ProjectsTypes";
import { SelectedMember } from "../../Teams/CreateNewTeamPopup";

export class AddMemberCreateTeamPopup {
  popupElement: HTMLElement;
  selectedMembers: SelectedMember[] = [];
  allMembers: string[] = [];
  setSelectedMembers: (selectedMembers: SelectedMember[]) => void;

  constructor(
    popupElement: HTMLElement,
    setSelectedMembers: (selectedMembers: SelectedMember[]) => void
  ) {
    this.popupElement = popupElement;
    this.setSelectedMembers = setSelectedMembers;
    this.setEventListenerForEveryMember();
    this.setMemberListHeight();
    this.popupElement.style.height = "300px";
    this.popupElement.style.overflow = "scroll";
  }

  //CORE LOGIC------------------------------------------------------
  setMemberListHeight = () => {
    const memberList = document.querySelector(".member-list") as HTMLElement;
  };
  handleSetAllMembers = (userArray: User[]) => {
    userArray.forEach((user) => this.allMembers.push(user.userId));
  };

  handleSelectMember = (e: Event) => {
    const target = e.target as HTMLElement;
    const memberElement = target.closest(".member-item") as HTMLElement;
    const userId = (target.closest(".member-item") as HTMLElement).dataset
      .projectId as string;

    if (this.selectedMembers.some((member) => member.userId === userId)) {
      //remove border from selected member element
      const index = this.selectedMembers.findIndex(
        (member) => member.userId === userId
      );
      this.addOrRemoveBorderFromSelectedMember(
        this.selectedMembers[index].element as HTMLElement,
        "remove"
      );

      //remove member from selectedMembers
      this.selectedMembers = this.selectedMembers.filter(
        (member) => member.userId !== userId
      );
    } else {
      //add member to selectedMembers
      this.selectedMembers.push({
        element: memberElement,
        userId: userId,
        isAdmin: false,
      });

      //add border to selected member element
      const index = this.selectedMembers.findIndex(
        (member) => member.userId === userId
      );
      this.addOrRemoveBorderFromSelectedMember(
        this.selectedMembers[index].element as HTMLElement,
        "add"
      );
    }

    this.setSelectedMembers(this.selectedMembers);
  };

  addOrRemoveBorderFromSelectedMember(
    memberElement: HTMLElement,
    action: string
  ) {
    if (action === "add") memberElement.style.border = "2px solid #7c5cff";
    else memberElement.style.border = "";
  }

  //LISTENERS------------------------------------------------------
  setEventListenerForEveryMember() {
    setTimeout(() => {
      document.querySelectorAll(".member-item").forEach((member) => {
        (member as HTMLElement).onclick = this.handleSelectMember;
      });
    }, 100);
  }
}
