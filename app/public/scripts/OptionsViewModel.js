define(['ko', 'helper', 'settings', 'notification'], function (ko, helper, settings, notification) {
    var OptionsViewModel = function (app) {
        var self = this;

        self.isMenuVisible = ko.observable(false);
        self.isMenuButtonVisible = ko.observable(false);
        self.theme = ko.observable(helper.getUrlParameter('theme') || settings.theme);
        self.themes = ko.observableArray(['default', 'stoplight', 'list', 'lingo', 'lowres']);
        self.browserNotificationSupported = ko.observable(notification.isSupportedAndNotDenied());
        self.browserNotificationEnabled = ko.observable(notification.isSupportedAndNotDenied() && settings.browserNotificationEnabled);
		self.browserNotificationEnabledSuccess = ko.observable(notification.isSupportedAndNotDenied() && settings.browserNotificationEnabledSuccess);
		self.browserNotificationEnabledFailed = ko.observable(notification.isSupportedAndNotDenied() && settings.browserNotificationEnabledFailed);
        self.soundNotificationEnabled = ko.observable(settings.soundNotificationEnabled);
        self.notificationFilterEnabled = ko.observable(settings.notificationFilterEnabled);
        self.notificationFilterValue = ko.observable(settings.notificationFilterValue);
        self.version = app.version;

        helper.detectGlobalInteraction(
            function() {
                self.isMenuButtonVisible(!self.isMenuVisible());
            },
            function() {
                self.isMenuButtonVisible(self.isMenuVisible());
            });

        self.changeTheme = function (theme) {
            settings.theme = theme;
            self.theme(theme);
        };

        self.show = function () {
            self.isMenuVisible(true);
            self.isMenuButtonVisible(false);
        };

        self.hide = function () {
            self.isMenuVisible(false);
            self.isMenuButtonVisible(true);
        };

        self.browserNotificationEnabled.subscribe(function (enabled) {
            if (enabled) {
                notification.ensureGranted(
                    function () {
                        settings.browserNotificationEnabled = true;
                    },
                    function () {
                        self.browserNotificationEnabled(false);
						self.browserNotificationEnabledSuccess(false);
						self.browserNotificationEnabledFailed(false);
                        settings.browserNotificationEnabled = false;
                    });
            } else {
                settings.browserNotificationEnabled = false;
            }
        });
		
		self.browserNotificationEnabledSuccess.subscribe(function (enabled) {
            if (enabled) {
                notification.ensureGranted(
                    function () {
                        settings.browserNotificationEnabledSuccess = true;
                    },
                    function () {
						self.browserNotificationEnabled(false);
                        self.browserNotificationEnabledSuccess(false);
						self.browserNotificationEnabledFailed(false);
                        settings.browserNotificationEnabledSuccess = false;
                    });
            } else {
                settings.browserNotificationEnabledSuccess = false;
            }
        });
		
		self.browserNotificationEnabledFailed.subscribe(function (enabled) {
            if (enabled) {
                notification.ensureGranted(
                    function () {
                        settings.browserNotificationEnabledFailed = true;
                    },
                    function () {
						self.browserNotificationEnabled(false);
						self.browserNotificationEnabledSuccess(false);
                        self.browserNotificationEnabledFailed(false);
                        settings.browserNotificationEnabledFailed = false;
                    });
            } else {
                settings.browserNotificationEnabledSuccess = false;
            }
        });

        self.soundNotificationEnabled.subscribe(function (enabled) {
            settings.soundNotificationEnabled = enabled;
        });

        self.notificationFilterEnabled.subscribe(function (enabled) {
            settings.notificationFilterEnabled = enabled;
        });

        self.notificationFilterValue.subscribe(function (value) {
            settings.notificationFilterValue = value;
        });
    };

    return OptionsViewModel;
});
