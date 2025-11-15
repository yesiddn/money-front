import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from '../header/header';
import { Navbar } from "../navbar/navbar";

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, Header, Navbar],
  templateUrl: './layout.html',
})
export class Layout {

}
