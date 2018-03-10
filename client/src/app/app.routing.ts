import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//import user
import { UserEditComponent} from './components/user-edit.component';
import { HomeComponent} from './components/home.component';

//import artist
import { ArtistListComponent} from './components/artist-list.component';
import { ArtistAddComponent } from './components/artist-add.component';
import { ArtistEditComponent } from './components/artist-edit.component';
import { ArtistDetailComponent } from './components/artist-detail.component';

//import album
import { AlbumAddComponent } from './components/album-add.component';

const appRoutes: Routes = [
	//{path: '', redirectTo: '/artists/1', pathMatch: 'full'},
	{path: '', component: HomeComponent},
	{path: 'mis-datos', component: UserEditComponent},
	{path: 'artistas/:page', component: ArtistListComponent},
	{path: 'crear_artista', component: ArtistAddComponent},
	{path: 'editar_artista/:id', component: ArtistEditComponent},
	{path: 'artista/:id', component: ArtistDetailComponent},
	{path: 'crear_album/:artist', component: AlbumAddComponent},
	{path: '**', component: HomeComponent},
];

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);