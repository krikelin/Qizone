require([
  '$api/i18n',
  'strings/main.lang',
  '$api/models',
  '$views/image#Image',
  'scripts/jquery-1.10.2.min',
  'scripts/bootstrap',
  'scripts/extern/slab',
  '$views/list#List',
  '$views/buttons#SubscribeButton'
], function(i18n, mainStrings, models, Image, jquery, bootstrap, slab, List, SubscribeButton) {

  
  function Carousel (features, options) {
    this.features= features;
     this.node = document.createElement('div');
     var self = this;
     this.init = function () {
      var template = '{slab carousel}\
                        <div id="{id}"  class="carousel slide">\
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
          album.load('name').done(function (album) {
            var player = Image.forPlaylist(album, { title: album.name, player: true, width: 800, height: 320});
          
            item.appendChild(player.node);
          });
          
         
          contents.appendChild(item);
          console.log(this.node);
        }
        if(feature.uri.indexOf('spotify:album') == 0) {
          var album = models.Album.fromURI(feature.uri);
          album.load('name').done(function (album) {
            var player = Image.forAlbum(album, { title: album.name, player: true, width: 800, height: 320});
            
          item.appendChild(player.node);
          console.log(player.node);
          var img = player.node.getElementsByClassName('sp-image-inset')[0];
          img.style.backgroundImage = 'url("' + feature.image_url + '")';
          });

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


  /**
  A playlist view
  @class
  **/
  exports.PlayView = function (playlist) {
    this.playlist = playlist;
    console.log("PL", playlist);
    this.node = document.createElement('table');
    this.node.setAttribute('width', '100%');
    this.node.setAttribute("cellpadding", "12");
    var self = this;
    this.init = function () {
      console.log("Playlist", self.playlist);
      self.playlist.load('name', 'image', 'description', 'subscribers', 'tracks').done(function (playlist) {
        
        var td1 = document.createElement('td');
        var td2 = document.createElement('td');
        self.node.appendChild(td1);
        self.node.appendChild(td2);
        
        td1.setAttribute('width', '10%');
        td1.setAttribute('valign', 'top');sp://8e46e2f2ff49e8471293e896d562d4ead0af6c55.qizone/
        td2.setAttribute('valign', 'top');

        var image = Image.forPlaylist(playlist, {placeholder: 'playlist', width: 128, player:true, height: 128});
        td1.appendChild(image.node);
        td2.innerHTML = '<div id="pheader"><a class="title" href="' + playlist.uri + '">' + playlist.name.decodeForText() + "</a></div>";
        var btnSubscribe = SubscribeButton.forPlaylist(playlist);
        td2.appendChild(btnSubscribe.node);sp://8e46e2f2ff49e8471293e896d562d4ead0af6c55.qizone/spotify:app:qizone:user:qizone:playlist:2KZt7yZYUPpwJE3Kkr8q7Z:followers
        td2.appendChild(document.createElement("br"));
        td2.appendChild(document.createElement("br"));
        console.log("subscribers", playlist.subscribers);
        playlist.subscribers.snapshot().done(function (subscribers) {


          var s = '<a href="spotify:app:qizone:user:' + playlist.uri.split(':')[2] + ':playlist:' + playlist.uri.split(':')[4] + ':followers"><span class="salut">' + mainStrings.get('followers') + '</span><br /><span class="value">'  + i18n.number(subscribers.length + 0).decodeForText() + "</span></a>"; 
          console.log(s);
          var rRight = document.createElement('span');
          rRight.innerHTML = s;
          rRight.style.cssFloat = 'right';
          td2.firstChild.appendChild(rRight);

        });
        var p = document.createElement('p');
        p.classList.add('description');
          p.innerHTML = playlist.description.decodeForText();
          td2.appendChild(p);
        // Create playlist
        var list = new List(playlist.tracks, {throbber: 'hide-content', numItems: 15,  style: 'rounded'});
        td2.appendChild(list.node);
        list.init();
        console.log(td2);
        

      });
    }
  };
  exports.PlayView.forPlaylist = function (playlist) {
  
    return new exports.PlayView(playlist);
  };

  exports.UserRow = function (uri) {
    this.node = document.createElement('tr');
    this.node.classList.add('userrow');
    this.node.innerHTML = '<td id="img"></td><td width="100%" id="title"></td><td  id="follow"></td>';
    var user = models.User.fromURI(uri);
    var self = this;
    user.load('image', 'name', 'username').done(function (user) {
       var p = document.createElement('h3');
       p.innerHTML = user.name.decodeForText();
      self.node.querySelector("#title").appendChild(p);
      var image = Image.forUser(user, {width: 64, height: 64});
      self.node.querySelector("#img").appendChild(image.node);

      var followButton = SubscribeButton.forProfile(user);
      self.node.querySelector("#follow").appendChild(followButton.node);
     

    });
  };
  exports.UserRow.forUser = function(user, options) {
    return new exports.UserRow(user, options);
  };

  /** PlaylistGridView */
  exports.PlaylistGrid = function (playlists) {
    this.playlists = playlists;
    this.node = document.createElement('ul');
    this.node.classList.add('grid');
    var self = this;
    this.init = function () {
      var tr = document.createElement('tr');
      console.log(playlists);
      var pls = [];
      for(var i = 0; i < playlists.length; i++) {
        console.log(playlists[i]);
        pls.push(models.Playlist.fromURI(self.playlists[i].uri).load('name', 'description', 'image'));
      }
      models.Promise.join(pls).done(function (playlists) {
      
        console.log("F");
        console.log(playlists);
        for(var i = 0; i < playlists.length; i++) {
          var playlist = playlists[i];
        
        
            console.log("I", i);
           
            var td = document.createElement('li');
            td.classList.add('pentry');
            td.style.textAlign = "center";
            var image = Image.forPlaylist(playlist, {width:128, height: 128, player: true, style: 'rounded', title: playlist.name});
            td.appendChild(image.node);
           

            // Create title
            var a = document.createElement('a');
            a.innerHTML = playlist.name.substr(0, 16).decodeForText();
            a.setAttribute('href', playlist.uri.replace('spotify:', 'spotify:app:qizone:') + ':playlist');
            td.appendChild(a);

            var p = document.createElement('p');
            p.classList.add('description');
            if(playlist.description.length > 0) {
              p.innerHTML = playlist.description.decodeForText();
            } else {
              p.innerHTML = self.playlists[i].text.decodeForText();
            }
            td.appendChild(p);
            p.style.width = "120px";
            var subscribeButton = SubscribeButton.forPlaylist(playlist);
            self.node.appendChild(td);
            console.log("T");

        }
      });
      var user = models.Profile.fromURI("spotify:user:qizone");
      user.load('image', 'name').done(function (user) {
         var p = document.createElement('h3');
         p.innerHTML = user.name.decodeForText();
          document.querySelector("#control").appendChild(p);
        var image = Image.forProfile(user, {width: 94, height: 94});
        document.querySelector("#img").appendChild(image.node);

        var followButton = SubscribeButton.forProfile(user);
        document.querySelector("#control").appendChild(followButton.node);
       

      });
    };
  };

  exports.PlaylistGrid.forPlaylists = function (collection, options) {
    return new exports.PlaylistGrid(collection, options);
  };
  exports.PlaylistView = function(playlist, options) {
    this.playlist = playlist;
    this.node = document.createElement('table');
    this.node.classList.add('pentry');
    var self = this;
    self.node.classList.add('playlist');
    /*self.node.innerHTML = '<tr>\
          <td id="image"></td>\
          <td id="header">\
            <a href="" id="title"></a>\
            <div id="toolbar"></div>
            <div class="description" id="description"></div>\
          </td>\
          <td id="stats"></td>\
        </tr>\
        <tr>\
          <td id="list" colspan="3"></td>\
        </tr>';*/
    this.init = function () {
      self.playlist.load('name', 'subscribers', 'description', 'image', 'tracks').done(function (playlist) {

        var list = null;
        var image = null;
        var subscribeButton = null;
        if(playlist instanceof models.Playlist) {
          list = List.forPlaylist(playlist);
          image = Image.forPlaylist(playlist, {width:256, height: 256, player:true, header:'fixed'});
          subscribeButton = SubscribeButton.forPlaylist(playlist);
        }
        var tr1 = document.createElement('tr');
        var tr2 = document.createElement('tr');
        tr1.innerHTML = '<td id="image" width="256"></td><td colspan="2"><a id="title"></a><div id="toolbar"></div><div id="description"></div></td><td id="followers"></td>';
        tr2.innerHTML = '<td id="list" colspan="4"></td>';
        self.node.appendChild(tr1);
        self.node.appendChild(tr2);
        console.log(playlist);
        playlist.subscribers.snapshot().done(function (subscribers) {
          var s = '<a href="spotify:app:qizone:user:' + playlist.uri.split(':')[2] + ':playlist:' + playlist.uri.split(':')[4] + ':followers"><span class="salut">' + mainStrings.get('followers') + '</span><br /><span class="value">'  + i18n.number(subscribers.length + 0).decodeForText() + "</span></a>"; 
          self.node.querySelector('#followers').innerHTML = s;
        });
        list.init();
        self.node.querySelector('#list').appendChild(list.node);
        self.node.querySelector('#image').appendChild(image.node);
        self.node.querySelector('#title').innerHTML = playlist.name.decodeForHtml();
        self.node.querySelector('#toolbar').appendChild(subscribeButton.node);
          
      });
    };

  };
  exports.PlaylistView.forPlaylist = function (playlist, options) {
    return new exports.PlaylistView(playlist, options);
  }
});