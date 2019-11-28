import { PostEditComponent } from './post-edit/post-edit.component';
import { PostListComponent } from './post-list/post-list.component';
import { PostsComponent } from './posts.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PostDetailComponent } from './post-detail/post-detail.component';
import { AuthGuard } from '../auth/auth.guard';
import { ProfileComponent } from '../profile/profile.component';
import { ProfilePostComponent } from '../profile/profile-post/profile-post.component';


const routes: Routes = [
    {
        path: 'posts',
        component: PostsComponent,
        children: [
            { path: '', component: PostListComponent },
            { path: 'new', component: PostEditComponent, canActivate: [AuthGuard] },
            { path: ':id/edit', component: PostEditComponent, canActivate: [AuthGuard] },
            { path: ':id', component: PostDetailComponent }
        ]
    },
    {
        path: 'profile',
        children: [
            {
                path: ':id', component: ProfileComponent, children: [
                    { path: ':type', component: ProfilePostComponent }
                ]
            }

        ]
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PostRoutingModule { }
