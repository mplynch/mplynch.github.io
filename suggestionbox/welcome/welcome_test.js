'use strict';

describe('myApp.welcome module', function() {

  beforeEach(module('myApp.welcome'));

  describe('view1 controller', function(){

    it('should ....', inject(function($controller) {
      //spec body
      var WelcomeCtrl = $controller('WelcomeCtrl');
      expect(welcomeCtrl).toBeDefined();
    }));

  });
});
