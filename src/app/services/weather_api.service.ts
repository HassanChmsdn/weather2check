import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Injectable()
export class WeatherApi {
    constructor(private http: HttpClient) { }

    getweatherbyCity(cityname) {
        let byCity = "http://api.openweathermap.org/data/2.5/weather?q=" + cityname + "&appid=775f538a9469fe4b9347bd965954c362";
        return this.http.get(byCity);
    }

    getWeatherIcon(icon) {
        let iconUrl = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
        return this.http.get(iconUrl, { responseType: 'blob' }).pipe(
            retry(1)
        );
    }

    getWeatherForecast(cityname) {
        // "http://api.openweathermap.org/data/2.5/forecast/daily?q=" + cityname + "&cnt=5&appid=b98cab59ccd06b58302eaf30e6ed7b2c"
        // let forecast = "http://api.openweathermap.org/data/2.5/forecast?q=" + cityname + "&cnt=5&appid=b98cab59ccd06b58302eaf30e6ed7b2c";
        let forecast = "http://api.openweathermap.org/data/2.5/forecast?q=" + cityname + "&cnt=17&appid=b98cab59ccd06b58302eaf30e6ed7b2c"
        return this.http.get(forecast);
    }

}