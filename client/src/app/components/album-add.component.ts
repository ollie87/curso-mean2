import {Component, OnInit} from '@angular/core';
import {UserService} from '../services/user.service';
import {ArtistService} from '../services/artist.service';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {Artist} from '../models/artist';
import {Album} from '../models/album';
import {GLOBAL} from '../services/global';

@Component({
	selector: 'album-add',
	templateUrl: '../views/album-add.html',
	providers: [UserService,ArtistService]
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
		private _artistService: ArtistService
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
		/*console.log(this.artist);
		this._artistService.addArtist(this.token,this.artist).subscribe(
			response => {
				if (!response.artist) {
					this.alertMessage = 'Error en el servidor';
					this.classAlertMessaje = 'alert alert-danger';
				}else{
					this.alertMessage = 'El artista se ha creado correctamente';
					this.artist = response.artist;
					this.classAlertMessaje = 'alert alert-info';
					this._router.navigate(['/editar_artista/' + response.artist._id]);
				}
			},
			error =>{
	  			if (error != null) {
	  				var body = JSON.parse(error._body);
	  				this.alertMessage = body.messaje;
	  				this.classAlertMessaje = 'alert alert-danger';
	  			}
	  		}
		)*/
	}
}