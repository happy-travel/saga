const moment = require('moment');

function getPresentTime() {
    moment.locale();
    const date = moment();
    const presentTime = date.format('YYYY-DD-MM, HH:mm');
    return presentTime;
}

function getMonthFuture() {
    moment.locale();
    const date = moment().add(1, 'month');
    const futureMonth = date.format('YYYY-MM-DD');
    return futureMonth;
};

function getMonthAndWeekFuture() {
    moment.locale();
    const date = moment().add(1, 'month').add(4, 'days');
    const futureMonthAndWeek = date.format('YYYY-MM-DD');
    return futureMonthAndWeek;
};

module.exports = { getMonthAndWeekFuture, getMonthFuture, getPresentTime };