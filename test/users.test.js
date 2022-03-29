/**
 * @jest-environment jsdom
 */
import { jest } from "@jest/globals";
import { Users } from "../src/users";

describe("Users Store", () => {
  const data = {
    email: "fg@gmail.com",
    firstName: "firstName",
    lastName: "lastName",
  };

  let id;

  test("Users.get should exists", () => {
    expect(Users.get).toBeDefined();
  });

  test("Users.register should exists", () => {
    expect(Users.register).toBeDefined();
  });

  test("Users.get return a user", async () => {
    const u = await Users.register({ ...data });
    id = u.id;
    const user = await Users.get({ id: u.id });
    expect(user.id).toEqual(u.id);
  });

  test("Users.get return undefined if user not exists", async () => {
    const user = await Users.get({ id: "@fakeId" });
    expect(user).toBe(undefined);
  });

  test("Users.get support id as match property", async () => {
    const user = await Users.get({ id });
    expect(user).toBeDefined();
  });

  test("Users.get support email as match property", async () => {
    const user = await Users.get({ email: data.email });
    expect(user).toBeDefined();
  });

  test("Users.register update connexion of an existing user", async () => {
    jest.spyOn(global.console, "warn").mockImplementation(() => {});
    const u = await Users.register({ ...data });
    expect(u.connections).not.toEqual(0);
  });

  test("User.register should not impacted other users", async () => {
    const email = "user@gmail.com";
    const u = await Users.register({
      email,
      firstName: "userFirstName",
      lastName: "userLastName",
    });

    expect(u.connections).toEqual(0);
    await Users.register({ ...data });
    await Users.register({ ...data });
    const userLogged = await Users.register({ ...data });
    expect(userLogged.connections).not.toEqual(0);
    const userNotLogged = await Users.get({ email });
    expect(userNotLogged.connections).toEqual(0);
  });

  test("Users.register return user added or updated", async () => {
    const u = await Users.register({ ...data });
    expect(u.id).toEqual(id);
  });
});
