import dayjs from "dayjs";

export class FlightBookingPage {
    targetDate = dayjs().add(1, "day").format("YYYY-MM-DD");
    departureTime = "";
    arrivalTime = "";
    passengerName = "";
    totalPrice = "";

    visitHomePage() {
        cy.visit('/');
        cy.document().then(doc => { doc.body.style.zoom = '100%'; });
    }

    fillFlightSearch() {
        cy.xpath(`//li[@id='tab-flight-tab']`).click();
        cy.xpath(`//input[@id='flight-origin-search-input']`).type(Cypress.env("FLIGHT_ORIGIN"));
        cy.xpath(`//ul[@aria-label='Flying from']`).contains(`${Cypress.env("FLIGHT_ORIGIN")}, Indonesia`).click();

        cy.xpath(`//input[@id='flight-destination-search-input']`).type(Cypress.env("FLIGHT_DEST"));
        cy.xpath(`//ul[@aria-label='Flying to']`).contains(`${Cypress.env("FLIGHT_DEST")}, ${Cypress.env("FLIGHT_DEST")}`).click();

        cy.get(`.PriceSurgePicker-Day__label[data-selenium-date='${this.targetDate}']`).click();
        cy.xpath(`(//span[@class='Spanstyled__SpanStyled-sc-16tp9kb-0 bXsPY kite-js-Span '])[1]`).click();
    }

    selectFlightAndBook() {
        cy.wait(5000);
        cy.xpath(`(//span[contains(@class,'TextLink__TextStyled')])[1]`).click();
        cy.xpath(`(//label[@data-element-value='Malaysia Airlines'])[1]`).click();
        cy.xpath(`(//p[@id='sort-options-label'])[1]`).click();
        cy.wait(5000);
        cy.xpath(`(//button[@role='option'])[5]`).click();
        cy.wait(5000);
        cy.xpath(`(//img[contains(@alt,'Malaysia Airlines')])[1]`).click();
        // Assertion departure time
        cy.xpath(`(//div[@data-testid="departure-time"]//p)[1]`)
            .first()
            .invoke("text")
            .then((text) => {
                this.departureTime = text.trim();
            });
        cy.then(() => {cy.log("Departure Time:", this.departureTime);});
        // Assertion arrival time
        cy.xpath(`(//div[@data-testid="departure-time"]//p)[4]`)
            .first()
            .invoke("text")
            .then((text) => {
                this.arrivalTime = text.trim();
            });
        cy.then(() => {cy.log("Arrival Time:", this.arrivalTime);});
        cy.xpath(`(//button[@data-component='flight-card-bookButton'])[1]`).click();
    }

    fillPassengerDetails() {
        cy.reload();
        cy.wait(20000);
        cy.then(() => {cy.log("Total Price:", this.totalPrice);});
        cy.xpath(`//input[@id='contact.contactFirstName']`).type(Cypress.env("FIRST_NAME"));
        cy.xpath(`//input[@id='contact.contactLastName']`).type(Cypress.env("LAST_NAME"));
        cy.xpath(`//input[@id='contact.contactEmail']`).type(Cypress.env("EMAIL"));
        cy.xpath(`//input[@id='contact.contactPhoneNumber']`).type(Cypress.env("PHONE_NUMBER"));

        cy.get(`input[aria-label='Male']`).check().click();
        cy.xpath(`//input[@id='flight.forms.i0.units.i0.passengerFirstName']`).type(Cypress.env("FIRST_NAME"));
        cy.xpath(`//input[@id='flight.forms.i0.units.i0.passengerLastName']`).type(Cypress.env("LAST_NAME"));

        cy.xpath(`(//input[@placeholder='DD'])[1]`).type(Cypress.env("BIRTH_DAY"));
        cy.xpath(`(//div[contains(@class,'')])[143]`).click();
        cy.xpath(`(//input[contains(@name,'dropdown-list-item')])[1]`).click();
        cy.xpath(`(//input[@placeholder='YYYY'])[1]`).type(Cypress.env("BIRTH_YEAR"));

        cy.xpath(`(//div[contains(@class,'')])[160]`).click();
        cy.xpath(`(//input[contains(@placeholder,'Search')])[1]`).type(Cypress.env("COUNTRY"));
        cy.xpath(`(//input[@name='dropdown-list-item'])[1]`).check();

        cy.xpath(`(//input[@id='flight.forms.i0.units.i0.passportNumber'])[1]`).type(Cypress.env("PASSPORT"));

        cy.xpath(`(//div[contains(@class,'')])[179]`).click();
        cy.xpath(`(//input[contains(@placeholder,'Search')])[1]`).type(Cypress.env("COUNTRY"));
        cy.xpath(`(//input[@name='dropdown-list-item'])[1]`).check();

        cy.xpath(`(//input[@placeholder='DD'])[2]`).type(Cypress.env("PASSPORT_DAY"));
        cy.xpath(`(//div[contains(@class,'')])[199]`).click();
        cy.xpath(`(//input[contains(@name,'dropdown-list-item')])[1]`).click();
        cy.xpath(`(//input[@placeholder='YYYY'])[2]`).type(Cypress.env("PASSPORT_YEAR"));

        // Assertion total price
        cy.get(`dd[data-component="mob-flight-price-total-desc"] span[data-component="mob-price-desc-text"]`)
            .invoke("text")
            .then((text) => {
                this.totalPrice = text.trim();
            });
    }

    proceedToPayment() {
        cy.xpath(`(//button[contains(@data-component,'flight-continue-to-addOns-button')])[1]`).click().click();
        cy.xpath(`(//div[contains(text(),'Continue to payment')])[1]`).click();
        //cy.xpath(`(//button[@data-component='last-chance-decline-button'])[1]`).click();
        cy.xpath(`(//span[@class='Typographystyled__TypographyStyled-sc-j18mtu-0 jGwMPl kite-js-Typography '])[1]`).click();
    }

    assertFinalReviewData() {
        cy.xpath(`(//span[@data-component="mob-flight-segment-departure"])[1]`)
            .eq(0)
            .invoke("text")
            .then((text) => {
                expect(text.trim()).to.eq(this.departureTime);
            });
        cy.xpath(`(//span[@data-component="mob-flight-segment-arrival"])[2]`)
            .eq(0)
            .invoke("text")
            .then((text) => {
                expect(text.trim()).to.eq(this.arrivalTime);
            });
        cy.xpath(`//dd[@data-component="mob-flight-price-total-desc"]//span[@data-component="mob-price-desc-text"]`)
            .invoke("text")
            .then((text) => {
                expect(text.trim()).to.eq(this.totalPrice);
            });
        cy.xpath(`//strong[@data-component='name-container-name']`)
            .should("contain.text", Cypress.env("FIRST_NAME") + " " + Cypress.env("LAST_NAME"));
        cy.xpath(`//span[contains(text(), "Passport:")]`)
            .should("have.text", `Passport: ${Cypress.env("PASSPORT")}`);
    }
}
