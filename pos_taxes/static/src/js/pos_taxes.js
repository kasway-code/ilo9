odoo.define("pos_taxes.pos", function (require) {
    "use strict";

    var screens = require("point_of_sale.screens");

    screens.OrderWidget.include({
        update_summary: function(){
            this._super();
            window.zxc = this;

            var total_untaxed_by_tax_id = {
                '0': 0,
                '12': 0
            };

            this.pos.get_order().orderlines.forEach(function(orderline) {
                var price_unit = orderline.get_unit_price() * (1.0 - (orderline.get_discount() / 100.0));
                var quantity = orderline.get_quantity();
                var subtotal = price_unit * quantity;

                var product =  orderline.get_product();
                var taxes_ids = product.taxes_id;
                var taxes =  orderline.pos.taxes;
                var product_taxes = [];

                _(taxes_ids).each(function(el){
                    product_taxes.push(_.detect(taxes, function(t){
                        return t.id === el;
                    }));
                });

                if (product_taxes.find(({ amount }) => amount === 12) !== undefined) {
                    total_untaxed_by_tax_id['12'] += subtotal;
                }

                if (product_taxes.find(({ amount }) => amount === 0) !== undefined) {
                    total_untaxed_by_tax_id['0'] += subtotal;
                }
            });

            this.el.querySelector('#hbs-taxes-0 > .value').textContent = this.format_currency(total_untaxed_by_tax_id['0']);
            this.el.querySelector('#hbs-taxes-12 > .value').textContent = this.format_currency(total_untaxed_by_tax_id['12']);
        },
    });

  });
