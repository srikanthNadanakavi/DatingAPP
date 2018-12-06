import {Routes} from '@angular/router';
import { HomeComponent } from 'src/app/home/home.component';
import { MemberListComponent } from 'src/app/member-list/member-list.component';
import { MessagesComponent } from 'src/app/messages/messages.component';
import { ListsComponent } from 'src/app/lists/lists.component';
import { AuthGuard } from './src/app/_gaurds/auth.guard';

export const appRouts: Routes = [
{ path: 'home', component: HomeComponent },
{ path: '', component: HomeComponent },
{
    path : '', // localhost:500/members
    runGuardsAndResolvers: 'always',
    canActivate : [AuthGuard],
    children: [
        { path: 'members', component: MemberListComponent },
        { path: 'messages', component: MessagesComponent },
        { path: 'lists', component: ListsComponent },
        { path: '**', redirectTo: 'home', pathMatch: 'full' },
    ]
},
];

