require([
  'strings/main.lang',
  '$api/models',
  'scripts/bootstrap'
], function(mainStrings, models, bootstrap) {
  'use strict';

  
 	function Qizone (uri) {
 		var self = this;
    self.uri = uri.split(':');
    self.domain = self.uri.slice(2);
 		this._resolve = function (entity, callback) {
      var xmlHttp = new XMLHttpRequest();
 			xmlHttp.onreadystatechange = function () {
	 			if(xmlHttp.readyState == 4) {
          console.log(xmlHttp.status);
	 				if(xmlHttp.status == 200) {
	 					var data = JSON.parse(xmlHttp.responseText);
						
            console.log(data);
						callback.success(data);
	 				} else {
	 					callback.fail();
	 				}
	 				callback.always(data);
	 			} else {

        }
	 		};
      var uri ='http://' + self.domain.join('/') + '/' + entity + 's';
	 		xmlHttp.open('GET', uri, true);
	 		xmlHttp.send(null);
      console.log("T");
		};
    this._load = function () {
      console.log(self);
      self._resolve('playlist', {
        success: function (playlists) {
          self.resolve('playlists', playlists.playlists);
        },
        always: function () {
          self._resolve('release', {
            success: function (releases) {

             console.log("A");
              var albums = [];
              console.log("Releases", releases);
              for(var i = 0; i < releases.releases.length; i++) {
                albums.push(releases.releases[i].uri);
              }
              albums = models.Album.fromURIs(albums);
              self.resolve('releases', albums);
              console.log(albums);
            },
            always: function () {

              self._resolve('feature', {
                success: function (features) {

                  self.resolve('features', features);
                },
                always: function () {
                  self._resolve('artist', {
                    success: function (artists) {
                      self.resolve('artists', artists);
                    },
                    always: function () {
                     self.resolveDone();

                    }

                  });
                  console.log("ffafa");
                }
              });
            }
          });
          
        }
      });
    };
 	
                 
 	};
  exports.Qizone = Qizone;
  exports.Qizone.fromURI = function (uri) {
    return new exports.Qizone(uri);
  }

 	SP.inherit(Qizone, models.Loadable);

 	models.Loadable.define(exports.Qizone, ['playlists', 'artists', 'features', 'releases'], '_load');

 	exports.Qizone = Qizone;
});
