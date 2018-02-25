import {Component, OnInit} from '@angular/core';
import {UserService} from '../services/user.service';
import {ArtistService} from '../services/artist.service';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {Artist} from '../models/artist';
import {GLOBAL} from '../services/global';

@Component({
	selector: 'artist-edit',
	templateUrl: '../views/artist-add.html',
	providers: [UserService,ArtistService]
})

export class ArtistEditComponent implements OnInit {
	public titulo: string;
	public artist: Artist;
	public identity;
	public token;
	public url: string;
	public alertMessage;
	public is_edit;

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _userService: UserService,
		private _artistService: ArtistService
	) {
		this.titulo = 'Actualizar artista';
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
		this.url = GLOBAL.url;
		this.artist = new Artist('','','');
		this.is_edit = true;
	}

	ngOnInit(){
		console.log('artist-add.component.ts cargado');
		//Llamar al método del api para sacar un artista en base a su id
		this.getArtist();
	}

	getArtist(){
		this._route.params.forEach((params: Params)=>{
			let id = params['id'];
			this._artistService.getArtist(this.token,id).subscribe(
				response =>{
					if (!response.artist) {
						this._router.navigate(['/']);
					}else{
						this.artist = response.artist;
					}
				},
				error =>{
		  			if (error != null) {
		  				var body = JSON.parse(error._body);
		  				this.alertMessage = body.messaje;
		  				console.log(error);
		  			}
	  			}
			)
		});
	}
	onSubmit(){
		this._route.params.forEach((params: Params)=>{
			let id = params['id'];
			this._artistService.editArtist(this.token,id,this.artist).subscribe(
				response => {
					if (!response.artist) {
						this.alertMessage = 'Error en el servidor';
					}else{
						this.alertMessage = 'El artista se ha actualizado correctamente';
						//this._router.navigate(['/editar-artista'], response.artist._id);
					}
				},
				error =>{
		  			if (error != null) {
		  				var body = JSON.parse(error._body);
		  				this.alertMessage = body.messaje;
		  				console.log(error);
		  			}
		  		}
			)
		});
	}
}