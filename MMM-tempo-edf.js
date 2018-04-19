'use strict';

Module.register("MMM-tempo-edf", {

  defaults: {
    title: 'Couleur Tempo EDF',
    url: '',
    updateInterval: 30*60*1000
    },

  start: function() {
    this.getData();
    this.scheduleUpdate();
    this.col_now = '';
    this.col_tomorrow = '';
    this.red_left = '';
    this.white_left = '';
    this.blue_left = '';
    this.nowloaded = false;
    this.tomorrowloaded = false;
    this.leftloaded = false;
    this.loaded = false;
  },

  getStyles: function() {
  		return ["style.css"];
  	},

  getDom: function() {
    var wrapper = document.createElement("div");

    if (!this.loaded) {
      wrapper.innerHTML = this.translate("LOADING");
      wrapper.className = "dimmed light small";
      return wrapper;
    }


    var table = document.createElement("table");
    table.className = "small";
    var row_now = document.createElement("tr");
    row_now.className = "days";
    table.appendChild(row_now);
    var nowtitle = document.createElement("td");
    nowtitle.className = "dimmed td-align-right";
    nowtitle.innerHTML = "Aujourd'hui :";
    row_now.appendChild(nowtitle);
    var nowcolor = document.createElement("td");
    nowcolor.className = this.col_now;
    nowcolor.colSpan = 3
    nowcolor.innerHTML = this.col_now;
    row_now.appendChild(nowcolor);

    var row_tomorrow = document.createElement("tr");
    row_tomorrow.className = "days";
    table.appendChild(row_tomorrow);
    var tomorrowtitle = document.createElement("td");
    tomorrowtitle.className = "dimmed td-align-right";
    tomorrowtitle.innerHTML = "Demain :";
    row_tomorrow.appendChild(tomorrowtitle);
    var tomorrowcolor = document.createElement("td");
    tomorrowcolor.className = this.col_tomorrow;
    tomorrowcolor.colSpan = 3;
    tomorrowcolor.innerHTML = this.col_tomorrow;
    row_tomorrow.appendChild(tomorrowcolor);

    var row_left = document.createElement("tr");
    row_left.className = "xsmall";
    table.appendChild(row_left);
    var lefttitle = document.createElement("td");
    lefttitle.className = "dimmed td-align-right";
    lefttitle.innerHTML = "Jours restants :";
    row_left.appendChild(lefttitle);
    var leftblue = document.createElement("td");
    leftblue.className = "BLEU";
    leftblue.innerHTML = this.blue_left;
    row_left.appendChild(leftblue);
    var leftwhite = document.createElement("td");
    leftwhite.className = "BLANC";
    leftwhite.innerHTML = this.white_left;
    row_left.appendChild(leftwhite);
    var leftred = document.createElement("td");
    leftred.className = "ROUGE";
    leftred.innerHTML = this.red_left;
    row_left.appendChild(leftred);



    return table;
  },



  scheduleUpdate: function(delay) {
    var nextLoad = this.config.updateInterval;
    if (typeof delay !== "undefined" && delay >= 0) {
      nextLoad = delay;
    }

    var self = this;
    setInterval(function() {
      self.getData();
    }, nextLoad);
  },

  getData: function () {
    this.sendSocketNotification('GET_NOW', this.config.url);
    this.sendSocketNotification('GET_TOMORROW', this.config.url);
    this.sendSocketNotification('GET_LEFT', this.config.url);
    this.nowloaded = false;
    this.tomorrowloaded = false;
    this.leftloaded = false;
  },

  socketNotificationReceived: function(notification, payload) {
  //  Log.info("received " + notification);
      //Log.info("received payload :"+ payload);
    if (notification === "DATA_NOW") {
//      Log.info("received now :"+ payload);
      this.col_now = payload;
      this.nowloaded = true;
    } else if (notification === "DATA_TOMORROW") {
//      Log.info("received demain :"+ payload);
      this.col_tomorrow = payload;
      this.tomorrowloaded =true;
    } else if (notification === "DATA_LEFT") {
//      Log.info("received bleu :"+ payload.blueleft);
//      Log.info("received blanc :"+ payload.whiteleft);
//      Log.info("received rouge :"+ payload.redleft);
      this.blue_left = payload.blueleft;
      this.red_left = payload.redleft
      this.white_left = payload.whiteleft
      this.leftloaded =true;
    }
    if (this.nowloaded  && this.tomorrowloaded && this.leftloaded)
    {
      this.loaded = true;
      var fade = 500;
//      Log.info("fade: " + fade);
      this.updateDom(fade);
    }

  }

});
