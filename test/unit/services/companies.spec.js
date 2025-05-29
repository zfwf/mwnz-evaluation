"use strict";

jest.mock("node-fetch");
const { ServiceBroker } = require("moleculer");
const { ValidationError } = require("moleculer").Errors;
const TestService = require("../../../services/companies.service");
const fetch = require('node-fetch');

describe("Test 'companies' service", () => {
	const broker = new ServiceBroker({ logger: false });
	const service = broker.createService(TestService);


	afterEach(() => {
		jest.clearAllMocks();
	});

	beforeAll(() => broker.start());
	afterAll(() => broker.stop());

	describe("Test 'extractCompanyId' methods", () => {
		it("should extract company ID", () => {
			const id = service.extractCompanyId('<id>1</id>');
			expect(id).toBe("1");
		});

		it("should extract company ID as undefined when xml source is malformed", () => {
			const id = service.extractCompanyId('<id>1</>');
			expect(id).toBe(undefined);
		});
	});

	describe("Test 'extractCompanyName' methods", () => {
		it("should extract company name", () => {
			const name = service.extractCompanyName('<name>a great name</name>');
			expect(name).toBe("a great name");
		});

		it("should extract company name as undefined when xml source is malformed", () => {
			const name = service.extractCompanyName('<name>a great name</>');
			expect(name).toBe(undefined);
		});
	});

	describe("Test 'extractCompanyDescription' methods", () => {
		it("should extract company description", () => {
			const description = service.extractCompanyDescription('<description>...is great</description>');
			expect(description).toBe("...is great");
		});

		it("should extract company description as undefined when xml source is malformed", () => {
			const description = service.extractCompanyDescription('<description>...is great</>');
			expect(description).toBe(undefined);
		});
	});

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
			expect(JSON.stringify(res)).toContain(company1.name);

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
			expect(res.error).toContain("404");
			expect(fetch).toHaveBeenCalledWith(expect.stringContaining("/xml-api/999.xml"));
			expect(fetch).toHaveBeenCalledTimes(1);
		});

		it("should return an error if fetch fails", async () => {
			fetch.mockRejectedValue(new Error("Network error"));

			const res = await broker.call("companies.getDetailById", { id: "1" });
			expect(res).toEqual({
				error: expect.any(Error),
				error_description: "Network error"
			});
			expect(fetch).toHaveBeenCalledWith(expect.stringContaining("/xml-api/1.xml"));
			expect(fetch).toHaveBeenCalledTimes(1);
		});

		it("should return with mock company 1 in JSON", async () => {
			const company1 = {
				id: "1",
				name: 'MWNZ',
				description: "..is awesome",
			}

			const company1XML = `<company><id>${company1.id}</id><name>${company1.name}</name><description>${company1.description}</description></company>`;

			fetch.mockResolvedValue({
				text: jest.fn().mockResolvedValue(company1XML),
				ok: true,
				status: 200,
			});

			const res = await broker.call("companies.getDetailById", { id: "1" });
			expect(res).toEqual(company1);
		});

	});
});

