import { Injectable, inject } from '@angular/core';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Component } from '@angular/core';
import { AppStateService } from './AppStateService';

@Component({
  template: `<div class="modal-loading">
              <div class="loader"></div>
            </div>`,
  standalone: true,
  styles: [`
    .modal-loading {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
      width: 100%;
    }
    .loader {
      width: 48px;
      height: 48px;
      border: 5px solid #FFF;
      border-bottom-color: #3b82f6;
      border-radius: 50%;
      display: inline-block;
      box-sizing: border-box;
      animation: rotation 1s linear infinite;
    }
    @keyframes rotation {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `]
})
export class GlobalLoaderComponent { }

@Injectable({ providedIn: 'root' })
export class LoadingService {
  private overlayRef: OverlayRef | null = null;
  private loadingCount = 0;
  private overlay = inject(Overlay);
  private appState = inject(AppStateService);

  show() {
    this.loadingCount++;
    if (this.loadingCount === 1) {
      this.appState.isLoading.set(true);
      this.createOverlay();
    }
  }

  hide() {
    if (this.loadingCount > 0) {
      this.loadingCount--;
    }
    
    if (this.loadingCount === 0) {
      this.appState.isLoading.set(false);
      this.destroyOverlay();
    }
  }

  reset() {
    this.loadingCount = 0;
    this.appState.isLoading.set(false);
    this.destroyOverlay();
  }

  private createOverlay() {
    if (!this.overlayRef) {
      this.overlayRef = this.overlay.create({
        hasBackdrop: true,
        backdropClass: 'cdk-overlay-dark-backdrop',
        positionStrategy: this.overlay.position()
          .global()
          .centerHorizontally()
          .centerVertically(),
        scrollStrategy: this.overlay.scrollStrategies.block()
      });

      this.overlayRef.attach(new ComponentPortal(GlobalLoaderComponent));
    }
  }

  private destroyOverlay() {
    if (this.overlayRef) {
      this.overlayRef.detach();
      this.overlayRef = null;
    }
  }
}