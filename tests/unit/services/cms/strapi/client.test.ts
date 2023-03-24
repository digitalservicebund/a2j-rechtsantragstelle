import Client from "~/services/cms/strapi/client";

jest.mock("axios");

//Write tests for class Client in ~/services/cms/strapi/client.ts
const strapiUrl = "http://localhost:1337";

it("should return an error if the request fails", async () => {
    expect.assertions(1);

    const error = new Error("Request failed with status code 404");
    const mockAxios = require("axios");
    mockAxios.get.mockImplementationOnce(() => Promise.reject(error));

    try {
        await new Client(strapiUrl).getDocument("test", {});
    } catch (error) {
        expect(error).toEqual(error);
    }
});

it("should return the right response data", async () => {
    const strapiResponse = {
        attributes: {
            value: "test"
        }
    }
    const mockAxios = require("axios");
    mockAxios.get.mockImplementationOnce(() => Promise.resolve({ data: {data: strapiResponse}}));

    const result = await new Client(strapiUrl).getDocument("test", {});

    expect(result).toEqual(strapiResponse);
});

it("should return the first data if the response is a array of documents", async () => {
    const strapiResponse = {
        attributes: {
            value: "test"
        }
    }

    const mockAxios = require("axios");
    mockAxios.get.mockImplementationOnce(() => Promise.resolve({ data: { data: [strapiResponse, undefined] }}));

    const result = await new Client(strapiUrl).getDocument("test", {});

    expect(result).toEqual(strapiResponse);
});
