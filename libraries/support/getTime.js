const moment = require('moment');

function getPresentTime() {
    moment.locale();
    const date = moment();
    const presentTime = date.format('YYYY-DD-MM, HH:mm');
    return presentTime;
}

function getMonthFuture(month, day) {
    moment.locale();
    const date = moment().add(month, 'month').add(day, 'days');
    const futureMonth = date.format('YYYY-MM-DD');
    return futureMonth;
};

function getMonthAndWeekFuture(month, week) {
    moment.locale();
    const date = moment().add(month, 'month').add(week, 'days');
    const futureMonthAndWeek = date.format('YYYY-MM-DD');
    return futureMonthAndWeek;
};

module.exports = { getMonthAndWeekFuture, getMonthFuture, getPresentTime };