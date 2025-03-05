import { test, expect } from "@playwright/test";
import { generateTestId, randDate } from "./testUtils";
import { VALIDATION_MESSAGES } from "../src/constants/validationMessages";
import { format } from "date-fns";
import { DATE_FORMATS } from "../src/lib/utils";

const baseURL = process.env.APP_URL;
const familyId = process.env.TEST_FAMILY_ID;
test.use({ storageState: "./playwright/.auth/user.json" });
const momentId = process.env.TEST_MOMENT_ID;

test.describe("Location Form", () => {
  const locationName = generateTestId("location");
  const startDate = randDate();
  const updatedLocationName = `${locationName} Updated`;
  const updatedStartDate = randDate();
  let locationId;

  test("creates a new location with all fields", async ({ page }) => {
    await page.goto(`${baseURL}/app/family/${familyId}/location/add`);

    await page.getByTestId("name-input").fill(locationName);
    await page
      .getByTestId("start-date-input")
      .fill(format(startDate, DATE_FORMATS.US));
    await page
      .getByTestId("map-reference-input")
      .fill("Test location reference");
    await page.getByTestId("save-button").click();

    // pause 1 second to allow the page to load
    await page.waitForTimeout(1000);
    await page.goto(`/app/family/${familyId}`);
    await expect(page.getByText(locationName)).toBeVisible();
  });

  test("shows validation error for short name", async ({ page }) => {
    await page.goto(`${baseURL}/app/family/${familyId}/location/add`);

    await page.getByTestId("name-input").fill("A");
    await page.getByTestId("save-button").click();

    await expect(
      page.getByText(VALIDATION_MESSAGES.LOCATION.NAME_MIN_LENGTH)
    ).toBeVisible();

    await page.getByTestId("name-input").fill(locationName);
    await expect(
      page.getByText(VALIDATION_MESSAGES.LOCATION.NAME_MIN_LENGTH)
    ).not.toBeVisible();
  });

  test("can edit existing location", async ({ page }) => {
    await page.goto(`${baseURL}/app/family/${familyId}`);
    const locationElement = page.locator(`[data-entity-id]`, {
      has: page.getByText(locationName),
    });
    locationId = await locationElement.getAttribute("data-entity-id");
    await page.goto(
      `${baseURL}/app/family/${familyId}/location/${locationId}/edit`
    );

    await page.getByTestId("name-input").fill(updatedLocationName);
    await page
      .getByTestId("start-date-input")
      .fill(format(updatedStartDate, DATE_FORMATS.US));
    await page
      .getByTestId("map-reference-input")
      .fill("Test location reference");
    await page.getByTestId("save-button").click();

    await expect(page.getByText(updatedLocationName)).toBeVisible();
  });

  test("can connect location to moment", async ({ page }) => {
    await page.goto(
      `${baseURL}/app/family/${familyId}/location/${locationId}/edit`
    );

    await page.getByTestId("moment-select-trigger").click();
    await page.getByTestId(`moment-select-item-${momentId}`).click();

    await expect(page.getByText("Test Moment")).toBeVisible();
  });

  test("can delete location", async ({ page }) => {
    await page.goto(
      `${baseURL}/app/family/${familyId}/location/${locationId}/edit`
    );
    await page.getByTestId("delete-button").click();
    page.once("dialog", (dialog) => dialog.accept());
    await page.waitForLoadState("networkidle");
    await expect(page.getByText(locationName)).not.toBeVisible();
  });
});
