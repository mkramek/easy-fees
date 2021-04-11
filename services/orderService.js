class OrderService {
	constructor (order) {
		this.order = order;
	}
	getOrderId() {
		return this.order.orderId;
	}

    getLineItemId() {
    	return this.order.lineItems[0].lineItemId;
    }

    getShippingPaidByBuyer() {
    	return parseFloat(this.order.lineItems[0].deliveryCost.shippingCost.value);
    }

    getCompleteSoldForPriceSalesTax() {
    	return this.getSoldForPrice() + this.getSalesTax();
    }

    getCompleteSoldForPriceSalesTaxShippingPaidByBuyer() {
    	return this.getSoldForPrice() + this.getSalesTax() + this.getShippingPaidByBuyer();
    }

    getSalesTax() {
    	return this.order.lineItems[0].taxes.length ? parseFloat(this.order.lineItems[0].taxes[0].amount.value) : 0;
    }

    getSoldForPrice() {
    	return parseFloat(this.order.lineItems[0].lineItemCost.value);
    }

    getEbayFee() {
    	return parseFloat(this.order.totalMarketplaceFee.value);
    }

    getPaypalFee1() {
    	return 0.027 * this.getCompleteSoldForPriceSalesTaxShippingPaidByBuyer();
    }

    getPaypalFee2() {
    	return 0.3; // always $0.30
    }

    getPaypalFeeTotal() {
    	return this.getPaypalFee1() + this.getPaypalFee2();
    }

    getTotalFeesCollectedByEbay() {
    	return parseFloat(this.order.totalMarketplaceFee.value);
    }

    getPromotedListingsFeePercent() {
    	return 0;
    }

    getPromotedListingsFee() {
    	return 0;
    }

    getEbayTaxPercentCollected() {
    	return this.getSalesTax() / (this.getShippingPaidByBuyer() + this.getSoldForPrice());
    }

    getTaxesCollectedByEbay() {
    	return this.getSalesTax();
    }

    getFeeTotal() {
    	return this.getEbayFee() + this.getPaypalFeeTotal() + this.getPromotedListingsFee();
    }

    getCostOfItem() {
    	return 0;
    }

    getShippingFee() {
    	return this.getShippingPaidByBuyer();
    }

    getCompleteAmountOwed() {
    	return this.getFeeTotal() + this.getCostOfItem() + this.getTaxesCollectedByEbay();
    }

    getFrontEndProfit() {
    	return this.getCompleteSoldForPriceSalesTaxShippingPaidByBuyer() - this.getCompleteAmountOwed();
    }

    getTotalProfitPercent() {
    	return this.getFrontEndProfit() / this.getCompleteSoldForPriceSalesTaxShippingPaidByBuyer();
    }

    getCashBackProfitPercent() {
    	return 0.02;
    }

    getCompleteTotalProfitWithCashbackCreditCard() {
    	return this.getFrontEndProfit() + this.getCashBackProfitPercent() * this.getCompleteSoldForPriceSalesTaxShippingPaidByBuyer();
    }

    getCompleteTotalProfitPercentWithCashbackCreditCard() {
    	return this.getCompleteTotalProfitWithCashbackCreditCard() / this.getCompleteSoldForPriceSalesTaxShippingPaidByBuyer();
    }

    getCancelled() {
    	return false;
    }

    getFullReturn() {
    	return false;
    }

    getPartialReturn() {
		return false;
    }
}

module.exports = OrderService;