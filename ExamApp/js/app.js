$(() => {

    const MAIN = 'templates/main.hbs';
    const WELCOME = 'templates/welcome.hbs';
    const CREATE_RECEIPT = 'templates/createReceipt.hbs';
    const ENTRY = 'templates/partials/entry.hbs';
    const RECEIPT = 'templates/partials/receipt.hbs';
    const OVERVIEW = 'templates/overview.hbs';
    const DETAILS = 'templates/details.hbs';

    const app = Sammy('#container', function () {
        this.use('Handlebars', 'hbs');

        this.get('index.html', function () {
            let href = window.location.href;
            window.location.href = href.slice(0, href.lastIndexOf('/') + 1) +'#/home';
        });

        this.get('/', function () {
            this.redirect('#/home')
        });

        this.get('#/home', function () {
            if (auth.isAuthed()) {
                this.redirect('#/createReceipt');
            } else {
                this.loadPartials(createPartials(WELCOME))
                    .then(loadMain);
            }
        });

        this.post('#/login', function (ctx) {
            let username = ctx.params['username-login'];
            let password = ctx.params['password-login'];
            if (validator.validateUserForm(username, password)) {
                auth.login(username, password)
                    .then((userInfo) => {
                        auth.saveSession(userInfo);
                        ctx.redirect('#/createReceipt');
                        notify.showInfo('Login successful.');
                    })
                    .catch(notify.handleError)
            }
        });

        this.post('#/register', function (ctx) {
            let username = ctx.params['username-register'];
            let password = ctx.params['password-register'];
            let repPass = ctx.params['password-register-check'];
            if (validator.validateUserForm(username, password, repPass)) {
                auth.register(username, password)
                    .then((userInfo) => {
                        auth.saveSession(userInfo);
                        ctx.redirect('#/createReceipt');
                        notify.showInfo('User registration successful.');
                    })
                    .catch(notify.handleError)
            }
        });

        this.get('#/logout', function (ctx) {
            auth.logout().then(() => {
                sessionStorage.clear();
                ctx.redirect('#/home');
            }).catch(notify.handleError);
        });

        this.get('#/createReceipt', function (ctx) {
            services.getActiveReceipt().then(receipts => {
                if (receipts.length === 0) {
                    services.createReceipt().then(activeReceipt => {
                        ctx.receipt = activeReceipt;sessionStorage.setItem('receiptId', ctx.receipt._id);
                        sessionStorage.setItem('receipt', JSON.stringify(ctx.receipt));
                        services.getEntriesByReceiptID(ctx.receipt._id).then(entries => {
                            ctx.entries = entries;
                            let partials = createPartials(CREATE_RECEIPT);
                            partials.entry = ENTRY;
                            ctx.loadPartials(partials)
                                .then(loadMain);
                        }).catch(notify.handleError);
                    }).catch(notify.handleError);
                } else {
                    ctx.receipt = receipts[0];
                    sessionStorage.setItem('receiptId', ctx.receipt._id);
                    sessionStorage.setItem('receipt', JSON.stringify(ctx.receipt));
                    services.getEntriesByReceiptID(ctx.receipt._id).then(entries => {
                        ctx.entries = entries;
                        let partials = createPartials(CREATE_RECEIPT);
                        partials.entry = ENTRY;
                        ctx.loadPartials(partials)
                            .then(loadMain);
                    }).catch(notify.handleError);
                }
            }).catch(notify.handleError);
        });

        this.post('#/addEntry', function (ctx) {
            let params = ctx.params;
            let data = {
                type: params.type,
                qty: params.qty,
                price: params.price,
                receiptId: sessionStorage.getItem('receiptId')
            };
            if (validator.validateEntryForm(data)) {
                data.qty = Number(data.qty);
                data.price = Number(data.price);
                services.addEntry(data).then((entry) => {
                    let data = JSON.parse(sessionStorage.getItem('receipt'));
                    data.total += entry.price * entry.qty;
                    data.productCount++;
                    services.updateReceipt(data).then((receipt) => {
                        ctx.redirect('#/createReceipt');
                        notify.showInfo('Entry added');
                    }).catch(notify.handleError);
                }).catch(notify.handleError);
            }
        });

        this.get('#/deleteEntry/:id', function (ctx) {
            let id = ctx.params.id.slice(1);
            services.getEntry(id).then(entry => {
                let data = JSON.parse(sessionStorage.getItem('receipt'));
                data.total -= entry.price * entry.qty;
                data.productCount--;
                services.updateReceipt(data).then((receipt) => {
                    services.deleteEntry(id).then(() => {
                        ctx.redirect('#/createReceipt');
                        notify.showInfo('Entry removed');
                    }).catch(notify.handleError);
                }).catch(notify.handleError);
            }).catch(notify.handleError);
        });

        this.post('#/checkout', function (ctx) {
            if (validator.validateReceipt()) {
                services.commitReceipt().then(() => {
                    ctx.redirect('#/createReceipt');
                    notify.showInfo('Receipt checked out');
                }).catch(notify.handleError)
            }
        });

        this.get('#/overview', function (ctx) {
            services.getMyReceipts().then(receipts => {
                ctx.receipts = receipts;
                let partials = createPartials(OVERVIEW);
                partials.receipt = RECEIPT;
                ctx.loadPartials(partials)
                    .then(loadMain)
            }).catch(notify.handleError);
        });

        this.get('#/details/:id', function (ctx) {
            let id = ctx.params.id.slice(1);
            services.getEntriesByReceiptID(id).then(entries => {
                ctx.entries = entries;
                ctx.isDetails = true;
                let partials = createPartials(DETAILS);
                partials.entry = ENTRY;
                ctx.loadPartials(partials)
                    .then(loadMain);
            }).catch(notify.handleError);
        });
    });

    function loadMain() {
        this.partial(MAIN);
    }

    function createPartials(main) {
        return {
            header: 'templates/common/header.hbs',
            footer: 'templates/common/footer.hbs',
            main: main
        }
    }

    app.run();
});