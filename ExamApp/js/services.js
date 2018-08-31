let services = (() => {
    return {
        getActiveReceipt: function () {
            return remote.get('appdata', `receipts?query={"_acl.creator":"${sessionStorage.getItem('userId')}","active":"true"}`);
        },

        getEntriesByReceiptID: function (id) {
            return remote.get('appdata', `entries?query={"receiptId":"${id}"} `);
        },

        createReceipt: function () {
            return remote.post('appdata', 'receipts', { active: "true", productCount: 0, total: 0 } );
        },

        addEntry: function (data) {
            return remote.post('appdata', 'entries', data);
        },

        deleteEntry: function (id) {
            return remote.remove('appdata', `entries/${id}`);
        },

        getMyReceipts: function () {
            return remote.get('appdata', `receipts?query={"_acl.creator":"${sessionStorage.getItem('userId')}","active":"false"}`);
        },

        getReceiptDetails: function (id) {
            return remote.get('appdata', `receipts/${id}`);
        },

        updateReceipt: function(data) {
            return remote.update('appdata', `receipts/${sessionStorage.getItem('receiptId')}`, data);
        },

        getEntry: function(id) {
            return remote.get('appdata', `entries/${id}`);
        },

        commitReceipt: function () {
            let receipt = JSON.parse(sessionStorage.getItem('receipt'));
            receipt.active = "false";
            return remote.update('appdata', `receipts/${receipt._id}`, receipt);
        }
    }
})();