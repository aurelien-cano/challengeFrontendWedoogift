import { Component } from "@angular/core";
import { ToasterService } from "./toaster.service";

@Component({
    selector: 'app-toaster',
    templateUrl: './toaster.component.html',
    styleUrls: ['./toaster.component.css']
  })
  export class ToasterComponent {
    constructor(public toasterService: ToasterService) {}
  }