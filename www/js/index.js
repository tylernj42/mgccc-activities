var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    onDeviceReady: function() {
        angular.element(document).ready(function() {
            angular.bootstrap(document, ['ngApp']);
        });
    }
};