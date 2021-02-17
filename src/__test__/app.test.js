import {calculateTravelDurationInDays} from '../client/js/app'

describe("Test the calculation for the travel duration", () => {
    test("calculateTravelDurationInDays", () => {
        let startDate = new Date('2021-02-20');
        let endDate = new Date('2021-02-26');

        let returnValue = calculateTravelDurationInDays(startDate, endDate);
        let duration = returnValue[0];

        expect(duration).toBe(6);
    })
});