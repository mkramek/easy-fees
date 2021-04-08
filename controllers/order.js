require('dotenv').config();
const axios = require('axios');

const EBAY_API_URL = process.env.EBAY_ENV === 'PRODUCTION' ? 'https://api.ebay.com/sell/fulfillment/v1/order' : 'https://api.sandbox.ebay.com/sell/fulfillment/v1/order';
const EBAY_API_PARAMS = '?fieldGroups=TAX_BREAKDOWN';

exports.getOrder = (req, res, next) => {
    const access_token = req.query.access_token;
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
    const orderID = req.params.id;  
    axios.get(`${EBAY_API_URL}/${orderID}/${EBAY_API_PARAMS}`).then((response) => {
        const order = response.data;
        res.status(200).send({
            error: false,
            message: '',
            orderID: orderID,
            currency: order.total.currency,
            items: order.lineItems.map((lineItem) => {
                return {
                    itemID: lineItem.lineItemId,
                    costs: {
                        item: lineItem.lineItemCost.value,
                        delivery: lineItem.deliveryCost.map((cost) => {
                            return {
                                type: cost,
                                amount: cost.value
                            }
                        }),
                        total: lineItem.total.value
                    },
                    taxes: {
                        nonEbay: order.taxes.map((tax) => {
                            return {
                                type: tax.taxType,
                                amount: tax.amount.value,
                            }
                        }),
                        ebay: order.ebayCollectAndRemitTaxes.map((ebayTax) => {
                            return {
                                type: ebayTax.taxType,
                                amount: ebayTax.amount.value,
                                netOrGross: ebayTax.collectionType
                            }
                        })
                    }
                }
            }),
            orderTotal: order.paymentSummary.totalDueSeller.value,
            payment: {
                methods: order.paymentSummary.payments.map((payment) => {
                    return {
                        name: payment.paymentMethod,
                        amount: payment.amount.value
                    };
                }),
            }
        });
    });
};

exports.getAllOrders = (req, res, next) => {
    axios.defaults.headers.common['Authorization'] = `Bearer ${req.body.token}`;
    axios.get(EBAY_API_URL).then((response) => {
        const orders = response.data;
        const ids = orders.orders.map((item, index) => {
            return item.orderId;
        });
        res.status(200).send({
            orders: ids
        });
    }).catch((error) => {
        res.status(500).send({
            error: true,
            message: error
        });
    });
};

exports.getOrderAdditionalCosts = (req, res, next) => {
    const orderID = req.params.id;
    axios.get(`${EBAY_API_URL}/${orderID}/${EBAY_API_PARAMS}`).then((response) => {
        const order = response.data;
        res.status(200).send({
            error: false,
            message: '',
            orderID: orderID,
            currency: order.total.currency,
            items: order.lineItems.map((lineItem) => {
                return {
                    itemID: lineItem.lineItemId,
                    costs: {
                        item: lineItem.lineItemCost.value,
                        delivery: lineItem.deliveryCost.map((cost) => {
                            return {
                                type: cost,
                                amount: cost.value
                            }
                        }),
                        itemTotal: lineItem.total.value
                    },
                    taxes: {
                        nonEbay: order.taxes.map((tax) => {
                            return {
                                type: tax.taxType,
                                amount: tax.amount.value,
                            }
                        }),
                        ebay: order.ebayCollectAndRemitTaxes.map((ebayTax) => {
                            return {
                                type: ebayTax.taxType,
                                amount: ebayTax.amount.value,
                                netOrGross: ebayTax.collectionType
                            }
                        })
                    }
                }
            }),
        });
    });
};
