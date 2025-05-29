"use strict";

jest.mock("node-fetch");
const { ServiceBroker } = require("moleculer");
const { ValidationError } = require("moleculer").Errors;
const TestService = require("../../../services/companies.service");
const fetch = require('node-fetch');

describe("Test 'companies' service", () => {
	const broker = new ServiceBroker({ logger: false });
	broker.createService(TestService);


	afterEach(() => {
		jest.clearAllMocks();
	});

	beforeAll(() => broker.start());
	afterAll(() => broker.stop());

	describe("Test 'companies.getDetailById' action", () => {
		it("should return with mock company 1", async () => {
			const company1 = {
				id: "1",
				name: 'MWNZ',
				description: "..is awesome",
			}

			fetch.mockResolvedValue({
				text: jest.fn().mockResolvedValue(`<company><id>${company1.id}</id><name>${company1.name}</name><description>${company1.description}</description></company>`),
				ok: true,
				status: 200,
			});

			const res = await broker.call("companies.getDetailById", { id: "1" });
			expect(res.status).toEqual(200);
			expect(res.data).toContain(company1.name);

			expect(fetch).toHaveBeenCalledWith(expect.stringContaining("/xml-api/1.xml"));
			expect(fetch).toHaveBeenCalledTimes(1);
		});

		it("should return 404 from upstream xml api", async () => {
			fetch.mockResolvedValue({
				text: jest.fn().mockResolvedValue(),
				ok: false,
				status: 404,
			});

			const res = await broker.call("companies.getDetailById", { id: "999" });
			expect(res.status).toEqual(404);
			expect(fetch).toHaveBeenCalledWith(expect.stringContaining("/xml-api/999.xml"));
			expect(fetch).toHaveBeenCalledTimes(1);
		});

		it("should throw an error if fetch fails", async () => {
			fetch.mockRejectedValue(new Error("Network error"));

			await expect(broker.call("companies.getDetailById", { id: "1" })).rejects.toThrow("Network error");
			expect(fetch).toHaveBeenCalledWith(expect.stringContaining("/xml-api/1.xml"));
			expect(fetch).toHaveBeenCalledTimes(1);
		});
	});
});

