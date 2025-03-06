import { test, expect } from "@playwright/test";
import { generateTestId, randDate } from "./testUtils";
import { VALIDATION_MESSAGES } from "../src/constants/validationMessages";
import { format } from "date-fns";
import { DATE_FORMATS } from "../src/lib/utils";

const baseURL = process.env.APP_URL;
const familyId = process.env.TEST_FAMILY_ID;
test.use({ storageState: "./playwright/.auth/user.json" });
const petId = process.env.TEST_PET_ID;
const locationId = process.env.TEST_LOCATION_ID;

test.describe("Moment Form", () => {
  const momentTitle = generateTestId("moment");
  const startDate = randDate();
  const updatedMomentTitle = `${momentTitle} Updated`;
  const updatedStartDate = randDate();
  let momentId;

  test("creates a new moment with all fields", async ({ page }) => {
    await page.goto(`${baseURL}/app/family/${familyId}/moment/add`);

    await page.getByTestId("title-input").fill(momentTitle);
    await page
      .getByTestId("start-date-input")
      .fill(format(startDate, DATE_FORMATS.US));
    await page.getByTestId("body-input").fill("Test moment description");
    await page.getByTestId("save-button").click();

    // pause 1 second to allow the page to load
    await page.waitForTimeout(1000);
    await page.goto(`/app/family/${familyId}`);

    // Locate the moment by title and retrieve its ID
    const momentElement = page.locator(`[data-testid^="moment-hidden-"]`, {
      hasText: momentTitle,
    });
    momentId = await momentElement.getAttribute("data-testid");
    momentId = momentId?.replace("moment-hidden-", "");

    // Verify the moment is correctly saved
    await expect(momentElement).toHaveText(momentTitle);
  });

  test("shows validation error for short title", async ({ page }) => {
    await page.goto(`${baseURL}/app/family/${familyId}/moment/add`);

    await page.getByTestId("title-input").fill("A");
    await page.getByTestId("save-button").click();

    await expect(
      page.getByText(VALIDATION_MESSAGES.MOMENT.TITLE_MIN_LENGTH)
    ).toBeVisible();

    await page.getByTestId("title-input").fill(momentTitle);
    await expect(
      page.getByText(VALIDATION_MESSAGES.MOMENT.TITLE_MIN_LENGTH)
    ).not.toBeVisible();
  });

  test("can edit existing moment", async ({ page }) => {
    await page.goto(`${baseURL}/app/family/${familyId}`);

    // Select the last moment in the list
    const lastMomentElement = page
      .locator(`[data-testid^="moment-hidden-"]`)
      .last();
    momentId = await lastMomentElement.getAttribute("data-testid");
    momentId = momentId?.replace("moment-hidden-", "");

    // Navigate to the edit page for the last moment
    await page.goto(
      `${baseURL}/app/family/${familyId}/moment/${momentId}/edit`
    );

    // Edit the moment
    await page.getByTestId("title-input").fill(updatedMomentTitle);
    await page
      .getByTestId("start-date-input")
      .fill(format(updatedStartDate, DATE_FORMATS.US));
    await page.getByTestId("body-input").fill("Updated moment description");
    await page.getByTestId("save-button").click();

    // Verify the moment is updated
    // pause 1 second to allow the page to load
    await page.waitForTimeout(1000);
    await page.goto(`/app/family/${familyId}`);

    // Locate the moment by title and retrieve its ID
    const momentElement = page.locator(`[data-testid^="moment-hidden-"]`, {
      hasText: updatedMomentTitle,
    });
    momentId = await momentElement.getAttribute("data-testid");
    momentId = momentId?.replace("moment-hidden-", "");

    // Verify the moment is correctly saved
    await expect(momentElement).toHaveText(updatedMomentTitle);
  });

  test("can connect moment to pet and location", async ({ page }) => {
    await page.goto(`${baseURL}/app/family/${familyId}`);

    // Select the last moment in the list
    const lastMomentElement = page
      .locator(`[data-testid^="moment-hidden-"]`)
      .last();
    momentId = await lastMomentElement.getAttribute("data-testid");
    momentId = momentId?.replace("moment-hidden-", "");

    // Navigate to the edit page for the last moment
    await page.goto(
      `${baseURL}/app/family/${familyId}/moment/${momentId}/edit`
    );

    await page.getByTestId("pet-select-trigger").click();
    await page.getByTestId(`pet-select-item-${petId}`).click();

    await page.getByTestId("location-select-trigger").click();
    await page.getByTestId(`location-select-item-${locationId}`).click();

    await expect(page.getByText("Test Pet")).toBeVisible();
    await expect(page.getByText("Test Location")).toBeVisible();
  });

  test("can delete moment", async ({ page }) => {
    await page.goto(`${baseURL}/app/family/${familyId}`);

    // Select the last moment in the list
    const lastMomentElement = page
      .locator(`[data-testid^="moment-hidden-"]`)
      .last();
    momentId = await lastMomentElement.getAttribute("data-testid");
    momentId = momentId?.replace("moment-hidden-", "");

    // Navigate to the edit page for the last moment
    await page.goto(
      `${baseURL}/app/family/${familyId}/moment/${momentId}/edit`
    );

    await page.getByTestId("delete-button").click();
    page.once("dialog", (dialog) => dialog.accept());
    await page.waitForLoadState("networkidle");
    await expect(page.getByText(momentTitle)).not.toBeVisible();
  });
});
