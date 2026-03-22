import {Router} from "express";

import { LocationController } from "../controller/location.controller.js";
const LocationRouter : Router = Router();

const locationController : LocationController = new LocationController();

LocationRouter.get("/locations",locationController.getAllLocations);
LocationRouter.get("/locations/summary",locationController.getLocationSummary);
LocationRouter.get("/locations/filter", locationController.getLocationsByIds);



export default LocationRouter;