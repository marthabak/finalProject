import { FlightBookingPage } from "../support/pages/FlightBookingPage";

describe("agoda.com", () => {
    const flightPage = new FlightBookingPage();

    it("Flight Booking", () => {
        flightPage.visitHomePage();
        flightPage.fillFlightSearch();
        flightPage.selectFlightAndBook();
        flightPage.fillPassengerDetails();
        flightPage.proceedToPayment();
        flightPage.assertFinalReviewData();
    });
});