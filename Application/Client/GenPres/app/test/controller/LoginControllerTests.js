Ext.define('GenPres.test.controller.LoginControllerTests', {

    describe: 'Login controller should',

    tests: function () {
        it('Controller validateLogin should call validateLoginForm', function () {
            var controller = GenPres.application.getController("GenPres.controller.user.LoginController");
            spyOn(controller, 'validateLoginForm');
            controller.validateLogin({ username: "", password: "" });
            expect(controller.validateLoginForm).toBeNull();
        });
    }
});