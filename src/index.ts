import axios, { AxiosResponse } from "axios";
import colors from "colors";
import commander from "commander";

const command = commander
  .version("0.1.0")
  .option("-c,--city [name]", "Add city name")
  .option(
    "-e,--extensions [name]",
    "Choose base live weather,all predicate weather"
  )
  .parse(process.argv);

if (process.argv.slice(2).length === 0) {
  command.outputHelp(colors.red);
  process.exit();
}

interface IWeatherResponse {
  status: string;
  count: string;
  info: string;
  infocode: string;
  lives?: ILife[];
  forecasts?: IForecast[];
}

interface ILife {
  province: string;
  city: string;
  adcode: string;
  weather: string;
  temperature: string;
  winddirection: string;
  windpower: string;
  humidity: string;
  reporttime: string;
}

interface IForecast {
  city: string;
  adcode: string;
  province: string;
  reporttime: string;
  casts: ICast[];
}

interface ICast {
  date: string;
  week: string;
  dayweather: string;
  nightweather: string;
  daytemp: string;
  nighttemp: string;
  daywind: string;
  nightwind: string;
  daypower: string;
  nightpower: string;
}

const URL = "https://restapi.amap.com/v3/weather/weatherInfo";
const KEY = "78afced4810e78fef4e60c9be330ca06";

const log = console.log;
if (!command.extensions) {
  command.extensions = "base";
}
axios
  .get(
    `${URL}?city=${encodeURI(command.city)}&key=${KEY}&extensions=${encodeURI(
      command.extensions
    )}`
  )
  .then((res: AxiosResponse<IWeatherResponse>) => {
    // console.log(res.data);
    const data = res.data;
    if (!command.extensions || command.extensions === "base") {
      if (!data.lives) {
        throw new Error("值不存在");
      }
      const live = data.lives[0];
      log(colors.yellow(live.reporttime));
      log(colors.white(`${live.province}${live.city}`));
      log(colors.green(`${live.weather}${live.temperature}度`));
    } else {
      if (!data.forecasts) {
        throw new Error("值不存在");
      }
      const forecasts = data.forecasts[0];
      log(colors.yellow(forecasts.reporttime));
      log(colors.white(`${forecasts.province}${forecasts.city}`));
      forecasts.casts.forEach((element) => {
        log(
          colors.green(
            `日期: ${element.date} 日间天气:${element.dayweather} 夜晚天气:${element.nightweather}`
          )
        );
      });
    }
  })
  .catch(() => {
    log(colors.red("天气服务出现异常"));
  });
