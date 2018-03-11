import {Component, OnInit} from '@angular/core';
import {UserService} from '../services/user.service';
import {ArtistService} from '../services/artist.service';
import {AlbumService} from '../services/album.service';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {Artist} from '../models/artist';
import {Album} from '../models/album';
import {GLOBAL} from '../services/global';

@Component({
	selector: 'album-add',
	templateUrl: '../views/album-add.html',
	providers: [UserService,ArtistService,AlbumService]
})

export class AlbumAddComponent implements OnInit {
	public titulo: string;
	public artist: Artist;
	public album: Album;
	public identity;
	public token;
	public url: string;
	public alertMessage;
	public classAlertMessaje;

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _userService: UserService,
		private _artistService: ArtistService,
		private _albumService: AlbumService
	) {
		this.titulo = 'Crear nuevo album';
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
		this.url = GLOBAL.url;
		this.album = new Album('','',2018,'','');
	}

	ngOnInit(){
		console.log('album-add.component.ts cargado');
	}
	onSubmit(){
		this._route.params.forEach((params: Params) => {
			let artist_id = params['artist'];
			this.album.artist = artist_id;
		});
		console.log(this.album);
		this._albumService.addAlbum(this.token,this.album).subscribe(
			response => {
				if (!response.album) {
					this.alertMessage = 'Error en el servidor';
					this.classAlertMessaje = 'alert alert-danger';
				}else{
					this.alertMessage = 'El album se ha creado correctamente';
					this.album = response.album;
					this.classAlertMessaje = 'alert alert-info';
					this._router.navigate(['/editar_album/' + response.album._id]);
				}
			},
			error =>{
	  			if (error != null) {
	  				var body = JSON.parse(error._body);
	  				this.alertMessage = body.messaje;
	  				this.classAlertMessaje = 'alert alert-danger';
	  			}
	  		}
		)
	}
}