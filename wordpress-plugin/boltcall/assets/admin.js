(function ($) {
	'use strict';
	$(function () {
		var $btn    = $('#boltcall-test-lead');
		var $result = $('#boltcall-test-result');
		if (!$btn.length) return;

		$btn.on('click', function () {
			$result.removeClass('is-success is-error').addClass('is-pending').text(BoltcallAdmin.strings.sending);
			$btn.prop('disabled', true);

			$.post(BoltcallAdmin.ajaxUrl, {
				action: 'boltcall_test_lead',
				nonce: BoltcallAdmin.nonce,
			})
				.done(function (res) {
					if (res && res.success) {
						$result.removeClass('is-pending is-error').addClass('is-success').text(BoltcallAdmin.strings.success);
					} else {
						var msg = (res && res.data && res.data.message) || 'Test failed.';
						$result.removeClass('is-pending is-success').addClass('is-error').text(msg);
					}
				})
				.fail(function (xhr) {
					var msg = 'Request failed';
					try {
						var body = JSON.parse(xhr.responseText || '{}');
						if (body && body.data && body.data.message) msg = body.data.message;
					} catch (e) {}
					$result.removeClass('is-pending is-success').addClass('is-error').text(msg);
				})
				.always(function () {
					$btn.prop('disabled', false);
				});
		});
	});
})(jQuery);
