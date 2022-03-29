/**
 * @jest-environment jsdom
 */
import { jest } from "@jest/globals";
import { Languages } from "../src/languages";

describe("Languages Store", () => {
  const users = ["1", "2"];

  beforeEach(() => {
    jest.spyOn(global.console, "warn").mockImplementation(() => {});
  });

  afterEach(async () => {
    users.forEach(async (userId) => {
      (await Languages.getAll(userId)).forEach(async ({ id }) => {
        await Languages.delete({ userId, id });
      });
    });
  });

  describe("Add method", () => {
    it("Should exists", () => {
      expect(Languages.add).toBeDefined();
    });

    it("Should add a language for a specific user", async () => {
      const [userId] = users;
      let languages = await Languages.getAll(userId);
      expect(languages.length).toEqual(0);
      const [l] = await Languages.add({
        userId,
        label: "English",
      });

      languages = await Languages.getAll(userId);
      expect(languages.length).toEqual(1);
      expect(l.id).toBeDefined();

      await Languages.delete({ userId, id: l.id });
    });

    it("Should throw an Error if userId is not specified", async () => {
      expect(Languages.add({ label: "French" })).rejects.toEqual(
        new Error(`Error: prop userId is missing in {"label":"French"}.`)
      );
    });

    it("Should order language list after add a new one", async () => {
      const [userId] = users;
      await Languages.add({
        userId,
        label: "French",
      });

      await Languages.add({
        userId,
        label: "Albanese",
      });

      const l = await Languages.add({
        userId,
        label: "German",
      });

      const [albanese, french, german] = l;
      expect(albanese.label).toEqual("Albanese");
      expect(french.label).toEqual("French");
      expect(german.label).toEqual("German");

      (await Languages.getAll(userId)).forEach(async ({ id }) => {
        await Languages.delete({ userId, id });
      });
    });

    it("Should not duplicate language if already existing", async () => {
      const [userId] = users;

      await Languages.add({
        userId,
        label: "French",
        code: "fr",
      });

      // Match on the code
      await Languages.add({
        userId,
        label: "French@different-label",
        code: "fr",
      });

      // Match on the label only
      await Languages.add({
        userId,
        label: "French",
      });

      const l = await Languages.getAll(userId);
      expect(l.length).toEqual(1);
    });
  });

  describe("Get method", () => {
    it("Should exists", () => {
      expect(Languages.get).toBeDefined();
    });

    it("Should return a language", async () => {
      const [userId] = users;
      const [l] = await Languages.add({ userId, label: "french" });
      const language = await Languages.get({ userId, id: l.id });
      expect(language.id).toEqual(l.id);
    });

    it("Should return undefined if language is not defined", async () => {
      const [userId] = users;
      expect(await Languages.get({ userId, id: "" })).not.toBeDefined();
    });

    it("Should return undefined if the language exists but not for the requested user", async () => {
      const [userZeroId, userOneId] = users;
      const [l] = await Languages.add({
        userId: userZeroId,
        label: "french",
      });

      expect(
        await Languages.get({ userId: userOneId, id: l.id })
      ).not.toBeDefined();
    });

    it("Should be able to find a language by his code", async () => {
      const [userId] = users;
      await Languages.add({
        userId,
        label: "French",
        code: "fr",
      });

      const l = await Languages.get({ userId, code: "fr" });
      expect(l.label).toEqual("French");
    });
  });

  describe("GetAll method", () => {
    it("Should exists", () => {
      expect(Languages.getAll).toBeDefined();
    });

    it("Should return empty array if no languages exists", async () => {
      const [userId] = users;
      const languages = await Languages.getAll(userId);
      expect(languages.length).toEqual(0);
    });

    it("Should return list of existing languages", async () => {
      const [userId] = users;
      ["French", "German"].forEach(async (label) => {
        await Languages.add({ userId, label });
      });

      const languages = await Languages.getAll(userId);
      expect(languages.length).toEqual(2);

      languages.forEach(async ({ id }) => {
        await Languages.delete({ userId, id });
      });
    });

    it("Should throw an Error if userId argument missing", () => {
      expect(Languages.getAll(undefined)).rejects.toEqual(
        new Error(`Error: userId argument is required.`)
      );
    });
  });

  describe("Delete method", () => {
    it("Should exists", () => {
      expect(Languages.delete).toBeDefined();
    });

    it("should delete a language", async () => {
      const userId = users[0];
      const l = await Languages.add({
        userId,
        label: "French",
      });

      expect(l).toBeDefined();
      const { id } = l;
      await Languages.delete({ userId, id });
      const deletedLanguage = await Languages.get({ userId, id });
      expect(deletedLanguage).not.toBeDefined();
    });

    it("should delete only targeted language", async () => {
      const [uZeroId, uOneId] = users;
      await Languages.add({
        userId: uZeroId,
        label: "French",
      });

      const l = await Languages.add({
        userId: uOneId,
        label: "French",
      });

      const { id } = l[0];
      await Languages.delete({ userId: uOneId, id });
      expect((await Languages.getAll(uOneId)).length).toEqual(0);
      expect((await Languages.getAll(uZeroId)).length).not.toEqual(0);
    });
  });
});
