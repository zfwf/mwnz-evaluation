"use strict";

const fetch = require('node-fetch');
const { XML_API_BASE_URL } = require('./constants');

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
			rest: "/{id}",
			/** @param {Context} ctx  */
			async handler(ctx) {
				try {
					const response = await fetch(XML_API_BASE_URL + `${ctx.params.id}.xml`);
					const data = await response.text();

					return {
						status: response.status,
						data
					};
				} catch (error) {
					console.error(error);

					throw error;
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
