import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {UserService} from '../services/user.service';
import {SongService} from '../services/song.service';
import {UploadService} from '../services/upload.service';
import {Song} from '../models/song';
import {GLOBAL} from '../services/global';

@Component({
	selector: 'song-edit',
	templateUrl: '../views/song-add.html',
	providers: [UserService,SongService, UploadService]
})

export class SongEditComponent implements OnInit {
	public titulo: string;
	public song: Song;
	public identity;
	public token;
	public url: string;
	public alertMessage;
	public classAlertMessaje;
	public is_edit;
	public filesToUpload;

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _userService: UserService,
		private _songService: SongService,
		private _uploadService: UploadService
	) {
		this.titulo = 'Editar canción';
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
		this.url = GLOBAL.url;
		this.song = new Song(0,'','','','');
		this.is_edit = true;
	}

	ngOnInit(){
		console.log('song-edit.component.ts cargado');
		this.getSong();
	}
	
	getSong(){
		this._route.params.forEach((params: Params) => {
			let id = params['id'];
			this._songService.getSong(this.token, id).subscribe(
				response=>{
					if (!response.song) {
						this._router.navigate(['/']);
					}else{
						this.song = response.song;
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

	onSubmit(){	
		this._route.params.forEach((params: Params) => {
			let id = params['id'];
		
			this._songService.updateSong(this.token, id, this.song).subscribe(
				response => {
					if (!response.song) {
						this.alertMessage = 'Error en el servidor';
						this.classAlertMessaje = 'alert alert-danger';
					}else{
						this.alertMessage = 'La canción se ha actualizado correctamente';
						this.song = response.song;
						this.classAlertMessaje = 'alert alert-info';

						if (!this.filesToUpload) {
							this._router.navigate(['/album',response.song.album]);
						}else{
							this._uploadService.makeFileRequest(this.url+'upload-file-song/'+id,[],this.filesToUpload,this.token,'file')
								.then(
									(result) =>{
										this._router.navigate(['/album',response.song.album]);
									},
									(error)=>{
										var body = JSON.parse(error);
										this.alertMessage = body.messaje;
										this.classAlertMessaje = 'alert alert-danger';
									}
								);
						}
						
						//this._router.navigate(['/editar_album/' + response.song._id]);
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
		})
	}
	
	fileChangeEvent(fileInput: any){
		this.filesToUpload = <Array<File>>fileInput.target.files;
	}
} 