import fs from "fs/promises";
import { v4 } from "uuid";
// TODO: Define a City class with name and id properties
class City {
  name: string;
  id: string;
  constructor(name: string, id: string) {
    this.name = name;
    this.id = id;
  }
}

// TODO: Complete the HistoryService class
class HistoryService {
  // TODO: Define a read method that reads from the searchHistory.json file
  private async read() {
    const data = await fs.readFile("./db/db.json", "utf8");
    console.log(data);
    return JSON.parse(data);
  }

  // TODO: Define a write method that writes the updated cities array to the searchHistory.json file
  private async write(cities: City[]) {
    return await fs.writeFile("./db/db.json", JSON.stringify(cities));
  }
  // TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  async getCities() {
    return await this.read();
  }
  // TODO Define an addCity method that adds a city to the searchHistory.json file
  async addCity(newCity: string) {
    if (!newCity) {
      throw new Error("City name is required");
    }
    const cities = await this.read();
    cities.push({ name: newCity, id: v4() });
    await this.write(cities);
    return cities;
  }
  // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
  async removeCity(id: string) {
    const cityLists = await this.getCities();
    const newCityList = cityLists.filter((city: any) => city.id !== id);
    await this.write(newCityList);
  }
}

export default new HistoryService();
