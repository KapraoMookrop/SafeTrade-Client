import { Injectable } from '@angular/core';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Component } from '@angular/core';
import { AppStateService } from './AppStateService';

@Component({
  template: `<div class="modal-loading">
              <div class="loader"></div>
            </div>`,
  standalone: true
})
export class GlobalLoaderComponent {}

@Injectable({ providedIn: 'root' })
export class LoadingService {
  private overlayRef: OverlayRef | null = null;
  private loadingCount = 0; // ???????????????? request

  constructor(
    private overlay: Overlay,
    private appState: AppStateService // Inject AppStateService ??????????? signal
  ) { }

  show() {
    this.loadingCount++;
    // ??? Promise.resolve() ??????????????????????? Microtask queue 
    // ???????????? ExpressionChangedAfterItHasBeenCheckedError (NG0100)
    Promise.resolve().then(() => {
      this.appState.isLoading.set(true);

      if (!this.overlayRef) {
        this.overlayRef = this.overlay.create({
          hasBackdrop: true,
          backdropClass: 'cdk-overlay-dark-backdrop',
          positionStrategy: this.overlay.position()
            .global()
            .centerHorizontally()
            .centerVertically()
        });

        this.overlayRef.attach(new ComponentPortal(GlobalLoaderComponent));
      }
    });
  }

  hide() {
    this.loadingCount--;
    if (this.loadingCount <= 0) {
      this.loadingCount = 0;
      
      Promise.resolve().then(() => {
        this.appState.isLoading.set(false);

        if (this.overlayRef) {
          this.overlayRef.detach();
          this.overlayRef = null;
        }
      });
    }
  }
}
