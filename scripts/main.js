require([
  'strings/main.lang',
  '$api/models',
  'scripts/qizone#Qizone',
  '$views/tabbar#TabBar',
  'scripts/jquery-1.10.2.min',
  'scripts/bootstrap'
], function(mainStrings, models, Qizone, TabBar, bootstrap) {
  'use strict';
  var tabBar = TabBar.withTabs([
    {id: 'overview', name: 'Overview', active: true},
    {id: 'albums', name: 'Albums'},
    {id: 'artists', name: 'Artists'}
  ]);
  tabBar.addToDom(document.body, 'prepend');

  function navigate(args) {
    console.log("navigating", args);
    var page = args > 0 ? args[args.length-1] : "overview";
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
      var section = sections[i];
      section.style.display = section.id == id ? "block" : "none";
    }
  }

  navigate(['overview']);

  var qizone = Qizone.fromURI("spotify:qizone:localhost:qizone:ws");
  console.log(qizone);
  qizone.load('playlists', 'artists', 'features', 'releases').done(function (qizone) {
    alert("A");
    console.log("I'm here", qizone);
  }).always(function (qizone) {console.log("A")});
});
