import { Directive, ElementRef, Renderer2, Input } from "@angular/core";
import { DomController } from "@ionic/angular";

@Directive({
  selector: "[myScrollVanish]"
})
export class HeaderTrasformDirective {
  @Input("myScrollVanish") scrollArea;

  private hidden: boolean = false;
  private triggerDistance: number = 10;

  constructor(
    private element: ElementRef,
    private renderer: Renderer2,
    private domCtrl: DomController
  ) {}

  ngOnInit() {
    setTimeout(() => {
      this.initStyles();

      this.scrollArea.ionScroll.subscribe(scrollEvent => {
        let delta = scrollEvent.detail.deltaY;

        if (scrollEvent.detail.currentY === 0 && this.hidden) {
          this.show();
        } else if (!this.hidden && delta > this.triggerDistance) {
          this.hide();
        }
      });
    }, 2000);
  }

  initStyles() {
    this.domCtrl.write(() => {
      this.renderer.setStyle(this.element.nativeElement, "transition", "0.3s linear");
    });
  }

  hide() {
    this.domCtrl.write(() => {
      this.renderer.setStyle(this.element.nativeElement, "background", "white");
      this.element.nativeElement.querySelectorAll("ion-title")[0].setAttribute("color", "dark");
      this.element.nativeElement
        .querySelectorAll("ion-buttons")[0]
        .querySelector("ion-back-button")
        .setAttribute("color", "dark");
    });

    this.hidden = true;
  }

  show() {
    this.domCtrl.write(() => {
      this.renderer.setStyle(this.element.nativeElement, "background", "rgba(0,0,0,0)");
      this.element.nativeElement.querySelectorAll("ion-title")[0].setAttribute("color", "light");
      this.element.nativeElement
        .querySelectorAll("ion-buttons")[0]
        .querySelector("ion-back-button")
        .setAttribute("color", "light");
    });

    this.hidden = false;
  }
}
