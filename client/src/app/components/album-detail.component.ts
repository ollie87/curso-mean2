import {Component, OnInit} from '@angular/core';
import {UserService} from '../services/user.service';
import {AlbumService} from '../services/album.service';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {Artist} from '../models/artist';
import {Album} from '../models/album';
import {GLOBAL} from '../services/global';

@Component({
	selector: 'album-detail',
	templateUrl: '../views/album-detail.html',
	providers: [UserService,AlbumService]
})

export class AlbumDetailComponent implements OnInit {
	public album: Album[];
	public identity;
	public token;
	public url: string;
	public alertMessage;
	public classAlertMessaje;
	public confirmado;
	public albums;

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _userService: UserService,
		private _albumService: AlbumService
	) {
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
		this.url = GLOBAL.url;
	}

	ngOnInit(){
		console.log('album-detail.component.ts cargado');
		//Llamar al método del api para sacar un artista en base a su id
		this.getAlbum();
	}

	getAlbum(){
		this._route.params.forEach((params: Params)=>{
			let id = params['id'];
			this._albumService.getAlbum(this.token,id).subscribe(
				response =>{
					if (!response.album) {
						this._router.navigate(['/']);
					}else{
						this.album = response.album;

						//Sacar los albums del artista
						/*this._albumService.getAlbums(this.token, response.artist._id).subscribe(
							response =>{	
								if (!response.albums) {
									this.alertMessage = 'Este artista no tiene albums';
								}else{
									this.albums = response.albums;
								}
							},
							error =>{
					  			if (error != null) {
					  				var body = JSON.parse(error._body);
					  				this.alertMessage = body.messaje;
					  				this.classAlertMessaje = 'alert alert-danger';
					  				console.log(error);
					  			}
				  			}
				  		)*/
					}
				},
				error =>{
		  			if (error != null) {
		  				var body = JSON.parse(error._body);
		  				this.alertMessage = body.messaje;
		  				this.classAlertMessaje = 'alert alert-danger';
		  				console.log(error);
		  			}
	  			}
			)
		});
	};

	onDeleteConfirm(id){
		this.confirmado = id;
	}

	onCancelAlbum(){
		this.confirmado = null;
	}

	onDeleteAlbum(id){
		this._albumService.deleteAlbum(this.token, id).subscribe(
			response =>{	
				console.log(response);
				if (!response.album) {
					this.alertMessage = 'Error en el servidor';
				}else{
					this.getAlbum();
				}
			},
			error =>{
	  			if (error != null) {
	  				var body = JSON.parse(error._body);
	  				this.alertMessage = body.messaje;
	  				this.classAlertMessaje = 'alert alert-danger';
	  				console.log(error);
	  			}
  			}
		);
	}

}