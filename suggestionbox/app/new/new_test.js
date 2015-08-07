'use strict';

describe('myApp.new module', function() {

  beforeEach(module('myApp.new'));

  describe('view1 controller', function(){

    it('should ....', inject(function($controller) {
      //spec body
      var newCtrl = $controller('NewCtrl');
      expect(newCtrl).toBeDefined();
    }));

  });
});
