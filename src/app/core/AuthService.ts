import { Injectable } from "@angular/core";
import { AppStateService } from "./AppStateService";

@Injectable({ providedIn: 'root' })
export class AuthService {

  constructor(private state: AppStateService) {}

  login(response: { token: string; user: any }) {
    this.state.token.set(response.token);
    this.state.user.set(response.user);
  }

  logout() {
    this.state.token.set(null);
    this.state.user.set(null);
  }
}