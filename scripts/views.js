require([
  'strings/main.lang',
  '$api/models',
  '$views/image#Image',
  'scripts/jquery-1.10.2.min',
  'scripts/bootstrap',
  'scripts/extern/slab'
], function(mainStrings, models, Image, jquery, bootstrap, slab) {

  
  function Carousel (features, options) {
    this.features= features;
     this.node = document.createElement('div');
     var self = this;
     this.init = function () {
      var template = '{slab carousel}\
                        <div id="{id}" class="carousel slide">\
                        <ol class="carousel-indicators">\
                        {each feature in features}\
                        <li data-target="#{id}" data-slide-to="{feature.no}" class="{if feature.no === 0}active{end}">\
                        {end}\
                        </ol>\
                        <!-- Carousel items -->\
                        <div class="carousel-inner">\
                        </div>\
                        <!-- Carousel nav -->\
                        <a class="carousel-control left" href="#{id}" data-slide="prev">&lsaquo;</a>\
                        <a class="carousel-control right" href="#{id}" data-slide="next">&rsaquo;</a>\
                        </div>{endslab}';
                        console.log(template);
       slab = slab.slab;
       var templates =  null;
      try {
       templates = slab.compile(template);
      } catch (e) {
      console.log(e);
     }
     console.log(templates);
     console.log('features', features);
       var result = templates.carousel({id: 'features', 'features': features});
       self.node.innerHTML = result.replace('{id}', 'features');
       
       var contents = this.node.querySelector('.carousel-inner');
      
       for(var i = 0; i < self.features.length; i++) {
        var feature = self.features[i];
         var item = document.createElement('div');
         if(i == 0) {
            item.classList.add('active');
          }
          item.classList.add('item');
        console.log(feature);
        if(feature.uri.indexOf('spotify:user') == 0) {
          var album = models.Playlist.fromURI(feature.uri);
          var player = Image.forPlaylist(album, { player: true, width: 400, height: 120});
          
         
          item.appendChild(player.node);
          contents.appendChild(item);
          console.log(this.node);
        }
        if(feature.uri.indexOf('spotify:album') == 0) {
          var album = models.Album.fromURI(feature.uri);
          var player = Image.forAlbum(album, { player: true, width: 400, height: 120});
          
         
          item.appendChild(player.node);
          contents.appendChild(item);
          console.log(this.node);
        } 
       }
       console.log(result);
     };
  };
  exports.Carousel = Carousel;
  exports.Carousel.forFeatures = function (features, options) {
    return new exports.Carousel(features, options);
  };
});