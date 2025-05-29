"use strict";

const fetch = require("node-fetch");
const { XML_API_BASE_URL } = require("./constants");

/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

/** @type {ServiceSchema} */
module.exports = {
	name: "companies",

	/**
	 * Settings
	 */
	settings: {

	},

	/**
	 * Dependencies
	 */
	dependencies: [],

	/**
	 * Actions
	 */
	actions: {

		/**
		 * Return company detail by id
		 *
		 * @param {String} id - Company ID
		 * @returns {Object} Company detail
		 */
		getDetailById: {
			rest: "GET /:id",
			/** @param {Context} ctx  */
			async handler(ctx) {
				try {
					const response = await fetch(XML_API_BASE_URL + `/${ctx.params.id}.xml`);
					const data = await response.text();

					if (!response.ok) {
						ctx.meta.$statusCode = response.status;
						ctx.meta.$statusMessage = response.statusText;

						return {
							error: `Status: ${response.status} | StatusText: ${response.statusText}`,
							error_description: data
						};
					}

					return {
						id: this.extractCompanyId(data),
						name: this.extractCompanyName(data),
						description: this.extractCompanyDescription(data)
					};
				} catch (error) {
					console.error(error);

					return {
						error,
						error_description: error.message
					};
				}
			}
		}
	},

	/**
	 * Events
	 */
	events: {

	},

	/**
	 * Methods
	 */
	methods: {
		extractCompanyId(xmlCompanyDetail) {
			const match = xmlCompanyDetail && xmlCompanyDetail.match(/<id>(\d+)<\/id>/);

			return match ? match[1] : undefined;
		},

		extractCompanyName(xmlCompanyDetail) {
			const match = xmlCompanyDetail && xmlCompanyDetail.match(/<name>([^<]+)<\/name>/);

			return match ? match[1] : undefined;
		},

		extractCompanyDescription(xmlCompanyDetail) {
			const match = xmlCompanyDetail && xmlCompanyDetail.match(/<description>([^<]+)<\/description>/);

			return match ? match[1] : undefined;
		}
	},

	/**
	 * Service created lifecycle event handler
	 */
	created() {

	},

	/**
	 * Service started lifecycle event handler
	 */
	async started() {

	},

	/**
	 * Service stopped lifecycle event handler
	 */
	async stopped() {

	}
};
