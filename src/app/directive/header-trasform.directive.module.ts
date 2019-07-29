import { Directive, ElementRef, Renderer2, Input, NgModule } from "@angular/core";
import { DomController } from "@ionic/angular";
import { HeaderTrasformDirective } from "./header-trasform.directive";

@NgModule({
  declarations: [HeaderTrasformDirective],
  exports: [HeaderTrasformDirective]
})
export class HeaderTrasformDirectiveModule {}
