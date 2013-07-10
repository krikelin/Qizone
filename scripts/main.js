require([
  'strings/main.lang',
  'scripts/qizone#Qizone',
  '$views/tabbar#TabBar'


], function(mainStrings, Qizone, TabBar) {
  'use strict';
  var tabBar = TabBar.withTabs([
    {id: 'overview', name: 'Overview', active: true},
    {id: 'albums', name: 'Albums'},
    {id: 'artists', name: 'Artists'}
  ]);
  tabBar.addToDom(document.body, 'prepend');
});
