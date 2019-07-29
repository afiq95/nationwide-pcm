import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-signature-form",
  templateUrl: "./signature-form.page.html",
  styleUrls: ["./signature-form.page.scss"]
})
export class SignatureFormPage implements OnInit {
  public signaturePadOptions: Object = {
    // passed through to szimek/signature_pad constructor
    minWidth: 5,
    canvasWidth: 500,
    canvasHeight: 300
  };
  constructor() {}

  ngOnInit() {}
}
