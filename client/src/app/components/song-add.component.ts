import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {UserService} from '../services/user.service';
import {SongService} from '../services/song.service';
import {Song} from '../models/song';
import {GLOBAL} from '../services/global';

@Component({
	selector: 'song-add',
	templateUrl: '../views/song-add.html',
	providers: [UserService,SongService]
})

export class SongAddComponent implements OnInit {
	public titulo: string;
	public song: Song;
	public identity;
	public token;
	public url: string;
	public alertMessage;
	public classAlertMessaje;

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _userService: UserService,
		private _songService: SongService
	) {
		this.titulo = 'Crear nueva canción';
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
		this.url = GLOBAL.url;
		this.song = new Song(0,'','','','');
	}

	ngOnInit(){
		console.log('song-add.component.ts cargado');
	}
	
	onSubmit(){	
		this._route.params.forEach((params: Params) => {
			let album_id = params['album'];
			this.song.album = album_id;
		});
		this._songService.addSong(this.token,this.song).subscribe(
			response => {
				if (!response.song) {
					this.alertMessage = 'Error en el servidor';
					this.classAlertMessaje = 'alert alert-danger';
				}else{
					this.alertMessage = 'La canción se ha creado correctamente';
					this.song = response.song;
					this.classAlertMessaje = 'alert alert-info';
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
	}
} 