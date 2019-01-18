import {Routes} from '@angular/router';
import { HomeComponent } from 'src/app/home/home.component';
import { MemberListComponent } from 'src/app/members/member-list/member-list.component';
import { MessagesComponent } from 'src/app/messages/messages.component';
import { ListsComponent } from 'src/app/lists/lists.component';
import { AuthGuard } from './src/app/_gaurds/auth.guard';
import { MemberDetailComponent } from 'src/app/members/member-detail/member-detail.component';
import { MemberDetailResolver } from 'src/app/_resolvers/member-detal.resolver';
import { MemberListResolver } from 'src/app/_resolvers/member-list.resolver';
import { MemberEditComponent } from 'src/app/members/member-edit/member-edit.component';
import { MemberEditResolver } from 'src/app/_resolvers/member-edit.resolver';
import { PreventUnsavedChanges } from 'src/app/_gaurds/prevent-unsaved-changes.gaurd';

export const appRouts: Routes = [
{ path: 'home', component: HomeComponent },
{ path: '', component: HomeComponent },
{
    path : '', // localhost:500/members
    runGuardsAndResolvers: 'always',
    canActivate : [AuthGuard],
    children: [
        { path: 'members', component: MemberListComponent,
          resolve: { users: MemberListResolver } },
        { path: 'members/edit', component: MemberEditComponent,
          resolve: { user: MemberEditResolver} , canDeactivate : [PreventUnsavedChanges]},
        { path: 'members/:id', component: MemberDetailComponent,
          resolve: { user: MemberDetailResolver } },
        { path: 'messages', component: MessagesComponent },
        { path: 'lists', component: ListsComponent },
        { path: '**', redirectTo: 'home', pathMatch: 'full' },
    ]
},
];

