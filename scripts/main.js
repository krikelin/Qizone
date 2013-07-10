require([
  'strings/main.lang',
  '$api/models',
  'scripts/qizone#Qizone',
  '$views/tabbar#TabBar',
  'scripts/jquery-1.10.2.min',
  'scripts/bootstrap',
  'scripts/views#Carousel',
  'scripts/views#PlayView',
  '$views/image#Image',
  '$views/buttons#SubscribeButton',
  'scripts/views#UserRow'
], function(mainStrings, models, Qizone, TabBar, jquery, bootstrap, Carousel, PlayView, Image, SubscribeButton, UserRow) {
  'use strict';
  var tabBar = TabBar.withTabs([
    {id: 'overview', name: 'Overview', active: true},
    {id: 'albums', name: 'Albums'},
    {id: 'artists', name: 'Artists'}
  ]);
  tabBar.addToDom(document.querySelector('nav'), 'after');
  tabBar.addEventListener('tabchange', function(e) {
    console.log(e);
    if(e.id != null)
    navigate([{data:{arguments:[e.id]}}]);
  });
  function navigate(e) {
    try {
      if(page === null)
        return;
    console.log(e);
    console.log("navigating", e[0].data.arguments);
    var args = e[0].data.arguments;
    var page = args.length > 0 ? args[args.length-1] : "overview";

    console.log("Page", page);
    setSection(page);
    if(args.length > 2) {
      console.log("ARGS", args);
      var entity = args[0];
      var user = args[1];
      var id = args[3];

      var action = args[4];
      if(entity === 'user') {
        var playlist = models.Playlist.fromURI('spotify:user:' + user + ':playlist:' + id);
         
        if(action === 'followers') {
           document.querySelector('#users').innerHTML = "";
          playlist.load('subscribers', 'name').done(function (playlist) {
            var followers = playlist.subscribers.snapshot();
            followers.done(function (followers) {
              for(var i = 0; i < followers.length; i++) {
                var userRow = UserRow.forUser(followers.get(i));
               
                document.querySelector('#users').appendChild(userRow.node); 
              }
            }).fail(function (e){
              console.log(e);
            });
          });
        }
      }
    }
  }catch(e) {
    console.log(e);
  }
  }
  setSection("overview");
  models.application.addEventListener('arguments', function (e) {

    console.log(e);
    navigate([e]);
  });
  function setSection(id) {
    var sections = document.querySelectorAll('section');
    for(var i = 0; i < sections.length; i++) {
      console.log("Q");
      var section = sections[i];
      console.log(section);
      console.log('id', id);
      section.style.display =id == section.getAttribute('id') ? "block" : "none";
      console.log(section.style.display );
    }
    tabBar.setActiveTab(id);
  }

  navigate([{data:{arguments:['overview']}}]);

  var qizone = Qizone.fromURI("spotify:qizone:ws.qizone.se");
  console.log(qizone);
  qizone.load('playlists', 'artists', 'features', 'releases').done(function (qizone) {
    console.log("I'm here", qizone);
    console.log(Carousel);
    var features = Carousel.forFeatures(qizone.features.features, {});
    features.init();
    document.getElementById('featured').appendChild(features.node);
    console.log(qizone.playlists);
    var tr = document.createElement('tr');
    var pls = [];
    for(var i = 0; i < qizone.playlists.length; i++) {
      pls.push(models.Playlist.fromURI(qizone.playlists[i].uri).load('name', 'description', 'image'));
    }
    models.Promise.join(pls).done(function (playlists) {
      for(var i = 0; i < playlists.length; i++) {
        var playlist = playlists[i];
      
      
          console.log("I", i);
          if((i % 5) == 0) {
            tr = document.createElement('tr');
            document.getElementById('playlists').appendChild(tr);
          }
          var td = document.createElement('td');
          td.classList.add('pentry');
          td.style.textAlign = "center";
          var image = Image.forPlaylist(playlist, {width:128, height: 128, player: true, style: 'rounded', title: playlist.name});
          td.appendChild(image.node);
         

          // Create title
          var a = document.createElement('a');
          a.innerHTML = playlist.name.decodeForText();
          td.appendChild(a);

          var p = document.createElement('p');
          p.classList.add('description');
          p.innerHTML = playlist.description.decodeForText();
          td.appendChild(p);
          p.style.width = "120px";
          var subscribeButton = SubscribeButton.forPlaylist(playlist);
          td.appendChild(subscribeButton.node);
         tr.appendChild(td);
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
  }).always(function (qizone) {});
});
