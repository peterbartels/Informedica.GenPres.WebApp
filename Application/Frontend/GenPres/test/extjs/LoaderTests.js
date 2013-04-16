Ext.define('GenPres.test.extjs.LoaderTests', {
    describe: 'Ext.Loader',

    tests: function () {
        var me = this;

        it('should be enabled', function () {
            expect(Ext.Loader.config.enabled).toBe(true);
        });

        it('should have a GenPres path', function () {
            expect(Ext.Loader.config.paths.GenPres).toBeDefined();
        });
    }
});