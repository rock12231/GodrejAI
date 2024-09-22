import { Component } from '@angular/core';
import { NavComponent } from "../nav/nav.component";
import { FooterComponent } from "../footer/footer.component";
import { RouterOutlet } from '@angular/router';
import { LogService } from '../../shared/services/log.service';

@Component({
  selector: 'app-base',
  standalone: true,
  imports: [NavComponent, FooterComponent,RouterOutlet],
  templateUrl: './base.component.html',
  styleUrl: './base.component.css'
})
export class BaseComponent {

  constructor(private userLogService: LogService) {}

  ngOnInit() {
    this.userLogService.initLogListener();
  }

}
