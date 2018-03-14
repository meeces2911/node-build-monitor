define([], function () {
    var notificationsAreSupported = 'Notification' in window;
    
    var permissionIsGranted = function () {
        return Notification.permission === 'granted';
    };

    var permissionIsNotDenied = function () {
        return Notification.permission !== 'denied';
    };

    var isSupportedAndNotDenied = function () {
        return notificationsAreSupported && permissionIsNotDenied();
    };

    var ensureGranted = function (granted, notAvailable) {
        if(!notificationsAreSupported) {
            notAvailable();
        } else if (permissionIsGranted()) {
            granted();
        } else if (permissionIsNotDenied()) {
            Notification.requestPermission(function (permission) {
                if (permissionIsGranted()) {
                    granted();
                } else {
                    notAvailable();
                }
            });
        } else {
            notAvailable();
        }
    };

    var showFailed = function (build) {
        if (permissionIsGranted()) {
            var notification = new Notification('Build ' + build.number + ' failed!', {
                body: 'The build ' + build.number + ' of project ' + build.project + ', which was triggered as ' + build.reason + ' by ' + build.requestedFor + ', failed.',
                icon: '/images/notification_failed.png'
            });

            notification.onclick = function() {
                window.focus();
                this.cancel();
            };
        }
    };
	
	var showSuccess = function (build) {
        if (permissionIsGranted()) {
            var notification = new Notification('Build ' + build.number + ' succeeded.', {
                body: 'The build ' + build.number + ' of project ' + build.project + ', which was triggered as ' + build.reason + ' by ' + build.requestedFor + ', succeeded.',
                icon: '/images/notification_success.png'
            });

            notification.onclick = function() {
                window.focus();
                this.cancel();
            };
        }
    };

    return {
        isSupportedAndNotDenied: isSupportedAndNotDenied,
        ensureGranted: ensureGranted,
        showFailed: showFailed,
		showSuccess: showSuccess
    };
});