import { Injectable } from "@angular/core";

export interface ToasterInfo {
    classname: string;
    body: string;
  }
  
  @Injectable({ providedIn: 'root' })
  export class ToasterService {
    toasts: ToasterInfo[] = [];
  
    show(classname: string, body: string) {
      this.toasts.push({ classname, body });
      console.log("ToasterService pushed -> classname: ", classname, ' body: ', body);
    }
    remove(toast: ToasterInfo) {
      console.log("ToasterService remove -> classname: ", toast.classname, ' body: ', toast.body);
      this.toasts = this.toasts.filter(t => t != toast);
    }
  }