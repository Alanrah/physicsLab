var Leftbar = function(editor){
	
	var container = new UI.Panel();
    container.setId( 'leftbar' );

    var objectnum=0;

    var scene = editor.scene;
    var renderer = editor.renderer;
    var camera = editor.camera;
    var signals = editor.signals;
    var sceneHelpers = editor.sceneHelpers;

    var cubeImg = new UI.Image('image/cube.png').setDraggable( "true" );//.setCursor( "move" )
    cubeImg.onClick(function(){
    	var pos =  new THREE.Vector3(0,100,1);
		//pos.set(( position.x * 2 ) - 1, - ( position.y * 2 ) + 1, 0);
        var quat = new THREE.Quaternion;
    	quat.set(0, 0, 0, 1);

    	var cube={
    		mass:1,
    		width:1,
    		height:1,
    		depth:1
    	};

		var material = new THREE.MeshPhongMaterial( {color: 0x488C4E} );
		createBoxShape(cube.width, cube.height, cube.depth, cube.mass, pos, quat, createRendomColorObjectMeatrial()) ;
    });

    /*
    cubeImg.dom.addEventListener('mousedown', onMouseDown);

    function onMouseDown() {

    	console.log('mousedown');

    	document.addEventListener( 'mouseup', onMouseup, false );

    }

    function onMouseup(e){

    	e.preventDefault();
    	
    	console.log('up');

    	if(document.elementFromPoint(e.clientX,e.clientY).tagName.toUpperCase() == 'CANVAS'){

    		var position = new THREE.Vector2();
    		var x = getMousePosition(e.clientX,e.clientY);
    		position.fromArray( x );

    		var pos =  new THREE.Vector3();
    		pos.set(( position.x * 2 ) - 1, - ( position.y * 2 ) + 1, 0);
	    	quat.set(0, 0, 0, 1);

	    	var cube={
	    		mass:1,
	    		width:1,
	    		height:1,
	    		depth:1
	    	};

			var material = new THREE.MeshPhongMaterial( {color: 0x488C4E} );
			createBoxShape(cube.width, cube.height, cube.depth, cube.mass, pos, quat, material) ;

    	}

        document.removeEventListener( 'mouseup', onMouseup, false );
    }
    */
    container.add(cubeImg);

    var sphereImg = new UI.Image('image/sphere.png').onClick(function(){

    	var pos = new THREE.Vector3(0, 10, 2);
    	var quat = new THREE.Quaternion(0, 0, 0, 1);

		var material = new THREE.MeshPhongMaterial( {color: 0x212BDA} );
		createSphereShape(1, 1, 1, 2, pos, quat, createRendomColorObjectMeatrial()) ;
    });
    container.add(sphereImg);

    var slopeImg = new UI.Image('image/slope.png').onClick(function(){

        var pos =  new THREE.Vector3(0, -1.5, 0);
        var quat = new THREE.Quaternion(0, 0, 0, 1);
        quat.setFromAxisAngle(new THREE.Vector3(1, 0, 0), -Math.PI / 18);

        var cube={
            mass:0,
            width:8,
            height:4,
            depth:10
        };

        var material = new THREE.MeshPhongMaterial( {color: 0x488C4E} );
        createBoxShape(cube.width, cube.height, cube.depth, cube.mass, pos, quat, createRendomColorObjectMeatrial()) ;
    });
    container.add(slopeImg);

    // 生成随机颜色材质
    function createRendomColorObjectMeatrial() {
        var color = Math.floor(Math.random() * (1 << 24));
        return new THREE.MeshPhongMaterial({color: color});
    }


    function createBoxShape(sx, sy, sz, mass, pos, quat, material) {

        var threeObject = new THREE.Mesh(new THREE.BoxGeometry(sx, sy, sz, 1, 1, 1), material);
        threeObject.name = "box" + (objectnum++);
        threeObject.position.copy(pos);
        threeObject.castShadow = true;
        threeObject.receiveShadow =true;
        var shape = new Ammo.btBoxShape(new Ammo.btVector3(sx * 0.5, sy * 0.5, sz * 0.5));// box 的重心
        shape.setMargin(margin);//margin 范围内的碰撞有效

        //createRigidBody(threeObject, shape, mass, pos, quat);
        editor.signals.addCard.dispatch(createRigidBody(threeObject, shape, mass, pos, quat));

        return threeObject;
    }

    function createSphereShape(sx, sy, sz, mass, pos, quat, material) {

    	var ballMass = 1;
        var ballRadius = 0.5;

        var threeObject = new THREE.Mesh(new THREE.SphereGeometry(0.5,32,32 ), material);
        threeObject.name = "sphere" + (objectnum++);
        var shape = new Ammo.btSphereShape(0.5);// box 的重心
        shape.setMargin(margin);//margin 范围内的碰撞有效

        
        editor.signals.addCard.dispatch(createRigidBody(threeObject, shape, mass, pos, quat));

        return threeObject;
    }

    function getMousePosition( x, y ) {//dom = container.dom, x = event.clientX,  y = event.clientY

		var rect = document.getElementById('viewport').getBoundingClientRect();//getBoundingClientRect用于获得页面中某个元素的左，上，右和下分别相对浏览器视窗的位置。
		return [ ( x - rect.left ) / rect.width, ( y - rect.top ) / rect.height ];

	}

    return container;
}