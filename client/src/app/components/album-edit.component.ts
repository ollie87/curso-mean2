import {Component, OnInit} from '@angular/core';
import {UserService} from '../services/user.service';
import {AlbumService} from '../services/album.service';
import {UploadService} from '../services/upload.service';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {Artist} from '../models/artist';
import {Album} from '../models/album';
import {GLOBAL} from '../services/global';

@Component({
	selector: 'album-edit',
	templateUrl: '../views/album-add.html',
	providers: [UserService,AlbumService,UploadService]
})

export class AlbumEditComponent implements OnInit {
	public titulo: string;
	public artist: Artist;
	public album: Album;
	public identity;
	public token;
	public url: string;
	public alertMessage;
	public classAlertMessaje;
	public isEdit;
	public filesToUpload: Array<File>;

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _userService: UserService,
		private _albumService: AlbumService,
		private _uploadService: UploadService
	) {
		this.titulo = 'Editar album';
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
		this.url = GLOBAL.url;
		this.album = new Album('','',2018,'','');
		this.isEdit = true;
	}

	ngOnInit(){
		console.log('album-add.component.ts cargado');
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
	}

	onSubmit(){
		this._route.params.forEach((params: Params) => {
			let id = params['id'];
			console.log(this.album);
			this._albumService.editAlbum(this.token, id, this.album).subscribe(
				response => {
					if (!response.album) {
						this.alertMessage = 'Error en el servidor';
						this.classAlertMessaje = 'alert alert-danger';
					}else{
						this.alertMessage = 'El album se ha actualizado correctamente';
						this.classAlertMessaje = 'alert alert-info';
						if (!this.filesToUpload) {
							this._router.navigate(['/artista',response.album.artist]);
						}else{
							this._uploadService.makeFileRequest(this.url+'upload-image-album/'+id,[],this.filesToUpload,this.token,'image')
								.then(
									(result) =>{
										this._router.navigate(['/artista',response.album.artist]);
									},
									(error)=>{
										var body = JSON.parse(error);
										this.alertMessage = body.messaje;
										this.classAlertMessaje = 'alert alert-danger';
									}
								);
						}
						//this.album = response.album;
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
		});
		
	}

	fileChangeEvent(fileInput: any){
		this.filesToUpload = <Array<File>>fileInput.target.files;
	}


}