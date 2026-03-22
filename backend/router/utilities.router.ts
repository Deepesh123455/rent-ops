import { Router } from "express";
import { UtilitiesController } from "../controller/utilities.controller.js";

const UtilitiesRouter :Router = Router();



const utilitiesController : UtilitiesController = new UtilitiesController();


UtilitiesRouter.post("/pay/utilities/:location_ids",utilitiesController.payUtilities);


export default UtilitiesRouter;