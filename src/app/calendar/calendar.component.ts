import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import * as moment from 'moment';
import * as _ from 'lodash';
import { SimpleChange } from '@angular/core/src/change_detection/change_detection_util';
import { makeDecorator } from '@angular/core/src/util/decorators';
import { months } from 'moment';
import { element } from 'protractor';


export interface Calendardate {
    mData: moment.Moment;
}

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit, OnChanges {

  currentDate = moment();
  dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  Weeks= [];
  sortedDate =  [];
  dateEvent;
  event;
  description;
  Store = [];
  i = 0;
  contant = [];

  @Input() selectedDates = [];

  ngOnInit(): void {
      this.generateCalendar();
       if (this.Store != null) {
           this.Store = JSON.parse(localStorage.getItem('Events'));
       }else {
       }
  }

  constructor() {
    this.dateEvent = new FormGroup({
      eventDate: new FormControl('', Validators.required),
      desc: new FormControl('', Validators.required)
    });
  }

  todayCheck(day) {
    if (!day) {
      return false;
    }
    return moment().format('L') === day.format('L');
  }

  deleteItems(data, elements) {
      localStorage.removeItem('Events');
      this.delete(data, elements);
  }

  delete(array, item) {
      const index = array.indexOf(item);
      array.splice(index, 1);
      localStorage.setItem('Events', JSON.stringify(array));
  }

  onClickSubmit(data) {
                  this.event = data.eventDate;
                  this.description = data.desc;
                  this.storeData();
  }

  replaceData(data) {
     console.log(data);
  }

  storeData() {
    const store = {'Event': this.event , 'Description': this.description};
    this.Store.push(store);
    localStorage.setItem('Events', JSON.stringify(this.Store));
  }


  selectDate(date: moment.Moment) {
    this.dateEvent = new FormGroup({
      eventDate: new FormControl(date.format('MM/DD/YYYY'), Validators.required),
      desc: new FormControl('', Validators.required)
    });
  }

  editItem(arr, data) {
    this.dateEvent = new FormGroup({
      eventDate: new FormControl(data.Event, Validators.required),
      desc: new FormControl(data.Description, Validators.required)
    });
    this.delete(arr, data);
  }

  isSelectedMonth(date: moment.Moment) {
    return moment(date).isSame(this.currentDate , 'month');
  }

  prevMonth(): void {
    this.currentDate = moment(this.currentDate).subtract(1, 'months');
    this.generateCalendar();
  }
  nextMonth(): void {
    this.currentDate = moment(this.currentDate).add(1, 'months');
    this.generateCalendar();
  }

  firstMonth(): void {
    this.currentDate = moment(this.currentDate).startOf('year');
    this.generateCalendar();
  }

  lastMonth(): void {
    this.currentDate = moment(this.currentDate).endOf('year');
    this.generateCalendar();
  }

  prevYear(): void {
    this.currentDate = moment(this.currentDate).subtract(1, 'year');
    this.generateCalendar();
  }

  nextYear(): void {
    this.currentDate = moment(this.currentDate).add(1, 'year');
    this.generateCalendar();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.selectedDate && changes.selectedDate.currentValue && changes.selectedDate.currentValue.length > 1) {
        this.sortedDate = _.sortBy(changes.selectedDate.currentValue, (m: Calendardate) => m.mData.valueOf() );
        this.generateCalendar();
    }
  }

  generateCalendar(): void {
   const dates = this.filledDates(this.currentDate);
      const weeks: Calendardate[][] = [];
      while (dates.length > 0) {
          weeks.push(dates.splice(0, 7));
        }
        this.Weeks = weeks;
  }

  filledDates(currentMoment: moment.Moment): Calendardate[] {
    const firstOfMonth = moment(currentMoment).startOf('month').day();
    const firstDayofGrid = moment(currentMoment).startOf('month').subtract(firstOfMonth, 'days');
    const start = firstDayofGrid.date();
    return _.range(start, start + 35)
    .map((date: number): any => {
        const d = moment(firstDayofGrid).date(date);
        return {
          mData : d,
        };
    });
  }

}

