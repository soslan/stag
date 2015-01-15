var mainColor = new Value({
	value:'blue',
});
function StagRoot(args){
	var self = this;
	args = args || {};
	Windows.call(this, args);

	this.addClass('root');
	this.windowManager = new StagWindowManager();
	this.menu = this.windowManager.menuButton.panel;

	this.splash = new Element(document.getElementById('stag-splash'));

	this.append(this.sessionManager);
	this.append(this.windowManager);
	document.body.appendChild(this.e);

}

StagRoot.prototype = Object.create(Windows.prototype);

StagRoot.prototype.registerApp = function(args){
	args = args || {};
	try{
		args.menuItem = new Element({
			className:'stag-menu-item clickable',
		});

		args.menuItem.append(args.name || "Unnamed App");
		args.menuItem.addClass(args.color || mainColor);
		this.menu.append(args.menuItem);
		args.menuItem.setAction(function(){
			args.onRun();
		});
	}
	catch(e){

	}
};

StagRoot.prototype.onStartUp = function(){

}

StagRoot.prototype.start = function(){
	this.dispatchEvent('start');
}

StagRoot.prototype.init = function(){
	
}


StagRoot.prototype.addWindow = function(wind, handleArgs){
	var self = this;
	handleArgs = handleArgs || {};
	wind = wind || new StandardWindow();
	this.windowManager.windows.append(wind);
	var handle = wind.getHandle(handleArgs);
	this.windowManager.toolbar.append(handle);
	this.windowManager.windows.switchTo(wind);

	return wind;
}

function StagWindowManager(args){
	var self = this;
	args = args || {};
	Windows.call(this, args);
	this.e.style.justifyContent = 'center';
	this.bodyContainer = new Container({
		share:1,
	});
	this.toolbar = new Toolbar({
		className:'white mh-r',
	});
	this.menuButton = new Dropdown({
		className:'quiet',
		icon:'bars',
	},{
		className:'stag-menu',
		contentType:'lines',
	});
	this.filterElement = new TextInputCore({
		className:'stag-menu-filter',
	});
	this.filterElement.addClass(mainColor);
	this.menuButton.button.addClass(mainColor);
	this.menuButton.panel.append(this.filterElement);
	this.menuButton.panel.addClass(mainColor);
	this.toolbar.append(this.menuButton);
	this.windows = new Windows({
		share:1,
	});


	this.addClass('window-manager black');

	this.append(this.bodyContainer);
	this.bodyContainer.append(this.toolbar);
	this.bodyContainer.append(this.windows);
	

	
}

StagWindowManager.prototype = Object.create(Windows.prototype);


// To be removed
StagWindowManager.prototype.create = function(args, handleArgs){
	var self = this;
	args = args || {};
	args.color = args.color || 'white';
	var container = new Containers({
		share:1,
	});
	container.addClass(args.color);
	//self.windows.append(container);
	
	if(args.open == true){
		self.windows.appendAndShow(container);
	}
	else{
		self.windows.append(container);
	}
	handleArgs = handleArgs || {};
	handleArgs.text = args.title;
	var handle = container.getHandle(handleArgs);
	handle.addClass(args.color);
	this.toolbar.append(handle);

	return container;
}

var stag = new StagRoot();