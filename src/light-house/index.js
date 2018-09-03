const { launchChromeAndRunLighthouse, createReport } = require('./utils');
const logger = require('../utils/logger');

const filterResults = (data) => {

	const { categories = {}, audits = {} } = data;

	const { metrics } = audits;
	const { details = {} } = metrics;
	const { items = [] } = details;
	const metricItems = items[0] || {};

	const report = {};

	for (const categoryName in categories) {

		if (!Object.prototype.hasOwnProperty.call(categories, categoryName)) {
			continue;
		}

		const category = categories[categoryName];
		report[`${category.id}-score`] = Math.round(category.score * 100);
	}


	for (const metricItem in metricItems) {

		if (!Object.prototype.hasOwnProperty.call(metricItems, metricItem)) {
			continue;
		}

		// For now don't report on any observered metrics
		if (metricItem.indexOf('observed') === -1) {
			const metric = metricItems[metricItem];
			report[metricItem] = metricItems[metricItem];
		}
	}

	return report;


};

const fs = require('fs');


module.exports = {
	getData: async (url) => {

		try {

			logger.info(`Getting data for ${url}`)

			const lighthouse = await launchChromeAndRunLighthouse(url, {
				extends: 'lighthouse:default',
				// Can add other things here, to throttle connections (Maybe maybe differnt connect types and report on them in the long run)
			}) || {};

			logger.info(`Successfully got data for ${url}`)

			return Promise.resolve(filterResults(lighthouse.lhr));

		} catch (err) {
			logger.error(`Failed to get data for ${url}`);
		}



	}
}