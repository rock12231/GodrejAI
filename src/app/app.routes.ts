import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './shared/guard/auth.guard';
import { HomeComponent } from './components/home/home.component';
import { RegisterComponent } from './components/register/register.component';
import { ChatAIComponent } from './components/chat-ai/chat-ai.component';
import { VerifyComponent } from './components/verify/verify.component';
import { ProfileComponent } from './components/profile/profile.component';


export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'verify', component: VerifyComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'ai-chat', component: ChatAIComponent, canActivate: [AuthGuard] },
  { path: 'profile/:displayName', component: ProfileComponent, canActivate: [AuthGuard] },
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