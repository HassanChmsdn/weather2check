import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { WeatherApi } from './services/weather_api.service';
import { timer, Observable, Subject, Subscription, interval } from 'rxjs';
import { switchMap, takeUntil, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  constructor(private api: WeatherApi) {

    // refreshing each 5 sec
    this.subscription = interval(5000).subscribe((x => {
      this.getWeather(this.cityname);
    }));
  }

  title = 'weather2check';

  public selected: string = '';
  public weather: any;
  public icon: any;
  public imageToShow: any;
  public isImageLoading: boolean;
  public weatherDscr: string;
  public temp: number;
  public maxTemp: number;
  public minTemp: number;
  public forecast: any;
  public days: Array<any> = [];
  subscription: Subscription;
  public cityname: string = "";

  // rounding  the temp in the  forecast UI
  public round = Math.round;

  //list of cities
  cities = [{
    value: 1,
    text: 'Atlanta'
  }, {
    value: 2,
    text: 'Berlin'
  }, {
    value: 3,
    text: 'Boston'
  }, {
    value: 4,
    text: 'Chicago'
  }, {
    value: 5,
    text: 'London'
  }, {
    value: 6,
    text: 'Los Angeles'
  }, {
    value: 7,
    text: 'New York'
  }, {
    value: 8,
    text: 'Paris'
  }, {
    value: 9,
    text: 'San Francisco'
  }];

  //validating the selection
  selectFormControl = new FormControl('', Validators.required);

  // call the get weather and forecast in a row 
  public getWeather(cityname) {
    console.log("cityname", cityname);
    this.cityname = cityname;

    //getting weather by city 
    this.api.getweatherbyCity(cityname)
      .subscribe((data: any) => {
        this.weather = data;
        console.log(this.weather);
        if (this.weather) {

          // returning the icon of the weather
          this.getImageFromService(this.weather['weather'][0].icon);

          // returning the description of the weather
          this.weatherDscr = this.weather['weather'][0].description

          // returning the rounded number of temp maxTemp and minTemp of the weather
          this.temp = Math.round(this.weather['main'].temp - 273.15);
          this.maxTemp = Math.round(this.weather['main'].temp_max - 273.15)
          this.minTemp = Math.round(this.weather['main'].temp_min - 273.15)

          // returning the forecast of the city
          this.getWeatherForecast(cityname);
        }
      });

  }

  // creating the image file
  createImageFromBlob(image: Blob) {
    let reader = new FileReader();
    reader.addEventListener("load", () => {
      this.imageToShow = reader.result;
    }, false);

    if (image) {
      reader.readAsDataURL(image);
    }
  }

  // getting the image from service
  getImageFromService(icon) {
    this.isImageLoading = true;
    this.api.getWeatherIcon(icon).subscribe(data => {
      this.createImageFromBlob(data);
      this.isImageLoading = false;
    }, error => {
      this.isImageLoading = false;
      console.log(error);
    });
  }

  //calling the weather forecast api
  getWeatherForecast(cityname) {
    this.api.getWeatherForecast(cityname).subscribe((data: any) => {
      this.forecast = data;
      console.log("forecast", this.forecast, "ey", this.forecast['list']);
    })
  }
}
