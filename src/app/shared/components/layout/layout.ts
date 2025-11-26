import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { Header } from '../header/header';
import { Navbar } from "../navbar/navbar";
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, Header, Navbar, ToastModule],
  templateUrl: './layout.html',
  providers: [MessageService],
})
export class Layout {

}
