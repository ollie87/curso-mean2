import { Component, OnInit } from '@angular/core';
import { UserService } from './services/user.service';
import { User } from './models/user';
import {GLOBAL} from './services/global';
import {Router, ActivatedRoute, Params} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers: [UserService]
})

export class AppComponent implements OnInit {
  public title = 'MUSIFY';
  public user: User;
  public user_register: User;
  public identity;
  public token;
  public errorMessage;
  public alertRegister;
  public url: string;

  constructor(
    private _userService: UserService, 
    private _router: Router,
    private _route: ActivatedRoute
  ){
  	this.user = new User('','','','','','ROLE_USER','');
  	this.user_register = new User('','','','','','ROLE_USER','');
    this.url = GLOBAL.url;
  }


  //Se lanza al cargar la alplicación
  ngOnInit(){
  	this.identity = this._userService.getIdentity();
  	this.token = this._userService.getToken();

  	console.log(this.identity);
  	console.log(this.token);
  }

  public onSubmit(){
  	console.log(this.user);
  	//Conseguir los datos de usuario identificado
  	this._userService.singup(this.user).subscribe(
  		response => {
  			let identity = response.user;
  			this.identity = identity;
  			if (!this.identity._id) {
  				alert("El usuario no está correctamente identificado");
  			}else{
  				//Crear elemento usuario en el localstorage
  				localStorage.setItem('identity',JSON.stringify(identity));
  				//Conseguir el token
  				this._userService.singup(this.user,'true').subscribe(
			  		response => {
			  			let token = response.token;
			  			this.token = token;
			  			if (this.token.length <= 0) {
			  				alert("El token no se ha generado correctamente");
			  			}else{
			  				//Crear elemento en el localstorage para tener el token disponible
			  				localStorage.setItem('token',token);
			  				this.user = new User('','','','','','ROLE_USER','');
			  			}
			  		},
			  		error =>{
			  			if (error != null) {
			  				var body = JSON.parse(error._body);
			  				this.errorMessage = body.messaje;
			  				console.log(error);
			  			}
			  		}
			  	);
  			}
  		},
  		error =>{
  			if (error != null) {
  				var body = JSON.parse(error._body);
  				this.errorMessage = body.messaje;
  				console.log(error);
  			}
  		}
  	);
  }


  onSubmitRegister(){
  	console.log(this.user_register);

  	this._userService.register(this.user_register).subscribe(
  		response =>{
  			let user = response.user;
  			this.user_register = user;

  			if (!user._id) {
  				this.alertRegister = 'Error al registrase';
  			}else{
  				this.alertRegister = 'El registro se ha realizado correctamente, identificate con: ' + this.user_register.email;
  				this.user_register = new User('','','','','','ROLE_USER','');
  			}
  		},
  		error =>{
  			var body = JSON.parse(error._body);
  			this.alertRegister = body.messaje;
  			console.log(error);
  		}
  	);
  }

  logout(){
  	localStorage.clear();
  	this.identity = null;
  	this.token = null;
    this._router.navigate(["/"]);
  }
}
