require('dotenv').config();
const axios = require('axios');
const urlBuilder = require('../helpers/urlBuilder');
const arrayChunk = require('../helpers/arrayChunk')
const EBAY_API_URL = urlBuilder.buildUrl('/sell/fulfillment/v1/order');
const EBAY_API_PARAMS = '?fieldGroups=TAX_BREAKDOWN';
const EBAY_FINANCES_API = urlBuilder.buildUrl('/sell/finances/v1/transaction?limit=1000');
const OrderService = require('../services/orderService');

exports.getOrderFees = (req, res, next) => {
    axios.defaults.headers.common['Authorization'] = req.headers.authorization;
    axios.get(EBAY_FINANCES_API).then((response) => {
        console.log('getOrderFees - before filter + map');
        const orderIds = response.data.transactions.filter(x => x.orderId != null).map((transaction) => transaction.orderId);
        let promises = [];
        let orders = [];
        orderIds.arrayChunk(50).map((orderChunk) => {
            const requestUrl = `${EBAY_API_URL}?orderIds=${orderChunk}&limit=1000&fieldGroups=TAX_BREAKDOWN`;
            console.log(`requestUrl: ${requestUrl}`);
            promises.push(
                axios.get(requestUrl).then(response => {
                    console.log(`response: ${JSON.stringify(response.data.orders)}`);
                    response.data.orders.forEach(order => {
                        orders.push(order);
                    });
                })
            );
        });
        Promise.all(promises).then(() => {
            console.log(`orders - before: ${JSON.stringify(orders)}`);
            let orderFees = [];
            orders.forEach(order => {
                let orderService = new OrderService(order);
                orderFees.push({
                    orderId : orderService.getOrderId(),
                    lineItemId: orderService.getLineItemId(),
                    shippingPaidByBuyer: orderService.getShippingPaidByBuyer(),
                    completeSoldForPriceSalesTax: orderService.getCompleteSoldForPriceSalesTax(),
                    completeSoldForPriceSalesTaxShippingPaidByBuyer: orderService.getCompleteSoldForPriceSalesTaxShippingPaidByBuyer(),
                    salesTax: orderService.getSalesTax(),
                    soldForPrice: orderService.getSoldForPrice(),
                    ebayFee: orderService.getEbayFee(),
                    paypalFee1: orderService.getPaypalFee1(),
                    paypalFee2: orderService.getPaypalFee2(),
                    paypalFeeTotal: orderService.getPaypalFeeTotal(),
                    totalFeesCollectedByEbay: orderService.getTotalFeesCollectedByEbay(),
                    promotedListingsFeePercent: orderService.getPromotedListingsFeePercent(),
                    promotedListingsFee: orderService.getPromotedListingsFee(),
                    ebayTaxPercentCollected: orderService.getEbayTaxPercentCollected(),
                    taxesCollectedByEbay: orderService.getTaxesCollectedByEbay(),
                    feeTotal: orderService.getFeeTotal(),
                    costOfItem: orderService.getCostOfItem(),
                    shippingFee: orderService.getShippingFee(),
                    completeAmountOwed: orderService.getCompleteAmountOwed(),
                    frontEndProfit: orderService.getFrontEndProfit(),
                    totalProfitPercent: orderService.getTotalProfitPercent(),
                    cashBackProfitPercent: orderService.getCashBackProfitPercent(),
                    completeTotalProfitWithCashbackCreditCard: orderService.getCompleteTotalProfitWithCashbackCreditCard(),
                    completeTotalProfitPercentWithCashbackCreditCard: orderService.getCompleteTotalProfitPercentWithCashbackCreditCard(),
                    cancelled: orderService.getCancelled(),
                    fullReturn: orderService.getFullReturn(),
                    partialReturn: orderService.getPartialReturn()
                })
            });
            res.status(200).send({
                orderFees: orderFees
            });
        });
    });
};
