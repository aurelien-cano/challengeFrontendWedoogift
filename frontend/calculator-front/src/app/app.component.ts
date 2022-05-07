import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public logReceivedAmount(event: number){
    console.log(`appComponent -> recived asked amount of: ${event}`);
  }
}
