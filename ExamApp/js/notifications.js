let notify = (() => {
    $(() => {
        let loading = 0;
        $(document).on({
            ajaxStart: () => {
                if (!loading) $('#loadingBox').fadeIn();
                loading++;
            },
            ajaxStop: () => setTimeout(() => {
                loading--;
                if (!loading) $('#loadingBox').fadeOut();
            }, 500)
        });

        $('#infoBox').click((event) => $(event.target).fadeOut());
        $('#errorBox').click((event) => $(event.target).fadeOut());
    });

    function showInfo(message) {
        let infoBox = $('#infoBox');
        let infoSpan = infoBox.find('span');
        infoSpan.text(message);
        infoBox.show();
        setTimeout(() => infoBox.fadeOut(), 3000);
    }

    function showError(message) {
        let errorBox = $('#errorBox');
        let errorSpan = errorBox.find('span');
        errorSpan.text(message);
        errorBox.show();
        setTimeout(() => errorBox.fadeOut(), 3000);
    }

    function handleError(reason) {
        showError(reason.responseJSON.description);
    }

    return {
        showInfo, showError, handleError
    }
})();