var Rightbar = function(){

	var container = new UI.Panel();
    container.setId( 'rightbar' );

    var pause = new UI.Button("Stop").setMarginLeft( '60px' ).setWidth( "40px" ).setHeight("20px").setMarginTop("10px");
    pause.dom.addEventListener('click', 
    	function() {  
            if ( this.innerHTML === 'Start' ) {  
                this.innerHTML = 'Stop';  
                time = (new Date()).getTime();  
                state = true;  
            } else {  
                this.innerHTML = 'Start';  
                state = false;  
            }  
        });
    container.add(pause);

    var inpt = new UI.Input().setMarginLeft( '100px' ).setWidth( "4700px" ).setHeight("20px").setMarginTop("10px");
    container.add(inpt);

    return container;
}