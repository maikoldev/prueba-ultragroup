import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FrontNavbar } from "../../components/front-navbar/front-navbar";
import { ToastNotificationComponent } from '@shared/components/toast-notification/toast-notification';

@Component({
  selector: 'app-guest-layout',
  imports: [RouterOutlet, FrontNavbar, ToastNotificationComponent],
  templateUrl: './guest-layout.html',
})
export class GuestLayout { }
