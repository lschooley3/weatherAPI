import { Router, type Request, type Response } from "express";
const router = Router();

import HistoryService from "../../service/historyService.js";
import WeatherService from "../../service/weatherService.js";

// TODO: POST Request with city name to retrieve weather data
router.post("/", async (req: Request, res: Response) => {
  // TODO: GET weather data from city name
  const cityName = req.body.cityName;
  WeatherService.getWeatherForCity(req.body.cityName).then((data) => {
    HistoryService.addCity(cityName);
    res.json(data);
  });
  // TODO: save city to search history
});

// TODO: GET search history
router.get("/history", async (_req: Request, res: Response) => {
  return res.json(await HistoryService.getCities());
  // console.log(req);
});

// * BONUS TODO: DELETE city from search history
router.delete("/history/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const cities = await HistoryService.removeCity(id);
    return res.json(cities);
  } catch (error) {
    return res.status(500).json({ error: "server error" });
  }
});

export default router;
