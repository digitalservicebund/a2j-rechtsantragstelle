import {
  autoSuggestStreetNames,
  autoSuggestStringRequiredSchema,
} from "~/services/validation/autoSuggest";
import { getDataListArgumentToAutoSuggestionInput } from "../getDataListArgumentToAutoSuggestionInput";

describe("getDataListArgumentToAutoSuggestionInput", () => {
  it("should return an empty string when dataListType is not 'streetNames'", () => {
    const fieldSchema = autoSuggestStringRequiredSchema("airlines");
    const userData = {
      zipCode1: "12345",
      zipCode2: "67890",
    };

    const result = getDataListArgumentToAutoSuggestionInput(
      fieldSchema,
      userData,
    );

    expect(result).toBe("");
  });

  it("should return the value of the first non-empty field in userData that is listed in dataListArguments when dataListType is 'streetNames'", () => {
    const fieldSchema = autoSuggestStreetNames(["zipCode1", "zipCode2"]);

    const userData = {
      zipCode1: "",
      zipCode2: "12345",
    };

    const result = getDataListArgumentToAutoSuggestionInput(
      fieldSchema,
      userData,
    );

    expect(result).toBe("12345");
  });

  it("should return an empty string when dataListArguments is empty", () => {
    const fieldSchema = autoSuggestStreetNames([]);
    const userData = {
      zipCode1: "12345",
      zipCode2: "67890",
    };

    const result = getDataListArgumentToAutoSuggestionInput(
      fieldSchema,
      userData,
    );

    expect(result).toBe("");
  });

  it("should return an empty string when none of the fields in dataListArguments have a non-empty value in userData", () => {
    const fieldSchema = autoSuggestStreetNames(["zipCode1", "zipCode2"]);
    const userData = {
      zipCode1: "",
      zipCode2: "",
    };

    const result = getDataListArgumentToAutoSuggestionInput(
      fieldSchema,
      userData,
    );

    expect(result).toBe("");
  });
});
