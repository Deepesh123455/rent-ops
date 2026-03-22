import {Router} from "express";

import { LocationController } from "../controller/location.controller.js";
const LocationRouter : Router = Router();

const locationController : LocationController = new LocationController();

LocationRouter.get("/locations",locationController.getAllLocations);
LocationRouter.get("/locations/:locations_id",locationController.getLocationsByIds);
LocationRouter.get("locations/summary",locationController.getLocationSummary);


export default LocationRouter;