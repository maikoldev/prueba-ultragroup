import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FrontNavbar } from "../../components/front-navbar/front-navbar";

@Component({
  selector: 'app-guest-layout',
  imports: [RouterOutlet, FrontNavbar],
  templateUrl: './guest-layout.html',
})
export class GuestLayout { }
