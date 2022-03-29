/**
 * @jest-environment jsdom
 */
import { jest } from "@jest/globals";
import { setItem, getItem } from "../src/helpers";

describe("Helpers", () => {
  let getItemRef, setItemRef;
  beforeEach(() => {
    getItemRef = global.Storage.prototype.getItem;
    setItemRef = global.Storage.prototype.setItem;
  });

  describe("GetItem", () => {
    it("Should get a value stored", () => {
      setItem("key", "value");
      const value = getItem("key");
      expect(value).toEqual("value");
    });

    it("Should return a default value if the value requested is not defined", () => {
      const defaultValue = "@defaultValue";
      const item = getItem("@fakeKey", defaultValue);
      expect(item).toEqual(defaultValue);
    });

    it("Should console a warning if an exception in the localStorage process occured", () => {
      const spy = jest
        .spyOn(global.console, "warn")
        .mockImplementationOnce(() => {});

      global.Storage.prototype.getItem = jest.fn((k, v) => {
        throw new Error("");
      });

      getItem("@fake");
      expect(spy).toHaveBeenCalled();
    });

    it("Should parse value", () => {
      const k = "@key-store";
      setItem(k, ["value"], true);
      const spy = jest.spyOn(JSON, "parse");
      getItem(k, [], true);
      expect(spy).toHaveBeenCalled();
    });
  });

  describe("SetItem", () => {
    it("Should store a value in localStorage", () => {
      setItem("key", "value");
      const value = getItem("key");
      expect(value).toEqual("value");
    });

    it("Should log a warning if an exception in the localStorage process occured", () => {
      const spy = jest
        .spyOn(global.console, "warn")
        .mockImplementationOnce(() => {});

      global.Storage.prototype.setItem = jest.fn((k, v) => {
        throw new Error("");
      });

      setItem("key", "value");
      expect(spy).toHaveBeenCalled();
    });

    it("Should stringify the value before storage it", () => {
      const spy = jest.spyOn(JSON, "stringify");
      setItem("key", ["value"], true);
      expect(spy).toHaveBeenCalled();
    });
  });

  afterEach(() => {
    global.Storage.prototype.getItem = getItemRef;
    global.Storage.prototype.setItem = setItemRef;
  });
});
