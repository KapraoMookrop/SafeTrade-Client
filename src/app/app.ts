import { Component, HostListener, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from "@angular/router";
import { Navbar } from './component/navbar/navber';
import { AppStateService } from './core/AppStateService';

@Component({
  selector: 'app-root',
  imports: [FormsModule, Navbar, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})

export class App {
  constructor(public stateService: AppStateService) { }

  ngAfterViewInit() {
    this.waitAndUpdate();
  }

  waitAndUpdate() {
    requestAnimationFrame(() => {
      setTimeout(() => {
        this.updateContentPadding();
      });
    });
  }

  @HostListener('window:resize')
  onResize() {
    this.waitAndUpdate();
  }

  updateContentPadding() {
    const nav = document.querySelector('app-navbar nav') as HTMLElement;
    const content = document.querySelector('.main-content') as HTMLElement;

    if (nav && content) {
      content.style.paddingTop = `${nav.offsetHeight}px`;
    }
  }

}