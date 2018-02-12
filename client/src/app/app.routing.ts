import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserEditComponent} from './components/user-edit.component';
import { ArtistListComponent} from './components/artist-list.component';
import { HomeComponent} from './components/home.component';

const appRoutes: Routes = [
	//{path: '', redirectTo: '/artists/1', pathMatch: 'full'},
	{path: '', component: HomeComponent},
	{path: 'mis-datos', component: UserEditComponent},
	{path: 'artists/:page', component: ArtistListComponent},
	{path: '**', component: HomeComponent},
];

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);