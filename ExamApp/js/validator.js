let validator = (() => {
    return {
        validateUserForm: function (username, pass, repPass) {
            if (username.trim().length < 5) {
                notify.showError('Username should be at least 5 characters long');
                return false;
            }

            if (pass.trim() === '') {
                notify.showError('Password cannot be empty');
                return false;
            }

            if (repPass !== undefined && pass !== repPass) {
                notify.showError('Passwords mismatch');
                return false;
            }

            return true;
        },

        validateEntryForm: function (data) {
            if (data.type.trim() === '') {
                notify.showError('Product name cannot be empty');
                return false;
            }

            if (data.qty.trim() === '') {
                notify.showError('Quantity cannot be empty');
                return false;
            }

            if (isNaN(Number(data.qty))) {
                notify.showError('Quantity should be a number');
                return false;
            }

            if (data.price.trim() === '') {
                notify.showError('Price cannot be empty');
                return false;
            }

            if (isNaN(Number(data.price))) {
                notify.showError('Price should be a number');
                return false;
            }

            return true;
        },

        validateReceipt: function () {
            let receipt = JSON.parse(sessionStorage.getItem('receipt'));
            if (receipt.total === 0) {
                notify.showError('Receipt cannot be empty')
                return false;
            }

            return true;
        }
    }
})();