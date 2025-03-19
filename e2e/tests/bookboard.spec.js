import { test, expect } from "@playwright/test"

import { loginHelper, registerHelper } from "../utils/helper"
import { title } from "process"

const defaultUser = {
  firstname: "Brendan",
  lastname: "Eich",
  email: "brendan@gmail.com",
  password: "secretpassword",
  postalcode: "12345",
}

const existingUser = {
  firstname: "John",
  lastname: "Doe",
  email: "jdoe@gmail.com",
  password: "password",
  postalcode: "12345",
}

test.describe("bookboard app", () => {
  test.beforeEach(async ({ page, context }) => {
    const res = await context.request.post("/api/reset")
    const existingUserRes = await context.request.post("/api/user/register", {
      data: existingUser,
    })
    // console.log(res)
  })
  test("home page is visible", async ({ page }) => {
    await page.goto("/")
    await expect(page.getByRole("heading", { name: "Home" })).toBeVisible()
  })
  test.describe("register", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto("/account/register")
    })
    test("register is visible", async ({ page }) => {
      await expect(
        page.getByRole("heading", { name: "Register" })
      ).toBeVisible()
      await expect(page.locator("input[name=firstname]")).toBeVisible()
      await expect(page.locator("input[name=lastname]")).toBeVisible()
      await expect(page.locator("input[name=email]")).toBeVisible()
      await expect(page.locator("input[name=password]")).toBeVisible()
      await expect(page.locator("input[name=postalcode]")).toBeVisible()
    })
    test("register success", async ({ page }) => {
      await page.fill("input[name=firstname]", defaultUser.firstname)
      await page.fill("input[name=lastname]", defaultUser.lastname)
      await page.fill("input[name=email]", defaultUser.email)
      await page.fill("input[name=password]", defaultUser.password)
      await page.fill("input[name=postalcode]", defaultUser.postalcode)
      await page.getByRole("button", { name: "Register" }).click()
      await page.waitForURL("**/login")
      await expect(page.getByRole("button", { name: "Login" })).toBeVisible()
      await expect(page.getByText("User created successfully")).toBeVisible()
    })
    test.describe("login", () => {
      test.beforeEach(async ({ page }) => {
        await registerHelper(defaultUser, page)
        await page.goto("/account/login")
      })
      test("login is visible", async ({ page }) => {
        await expect(page.locator("input[name=email]")).toBeVisible()
        await expect(page.locator("input[name=password]")).toBeVisible()
        await expect(page.getByRole("button", { name: "Login" })).toBeVisible()
      })
      test("login success", async ({ page }) => {
        await page.fill("input[name=email]", existingUser.email)
        await page.fill("input[name=password]", existingUser.password)
        await page.getByRole("button", { name: "Login" }).click()
        await expect(page.getByRole("heading", { name: "Home" })).toBeVisible()
        await expect(
          page.getByText("User logged in successfully")
        ).toBeVisible()
      })
      test("login fail", async ({ page }) => {
        await page.fill("input[name=email]", defaultUser.email)
        await page.fill("input[name=password]", "wrongpassword")
        await page.getByRole("button", { name: "Login" }).click()
        // await page.waitForTimeout(1000)
        await expect(page.getByText("Problem logging in")).toBeVisible()
      })
      test.describe("once logged in", async () => {
        test.beforeEach(async ({ page, context }) => {
          await loginHelper(existingUser.email, existingUser.password, page)
        })
        test("... user can logout", async ({ page }) => {
          await page.waitForLoadState("networkidle")

          await page.getByTestId("profile-trigger").click()
          await page.click("text=Logout")
          await expect(page.getByText("Login").first()).toBeVisible()
        })
        test("...user can view add item page", async ({ page }) => {
          await page.getByTestId("add-item-nav").click()
          await expect(page.locator("input[name=title]")).toBeVisible()
          await expect(page.locator("input[name=quantity]")).toBeVisible()
          await expect(page.locator("input[name=price]")).toBeVisible()
          await expect(page.locator("textarea[name=description]")).toBeVisible()
        })
        test("user can submit an item", async ({ page }) => {
          await page.goto("/listings/create")
          await page.locator("input[name=title]").fill("monopoly")
          await page.locator("input[name=quantity]").fill("1")
          await page.locator("input[name=price]").fill("10")
          await page.locator("textarea[name=description]").fill("board game")
          await page.click("button[type=submit]")
        })
      })
    })
  })
})
