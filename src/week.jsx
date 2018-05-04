import PropTypes from 'prop-types';
import React from 'react'
import Day from './day'

class Week extends React.Component {
  static displayName = 'Week';

  static propTypes = {
    day: PropTypes.object.isRequired,
    endDate: PropTypes.object,
    excludeDates: PropTypes.array,
    filterDate: PropTypes.func,
    highlightDates: PropTypes.array,
    includeDates: PropTypes.array,
    maxDate: PropTypes.object,
    minDate: PropTypes.object,
    month: PropTypes.number,
    onDayClick: PropTypes.func,
    onDayMouseEnter: PropTypes.func,
    selected: PropTypes.object,
    selectingDate: PropTypes.object,
    selectsEnd: PropTypes.bool,
    selectsStart: PropTypes.bool,
    startDate: PropTypes.object,
    utcOffset: PropTypes.number
  };

  handleDayClick = (day, event) => {
    if (this.props.onDayClick) {
      this.props.onDayClick(day, event)
    }
  };

  handleDayMouseEnter = (day) => {
    if (this.props.onDayMouseEnter) {
      this.props.onDayMouseEnter(day)
    }
  };

  renderDays = () => {
    const startOfWeek = this.props.day.clone().startOf('week')
    return [0, 1, 2, 3, 4, 5, 6].map(offset => {
      const day = startOfWeek.clone().add(offset, 'days')
      return (
        <Day
            key={offset}
            day={day}
            month={this.props.month}
            onClick={this.handleDayClick.bind(this, day)}
            onMouseEnter={this.handleDayMouseEnter.bind(this, day)}
            minDate={this.props.minDate}
            maxDate={this.props.maxDate}
            excludeDates={this.props.excludeDates}
            includeDates={this.props.includeDates}
            highlightDates={this.props.highlightDates}
            selectingDate={this.props.selectingDate}
            filterDate={this.props.filterDate}
            selected={this.props.selected}
            selectsStart={this.props.selectsStart}
            selectsEnd={this.props.selectsEnd}
            startDate={this.props.startDate}
            endDate={this.props.endDate}
            utcOffset={this.props.utcOffset}/>
      )
    })
  };

  render() {
    return (
      <div className="react-datepicker__week">
        {this.renderDays()}
      </div>
    )
  }
}

module.exports = Week
