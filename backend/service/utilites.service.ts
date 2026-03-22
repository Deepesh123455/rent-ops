import { LocationService } from "./location.service.js";



export class UtilitiesServices {
    constructor(
        private readonly locationService: LocationService = new LocationService(),
    ) {}
    public async PayUtilites(ids: string[]) {
        const locations = await this.locationService.getLocationsByIds(ids);
        const totalFinalPayable = locations.reduce((acc, curr) => acc + curr.finalPayable, 0);
        return totalFinalPayable;
    }

}