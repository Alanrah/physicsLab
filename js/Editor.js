var Editor =function(){


	this.DEFAULT_CAMERA = new THREE.PerspectiveCamera( 50, 1, 0.1, 10000 );
	this.DEFAULT_CAMERA.name = 'Camera';
	this.DEFAULT_CAMERA.position.set( 20, 10, 20 );
	this.DEFAULT_CAMERA.lookAt( new THREE.Vector3() );
	
	this.camera = this.DEFAULT_CAMERA.clone();

	this.scene = new THREE.Scene();
	this.scene.name = 'Scene';
	this.scene.background = new THREE.Color( 0xF5EEEE );

	this.object = {};
	this.geometries = {};
	this.materials = {};
	this.textures = {};

	this.selected = null;

	var Signal = signals.Signal;

	this.signals={
		startPlayer: new Signal(),
		stopPlayer: new Signal(),
	}
	
}