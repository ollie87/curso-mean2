//Creación de clase exportable
export class Song{
	constructor(
		public number: number,
		public name: string,
		public duration: string,
		public file: string,
		public album: string
	){}
}