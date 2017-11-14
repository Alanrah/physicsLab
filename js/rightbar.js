var Rightbar = function(editor){

	var container = new UI.Panel();
    container.setId( 'rightbar' );

    var scene = editor.scene;
    var renderer = editor.renderer;
    var camera = editor.camera;
    var signals = editor.signals;
    var sceneHelpers = editor.sceneHelpers;

    var pause = new UI.Button("Stop").setMarginLeft( '60px' ).setWidth( "40px" ).setHeight("20px").setMarginTop("10px");
    pause.onClick(function() {  
            if ( this.dom.innerHTML === 'Start' ) {  
                this.dom.innerHTML = 'Stop';  
                time = (new Date()).getTime();  
                state = true;  
            } else  {  
                this.dom.innerHTML = 'Start';  
                state = false;  
            }  
        });
    
    container.add(pause);

    var gravityConstantRow = new UI.Row().setMarginTop("5px");
    gravityConstantRow.add(new UI.Text("Gravity").setWidth( '90px' ));
    var gravityConstantt = new UI.Input('9.8').onChange(updateG);
    gravityConstantRow.add(gravityConstantt);
    container.add(gravityConstantRow);

    function updateG(){
        var newGravityConstant = gravityConstantt.getValue();
        gravityConstant = -newGravityConstant;
        initPhysics();
    }

    function createCard(object){

        var card = new UI.Panel();
        card.setClass('Card');

        var name = new UI.Text(object.name).setMarginTop('5px').setMarginBottom("5px").onClick(function(){
            setDDisplay(card.dom.firstChild.nextSibling);
        });
        card.add(name);

        var next = new UI.Panel().setMarginLeft('5px').setColor('#020202');
        card.add(next);

        var widthRow = new UI.Row();
        widthRow.add( new UI.Text('Width').setWidth( '90px' ));
        //var width = new UI.Input()
        
        // position

        var objectPositionRow = new UI.Row();
        var objectPositionX = new UI.Number(object.position.x).setWidth( '50px' ).setUnit("m").onChange( update );
        var objectPositionY = new UI.Number(object.position.y).setWidth( '50px' ).setUnit("m").onChange( update );
        var objectPositionZ = new UI.Number(object.position.z).setWidth( '50px' ).setUnit("m").onChange( update );

        objectPositionRow.add( new UI.Text( 'Position' ).setWidth( '90px' ) );
        objectPositionRow.add( objectPositionX, objectPositionY, objectPositionZ );

        next.add( objectPositionRow );

        // rotation

        var objectRotationRow = new UI.Row();
        var objectRotationX = new UI.Number(object.rotation.x).setStep( 10 ).setUnit( '°' ).setWidth( '50px' ).onChange( update );
        var objectRotationY = new UI.Number(object.rotation.y).setStep( 10 ).setUnit( '°' ).setWidth( '50px' ).onChange( update );
        var objectRotationZ = new UI.Number(object.rotation.z).setStep( 10 ).setUnit( '°' ).setWidth( '50px' ).onChange( update );

        objectRotationRow.add( new UI.Text( 'Rotation' ).setWidth( '90px' ) );
        objectRotationRow.add( objectRotationX, objectRotationY, objectRotationZ );

        next.add( objectRotationRow );

        // scale
        var objectScaleRow = new UI.Row();
        var objectScaleX = new UI.Number( object.scale.x ).setRange( 0.01, Infinity ).setWidth( '50px' ).onChange( update );
        var objectScaleY = new UI.Number( object.scale.y ).setRange( 0.01, Infinity ).setWidth( '50px' ).onChange( update );
        var objectScaleZ = new UI.Number( object.scale.z ).setRange( 0.01, Infinity ).setWidth( '50px' ).onChange( update );
        objectScaleRow.add( new UI.Text( 'Scale' ).setWidth( '90px' ) );
        objectScaleRow.add( objectScaleX, objectScaleY, objectScaleZ );
        next.add( objectScaleRow );

        //linear V 线速度
        var linearVRow = new UI.Row();
        var objectLinearVX = new UI.Number( object.userData.physicsBody.getLinearVelocity().x() ).setPrecision(3).setWidth( '50px' ).setUnit("m/s").onChange( update );
        var objectLinearVY = new UI.Number( object.userData.physicsBody.getLinearVelocity().y() ).setPrecision(3).setWidth( '50px' ).setUnit("m/s").onChange( update );
        var objectLinearVZ = new UI.Number( object.userData.physicsBody.getLinearVelocity().z() ).setPrecision(3).setWidth( '50px' ).setUnit("m/s").onChange( update );
        linearVRow.add(new UI.Text("linearVelocity").setWidth( '90px' ));
        linearVRow.add(objectLinearVX);
        linearVRow.add(objectLinearVY);
        linearVRow.add(objectLinearVZ);
        next.add(linearVRow);

        
        container.add(card);

        function update(){

            if ( object !== null){

                var newPosition = new THREE.Vector3( objectPositionX.getValue(), objectPositionY.getValue(), objectPositionZ.getValue() );
                if ( object.position.distanceTo( newPosition ) >= 0.01 ) {

                    object.position.x = newPosition.x;
                    object.position.y = newPosition.y;
                    object.position.z = newPosition.z;
                    object.__dirtyPosition = true;
                    console.log(newPosition.x +"  "+ object.position.x)
                    var objPhys = object.userData.physicsBody;
                    

                    if (ms) {

                        var transform = new Ammo.btTransform();
                        transform.setIdentity();
                        transform.setOrigin(new Ammo.btVector3(newPosition.x, newPosition.y, newPosition.z));
                        //transform.setRotation(new Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w));
                        objPhys.setMotionState(transform);
                        //ms.getWorldTransform(transformAux1);
                        //transformAux1.setOrigin(new Ammo.btVector3(objectPositionX.getValue(), objectPositionY.getValue(), objectPositionZ.getValue()));
                    }

                }

                var newScale = new THREE.Vector3( objectScaleX.getValue(), objectScaleY.getValue(), objectScaleZ.getValue() );
                if ( object.scale.distanceTo( newScale ) >= 0.01 ) {

                    object.scale.x = newScale.x;
                    object.scale.y = newScale.y;
                    object.scale.z = newScale.y;
                }

                var newRotation = new THREE.Euler( objectRotationX.getValue() * THREE.Math.DEG2RAD, objectRotationY.getValue() * THREE.Math.DEG2RAD, objectRotationZ.getValue() * THREE.Math.DEG2RAD );
                if ( object.rotation.toVector3().distanceTo( newRotation.toVector3() ) >= 0.01 ) {

                    object.rotation.x = newRotation.x;
                    object.rotation.y = newRotation.y;
                    object.rotation.z = newRotation.z;

                    var objPhys = object.userData.physicsBody;
                    var ms = objPhys.getMotionState();

                    if (ms) {
                        //ms.getWorldTransform(transformAux1);
                        //transformAux1.setRotation(new Ammo.btVector3(objectRotationX.getValue() * THREE.Math.DEG2RAD, objectRotationY.getValue() * THREE.Math.DEG2RAD, objectRotationZ.getValue() * THREE.Math.DEG2RAD));
                    }

                }
        }

        signals.objectChanged.dispatch();

        refreshUI(object);//输入无效，无法参与改变物理世界的相关参数
    }

    function refreshUI(object){

        if(object.position){
            objectPositionX.setValue(object.position.x);
            objectPositionY.setValue( object.position.y );
            objectPositionZ.setValue( object.position.z );
        }

        objectRotationX.setValue( object.rotation.x * THREE.Math.RAD2DEG );
        objectRotationY.setValue( object.rotation.y * THREE.Math.RAD2DEG );
        objectRotationZ.setValue( object.rotation.z * THREE.Math.RAD2DEG );

        objectScaleX.setValue( object.scale.x );
        objectScaleY.setValue( object.scale.y );
        objectScaleZ.setValue( object.scale.z );

        objectLinearVX.setValue(object.userData.physicsBody.getLinearVelocity().x());
        objectLinearVY.setValue(object.userData.physicsBody.getLinearVelocity().y());
        objectLinearVZ.setValue(object.userData.physicsBody.getLinearVelocity().z());
    }
    editor.signals.refreshRightUI.add(refreshUI);
 }

    editor.signals.addCard.add(createCard);

    

    function setDDisplay(card){
        
        if(card.style.display !== "block" && card.style.display !== "none"){
            card.style.display = "none";
        }

        else if(card.style.display === "none"){
            card.style.display = "block";
        }
        else if(card.style.display === "block"){
            card.style.display = "none";
        }
    }

    

    return container;
}