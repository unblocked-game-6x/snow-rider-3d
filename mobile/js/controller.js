'use.strict';

var controller = {

	init : function(){
		model.connect();
		
		var form = document.getElementById('connection');
		form.addEventListener('submit',function(e){ // connection à socket.io lorsque le formulaire est submit 
			e.preventDefault();

			model.IDSubmit(function(response){
				if(response == false){ // Mauvais ID
					document.getElementById('roomID').value = '';
					UI.IDError();
				}
				else if (response == true){ // Connection OK 
					UI.connectionOk();
					controller.startEvents(); // Ecoute des évènement pendant la lecture des docu 
				}
			});
		},false);
	},

	startEvents : function(){

		model.newEvent(function(data){
			UI.renderEvent(data);
		});

	}
};
controller.init();