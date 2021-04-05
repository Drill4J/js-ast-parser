  scope.loadListPromise = listLoader.loadList('monitor')
  .then(function (monitors) {
    $rootScope.$emit('updateMainMenuMonitorList', monitors);
  })
  .catch(function () {
    that.updateMainMenuOnInput();
  })
  .finally(function () {
    scope.loadListPromise = null;
  });