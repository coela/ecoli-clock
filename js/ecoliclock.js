window.Bustime = function(options) {
	return this.init(options);
}

var myTbl = new Array("Sun","Mon","Tue","Wed","Thr","Fri","Sat");
Bustime.config = {
clockTracker : {},
};

Bustime.prototype = {
init: function(options) {
				this.canvasId = options.canvasId;
				this.displayRadius = 240;
				this.renderRadius = 240;
				this.canvas = document.getElementById(this.canvasId);

				this.canvas.setAttribute("width", this.displayRadius *2);
				this.canvas.setAttribute("height", this.displayRadius *2);
				this.canvas.style.width = this.displayRadius*2 + "px";
				this.canvas.style.height = this.displayRadius*2 + "px";
				this.scale = this.displayRadius / this.renderRadius;

				this.ctx = this.canvas.getContext("2d");
				this.ctx.font = "20px 'Vollkorn'";
				Bustime.config.clockTracker[this.canvasId] = this;
				this.tick();	
				return this;

			},

plotbus: function(min) {
					 console.log(min);
					console.log(Math.sin(min * 2 * Math.PI/60));
						var y = this.renderRadius - this.renderRadius * Math.cos(min * 2 * Math.PI/60) ;
						var x = this.renderRadius + this.renderRadius * Math.sin(min * 2 * Math.PI/60);
						console.log("x:" + x);
						console.log("y:" + y);
						this.ctx.fillText("bustime:" + min,x,y);
					},
refresh: function() {
					 var now = new Date();
					 this.render(now);
				 },
render: function(now) {
					this.ctx.clearRect(0,0,this.renderRadius*2,this.renderRadius*2); 
					this.plotbus(now.getMinutes());
					this.ctx.fillText(now.getHours() + ":" + now.getMinutes() + " (" + myTbl[now.getDay()] + ")" ,this.renderRadius,this.renderRadius ); 
				},
nextTick : function(){
						 this.tickTimeout = setTimeout("Bustime.config.clockTracker['"+this.canvasId+"'].tick()",1000);
					 },
tick: function() {
				if (true){
					this.refresh();
					this.nextTick();
				}
			}
};

Bustime.findAndCreateBustime = function() {
	var canvases = document.getElementsByTagName("canvas");
	for (var i=0; i < canvases.length; i++) {
		var fields = canvases[i].className.split(" ")[0].split(":");
		if (fields[0] == "Bustime") {
			if (!canvases[i].id) {
				canvases[i].id = '_bustime_auto_id_' + "1";
			}
			new Bustime ({
				canvasId: canvases[i].id,
				});
		}
	}
};

google.load("gdata", "1");
google.setOnLoadCallback(getMyFeed);
var myService;
var feedUrl = "https://www.google.com/calendar/feeds/iab.tau@hotmail.co.jp/private/full";

function logMeIn() {
	scope = "https://www.google.com/calendar/feeds/";
	var token = google.accounts.user.login(scope);
}

function setupMyService() {
	myService = new google.gdata.calendar.CalendarService('exampleCo-exampleApp-1');
	logMeIn();
}

function getMyFeed() {
	setupMyService();
	myService.getEventsFeed(feedUrl, callback, handleError);	
}

var callback = function(result) {       
	console.log(result);
	// Obtain the array of CalendarEventEntry
	var entries = result.feed.entry;    
	// Print the total number of events
	console.log('Total of ' + entries.length + ' event(s)');
	for (var i = 0; i < entries.length; i++ ) {
		var eventEntry = entries[i];
		var eventTitle = eventEntry.getTitle().getText();
		console.log('Event title = ' + eventTitle);
	}    
}

// Error handler to be invoked when getEventsFeed() produces an error
var handleError = function(error) {
	console.log(error);
}


if (window.jQuery) jQuery(document).ready(Bustime.findAndCreateBustime); 
