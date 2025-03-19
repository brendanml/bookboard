export const loginHelper = async (email, password, page) => {
  await page.goto("/account/login")
  await page.fill("input[name=email]", email)
  await page.fill("input[name=password]", password)
  await page.getByRole("button", { name: "Login" }).click()
}

export const registerHelper = async (user, page) => {
  await page.goto("/account/register")
  await page.fill("input[name=firstname]", user.firstname)
  await page.fill("input[name=lastname]", user.lastname)
  await page.fill("input[name=email]", user.email)
  await page.fill("input[name=password]", user.password)
  await page.fill("input[name=postalcode]", user.postalcode)
  await page.click("button[type=submit]")
}
