(() => {
    Handlebars.registerHelper('getUsername', function () {
        return sessionStorage.getItem('username');
    });

    Handlebars.registerHelper('isAuthed', function () {
       return auth.isAuthed();
    });

    Handlebars.registerHelper('getSubtotal', function () {
        return (Number(this.qty) * Number(this.price)).toFixed(2);
    });

    Handlebars.registerHelper('getTotal', function (total) {
        return total.toFixed(2);
    });

    Handlebars.registerHelper('getTotalReceipts', function (receipts) {
        let total = 0;
        for (let receipt of receipts) {
            total += receipt.total;
        }
        return total.toFixed(2);
    });
    
    Handlebars.registerHelper('formatDate', function (date) {
        return date.substring(0, 10) + ' ' + date.substring(11, 16);
    })

    Handlebars.registerHelper('isDetails', function () {
        return window.location.hash.startsWith('#/details');
    })
})();