import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './about/about/about.component';
import { HomeComponent } from './home/home/home.component';
import { OfflineCacheingComponent } from './offline-cacheing.component';

const routes: Routes = [
  { path: '', component: OfflineCacheingComponent, children: [
    { path: 'home', component: HomeComponent },
    { path: 'about', component: AboutComponent },
    { path: 'view', loadChildren: () => import('./view/view.module').then(m => m.ViewModule) }
  ]}
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OfflineCacheingRoutingModule { }
