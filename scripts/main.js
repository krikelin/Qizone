require([
  'strings/main.lang',
  '$api/models',
  'scripts/qizone#Qizone',
  '$views/tabbar#TabBar',
  'scripts/jquery-1.10.2.min',
  'scripts/bootstrap',
  'scripts/views#Carousel',
  'scripts/views#PlayView'
], function(mainStrings, models, Qizone, TabBar, jquery, bootstrap, Carousel, PlayView) {
  'use strict';
  var tabBar = TabBar.withTabs([
    {id: 'overview', name: 'Overview', active: true},
    {id: 'albums', name: 'Albums'},
    {id: 'artists', name: 'Artists'}
  ]);
  tabBar.addToDom(document.querySelector('header'), 'after');
  tabBar.addEventListener('tabchange', function(e) {
    console.log(e);
    navigate([e.id]);
  });
  function navigate(args) {
    console.log("navigating", args);

    var page = args.length > 0 ? args[args.length-1] : "overview";
    setSection(page);
  }
  setSection("overview");
  models.application.addEventListener('arguments', function (app) {
    console.log(arguments);
    navigate(arguments);
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

  navigate(['overview']);

  var qizone = Qizone.fromURI("spotify:qizone:localhost:qizone:ws");
  console.log(qizone);
  qizone.load('playlists', 'artists', 'features', 'releases').done(function (qizone) {
    console.log("I'm here", qizone);
    console.log(Carousel);
    var features = Carousel.forFeatures(qizone.features.features, {});
    features.init();
    document.getElementById('featured').appendChild(features.node);
    console.log(qizone.playlists);
    for(var i = 0; i < qizone.playlists.length; i++) {
      var _playlist = qizone.playlists[i];
      var playlist = models.Playlist.fromURI(_playlist.uri);
      var playView = PlayView.forPlaylist(playlist);
      playView.init();
      document.getElementById('playlists').appendChild(playView.node);

    }
  }).always(function (qizone) {});
});
