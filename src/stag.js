var mainColor = new StringModel('gainsboro');
var StagRoot = Element.subclass(function(args){
	var self = this;
	args = args || {};
	//Windows.call(this, args);
	this.super.constructor.call(this, args);
	this.addClass('stag-root');
	this.windowManager = new StagWindowManager();
	this.windowManager.style({
		flex:'1',
	});
	this.menu = this.windowManager.menuButton.panel;

	this.append(this.windowManager);
	this.apps = {};
	document.body.appendChild(this.e);

});

//StagRoot.prototype = Object.create(Windows.prototype);

StagRoot.prototype.registerApp = function(args){
	args = args || {};
	var self = this;
	if (args.key === undefined || args.key in this.apps){
		return;
	}
	var app = {
		onRun: args.onRun || function(){},
		name: args.name || "Unnamed App",
		color: args.color || mainColor,
		key:args.key,
	};
	try{
		app.menuItem = new Element({
			className:'stag-menu-item clickable',
		});

		app.menuItem.append(app.name || "Unnamed App");
		app.menuItem.addClass(app.color || mainColor);
		this.windowManager.menuMiddle.append(app.menuItem);
		app.menuItem.setAction(function(){
			self.runApp(app.key);
		});
	}
	catch(e){
		throw(e);

	}
	this.apps[app.key] = app;
};

StagRoot.prototype.runApp = function(key){
	try{
		this.apps[key].onRun(this.apps[key]);
	}
	catch(e){
		throw(e);
	}
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
		icon:'apps',
	},{
		className:'stag-menu',
		contentType:'lines',
	});
	//this.menuButton.addClass('pink');
	this.filterElement = new TextInputCore({
		className:'stag-menu-filter',
	});
	this.filterElement.addClass('white');
	this.menuButton.button.addClass(mainColor);
	//this.menuButton.panel.append(this.filterElement);
	//this.menuButton.panel.addClass('white');
	this.menuTop = new Element({
		appendTo:this.menuButton.panel,
	});
	this.menuMiddle = new Element({
		appendTo:this.menuButton.panel,
	});
	this.menuBottom = new Element({
		appendTo:this.menuButton.panel,
	});
	this.toolbar.append(this.menuButton);
	this.windows = new Windows({
		share:1,
	});


	this.addClass('window-manager');

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

var StagWindow = Element.subclass(function(args){
	var self = this;
	args = args || {};
	this.super.constructor.call(this, args);
	this.addClass('stag-window');
	//this.addClass(args.className);

	this.toolbar = new Toolbar({
		className:'stag-window-toolbar'
	});
	this.body = new Container({
		share:1,
		className:'stag-window-body'
	});
	this.body.addClass(args.bodyStyle);
	this.toolbar.addClass(args.toolbarStyle);
	var titleElement = Element({
		tagName:'h3',
		className:'title h3 stag-window-title',
		appendTo: this.toolbar,
	});

	titleElement.append(args.app.name);

	this.super.append.call(this, this.toolbar);
	this.super.append.call(this, this.body);
});

StagWindow.def('append', function(arg1){
	this.body.append(arg1);
});

var stag = new StagRoot();