require([
  'strings/main.lang',
  '$api/models'
], function(mainStrings, models) {
  'use strict';
 	function Qizone () {
 		var self = this;
 		this._resolve = function (entity, callback) {
 			xmlHttp.onreadystatechange = function () {
	 			if(xmlHttp.readyState == 4) {
	 				if(xmlHttp.status == 200) {
	 					var data = JSON.parse(xmlHttp.responseText);
						self.resolve(entity, data['entity']);
						callback.success(data);
	 				} else {
	 					callback.fail();
	 				}
	 				callback.always(data);
	 			}
	 		};
	 		xmlHttp.open('GET', 'http://localhost/qizone/ws/' + entity + 's', true);
	 		xmlHTtp.send(null);
		};
 	
 	}

 	SP.inherit(Qizone, models.Loadable);
 	Qizone.prototype._load = function () {
 		
 		self.resolve('playlist', {
 			success: function (playlists) {
 				self.resolve('playlists', playlists);
 			},
 			always: function () {
 				self._resolve('artist', {
 					success: function (artists) {
 						self.resolve('artists', artists);
 					},
 					always: function () {
 						self._resolve('feature', {
 							success: function (features) {
 								self.resolve('features', features);
 							},
 							always: function () {
 								self.resolveDone();
 							}
 						});
 					}
 				});
 			}
 		});
 		
 	};
 	models.Loadable.define(Qizone, ['playlists', 'artists', 'features', 'releases'], '_load');

 	exports.Qizone = Qizone;
});
