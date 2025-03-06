import { test, expect } from "@playwright/test";
import { generateTestId, randDate } from "./testUtils";
import { VALIDATION_MESSAGES } from "../src/constants/validationMessages";
import { format } from "date-fns";
import { DATE_FORMATS } from "../src/lib/utils";

const baseURL = process.env.APP_URL;
const familyId = process.env.TEST_FAMILY_ID;
// Use authenticated state for all tests
test.use({ storageState: "./playwright/.auth/user.json" });
const momentId = process.env.TEST_MOMENT_ID;

// Intended to run in sequence, test creats, updates, then deletes a pet record usiong previously created family and moment.
test.describe("Pet Form", () => {
  const petName = generateTestId("pet");
  const startDate = randDate();
  const updatedPetName = `${petName} Updated`;
  const updatedStartDate = randDate();
  let petId;

  test("creates a new pet with all fields", async ({ page }) => {
    await page.goto(`${baseURL}/app/family/${familyId}/pet/add`);

    await page.getByTestId("name-input").fill(petName);
    await page
      .getByTestId("start-date-input")
      .fill(format(startDate, DATE_FORMATS.US));
    await page
      .getByTestId("description-input")
      .fill("Test pet description");
    await page.getByTestId("save-button").click();

    // pause 1 second to allow the page to load
    await page.waitForTimeout(1000);
    await page.goto(`/app/family/${familyId}`);
    await expect(page.getByText(petName)).toBeVisible();
  });

  test("shows validation error for short name", async ({ page }) => {
    await page.goto(`${baseURL}/app/family/${familyId}/pet/add`);

    await page.getByTestId("name-input").fill("A");
    await page.getByTestId("save-button").click();

    await expect(
      page.getByText(VALIDATION_MESSAGES.PET.NAME_MIN_LENGTH)
    ).toBeVisible();

    await page.getByTestId("name-input").fill(petName);
    await expect(
      page.getByText(VALIDATION_MESSAGES.PET.NAME_MIN_LENGTH)
    ).not.toBeVisible();
  });

  test("can edit existing pet", async ({ page }) => {
    await page.goto(`${baseURL}/app/family/${familyId}`);
    const petElement = page.locator(`[data-entity-id]`, {
      has: page.getByText(petName),
    });
    petId = await petElement.getAttribute("data-entity-id");
    await page.goto(`${baseURL}/app/family/${familyId}/pet/${petId}/edit`);

    await page.getByTestId("name-input").fill(updatedPetName);
    await page
      .getByTestId("start-date-input")
      .fill(format(updatedStartDate, DATE_FORMATS.US));
    await page
      .getByTestId("description-input")
      .fill("Updated pet description");
    await page.getByTestId("save-button").click();

    await expect(page.getByText(updatedPetName)).toBeVisible();
  });

  test("can connect pet to moment", async ({ page }) => {
    await page.goto(`${baseURL}/app/family/${familyId}/pet/${petId}/edit`);

    await page.getByTestId("moment-select-trigger").click();
    await page.getByTestId(`moment-select-item-${momentId}`).click();

    await expect(page.getByText("Test Moment")).toBeVisible();
  });

  test("can delete pet", async ({ page }) => {
    await page.goto(`${baseURL}/app/family/${familyId}/pet/${petId}/edit`);
    await page.getByTestId("delete-button").click();
    page.once("dialog", (dialog) => dialog.accept());
    await page.waitForLoadState("networkidle");
    await expect(page.getByText(petName)).not.toBeVisible();
  });
});
