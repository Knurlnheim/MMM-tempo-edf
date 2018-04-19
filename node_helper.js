var NodeHelper = require('node_helper');
var request = require('request');

module.exports = NodeHelper.create({
  start: function () {
    console.log('mmm-tempo-edf helper started...');
  },

  getNow: function (url) {
      var self = this;
      request({ url: 'http://domogeek.entropialux.com/tempoedf/now/json', method: 'GET' }, function (error, response, body) {
          if (!error && response.statusCode == 200) {
            var col_now = JSON.parse(body).tempocolor;
            self.sendSocketNotification('DATA_NOW', col_now);
  //          console.log("GET now OK:" + col_now);
          }
      });
  },
  getTomorrow: function (url) {
      var self = this;
      request({ url: 'http://domogeek.entropialux.com/tempoedf/tomorrow/json', method: 'GET' }, function (error, response, body) {
          if (!error && response.statusCode == 200) {
            var col_tomorrow = JSON.parse(body).tempocolor;
            self.sendSocketNotification('DATA_TOMORROW', col_tomorrow);
    //        console.log("GET tomorrow OK:" + col_tomorrow);
          }
      });
  },
  getLeft: function (url) {
        var self = this;
        request({ url: 'https://particulier.edf.fr/bin/edf_rc/servlets/ejptempodaysnew?TypeAlerte=TEMPO', method: 'GET' }, function (error, response, body) {
          if (!error && response.statusCode == 200) {
            var col_left=JSON.parse(body);
            var blueDays = col_left.PARAM_NB_J_BLEU;
            var whiteDays = col_left.PARAM_NB_J_BLANC;
            var redDays = col_left.PARAM_NB_J_ROUGE;
            self.sendSocketNotification('DATA_LEFT', {'blueleft':blueDays, 'whiteleft':whiteDays, 'redleft':redDays});
  //          console.log("GET col_restants OK:" + blueDays +" "+whiteDays+" "+redDays);
          }
        });
  },

  //Subclass socketNotificationReceived received.
  socketNotificationReceived: function(notification, payload) {
    //console.log("Received :" + notification);
    //console.log("Received payload:" + payload);
    if (notification === 'GET_NOW') {
      this.getNow(payload);
    } else if (notification === 'GET_TOMORROW') {
      this.getTomorrow(payload);
    } else if (notification === 'GET_LEFT') {
      this.getLeft(payload);
    }
  }

});
