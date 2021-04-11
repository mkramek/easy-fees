exports.buildUrl = path => {
	let API_SUBDOMAIN = 'api';
	const EBAY_DOMAIN = `${process.env.EBAY_ENV === 'PRODUCTION' ? 'ebay.com' : 'sandbox.ebay.com'}`;
	if (path.includes('finances')) {
		API_SUBDOMAIN = 'apiz'
	}
	const rootPath = `https://${API_SUBDOMAIN}.${EBAY_DOMAIN}`;
	return `${rootPath}${path}`;
};