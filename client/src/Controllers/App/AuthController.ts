import { createElement } from "../../Utils/Helpers";
import "../../Styles/Login.css";
import { router } from "../../main";

import { store } from "../../Store/Store";
import { AuthService } from "../../Services/AuthService";
import { userStore } from "../../Store/UserStore";

export class AuthController {
  isRegister: boolean = false;
  loginContainer: HTMLElement | null = null;
  form: HTMLElement | null = null;
  formEventListener: any = null;

  constructor() {}

  removeSidebar() {
    const sidebar = document.querySelector(".sidebar");
    const mainSection = document.querySelector(".main-section");

    if (sidebar) {
      sidebar.remove();
      mainSection?.remove();

      store.setState({ mainSection: null });
    }
  }

  checkIfLoginOrRegister() {
    if (window.location.pathname.slice(1) === "register") {
      this.isRegister = true;
    }
  }

  createAuth() {
    this.removeSidebar();
    const divApp = document.querySelector("#app");

    const loginDiv = createElement({
      tag: "div",
      className: "login-container-main",
    });
    this.loginContainer = loginDiv;

    const loginContainer = createElement({
      tag: "div",
      className: "login-container",
      children: [
        createElement({
          tag: "h1",
          className: "login-title",
          innerText: "Login",
        }),
        createElement({
          tag: "p",
          className: "login-subtitle",
          innerText: "Login to your account",
        }),
        /* createElement({
          tag: "div",
          className: "back-btn",
          innerHTML: backButton,
          onClick: (e: Event) => {
            e.preventDefault();
            history.back();
          },
        }),*/
        this.checkIfLoginOrRegister(),
        this.createAuthForm(),
      ],
    });

    // ako je signin prilagodi text sign in controlleru
    if (this.isRegister) {
      loginContainer.children[0].innerText = "Register";
      loginContainer.children[1].innerText = "Create your account";
    }

    this.formEventDelegation();
    divApp?.appendChild(loginDiv);
    loginDiv.appendChild(loginContainer);
  }

  private createAuthForm() {
    const elements = createElement({
      tag: "form",
      className: "login-form",
      children: [
        this.createRegisterForm(),
        createElement({
          tag: "input",
          name: "username",
          className: "login-input",
          type: "text",
          placeholder: "Enter your username",
        }),
        createElement({
          tag: "input",
          name: "password",
          className: "login-input",
          type: "password",
          placeholder: "Enter your password",
        }),
        createElement({
          tag: "a",
          className: "forgot-password",
          href: "#",
          innerText: "Forget your password?",
        }),
        createElement({
          tag: "button",
          className: "login-button",
          type: "submit",
          innerText: "Log In",
          onClick: (e: Event) => {
            e.preventDefault();
            if (this.isRegister) {
              const apiCall = new AuthService(
                "http://localhost:3000/register-user"
              );
              apiCall.registerUser();
            } else {
              const apiCall = new AuthService(
                "http://localhost:3000/login-user"
              );
              apiCall.loginUser();
            }
          },
        }),
        createElement({
          tag: "div",
          className: "signup-prompt",
          children: [
            createElement({
              tag: "span",
              innerText: "Need to create an account?",
            }),
            createElement({
              tag: "a",
              href: "#",
              innerText: "Sign Up",
              onClick: (e: Event) => {
                e.preventDefault();
                if (!this.isRegister) {
                  history.pushState({}, "", `/register`);
                } else {
                  history.pushState({}, "", `/login`);
                }
                router.route("register");
              },
            }),
          ],
        }),
      ],
    });

    // ako je signin onda prilagodi text singin controlleru
    if (this.isRegister) {
      elements.children[3].remove();
      elements.children[3].innerText = "Sign In";
      elements.children[4].children[0].innerText = "Already have an account?";
      elements.children[4].children[1].innerText = "Login?";
    }

    this.form = elements;

    return elements;
  }

  private formEventDelegation() {
    (this.form as HTMLElement).addEventListener("change", eventListener);

    function eventListener(e: Event) {
      const target = e.target as HTMLInputElement;

      if (target.matches("input, textarea, select")) {
        switch (target.name) {
          case "username":
            userStore.setState({ username: target.value });
            break;
          case "email":
            userStore.setState({ email: target.value });
            break;
          case "password":
            userStore.setState({ password: target.value });
            break;
        }
      }
    }

    this.formEventListener = eventListener;
  }

  private createRegisterForm() {
    if (this.isRegister) {
      return createElement({
        tag: "input",
        name: "email",
        className: "login-input",
        type: "text",
        placeholder: "Enter your email",
      });
    }
  }

  delete() {
    this.loginContainer?.remove();
    this.form?.removeEventListener("change", this.formEventListener);
  }
}
