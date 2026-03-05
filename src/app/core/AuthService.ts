import { Injectable } from "@angular/core";
import { AppStateService } from "./AppStateService";
import { UserClientData } from "../types/UserClientData";

@Injectable({ providedIn: 'root' })
export class AuthService {

  constructor(private state: AppStateService) {}

  login(token: string, user: UserClientData) {
    this.state.token.set(token);
    this.state.user.set(user);
  }

  logout() {
    this.state.token.set(null);
    this.state.user.set(null);
  }
}