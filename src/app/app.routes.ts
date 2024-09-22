import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { LoginComponent } from './components/login/login.component';
import { BaseComponent } from './components/base/base.component';
import { AuthGuard } from './shared/guard/auth.guard';
import { HomeComponent } from './components/home/home.component';
import { AboutComponent } from './components/about/about.component';
import { RegisterComponent } from './components/register/register.component';
import { ChatAIComponent } from './components/chat-ai/chat-ai.component';


export const routes: Routes = [

  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'about', component: AboutComponent},
  { path: 'register', component: RegisterComponent },
  { path: 'chat', component: ChatAIComponent, canActivate: [AuthGuard] },
  // {
  //   path: '',
  //   children: [
     
  //   ]
  // },
  { path: '**', component: HomeComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }