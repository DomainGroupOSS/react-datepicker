import moment from 'moment'
import PropTypes from 'prop-types';
import React from 'react'
import { isSameDay, isDayDisabled } from './date_utils'

class DateInput extends React.Component {
  static displayName = 'DateInput';

  static propTypes = {
    customInput: PropTypes.element,
    date: PropTypes.object,
    dateFormat: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.array
    ]),
    disabled: PropTypes.bool,
    excludeDates: PropTypes.array,
    filterDate: PropTypes.func,
    includeDates: PropTypes.array,
    locale: PropTypes.string,
    maxDate: PropTypes.object,
    minDate: PropTypes.object,
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
    onChangeDate: PropTypes.func
  };

  static defaultProps = {
    dateFormat: 'L'
  };

  componentWillReceiveProps(newProps) {
    if (!isSameDay(newProps.date, this.props.date) ||
          newProps.locale !== this.props.locale ||
          newProps.dateFormat !== this.props.dateFormat) {
      this.setState({
        value: this.safeDateFormat(newProps)
      })
    }
  }

  handleChange = (event) => {
    if (this.props.onChange) {
      this.props.onChange(event)
    }
    if (!event.isDefaultPrevented()) {
      this.handleChangeDate(event.target.value)
    }
  };

  handleChangeDate = (value) => {
    if (this.props.onChangeDate) {
      var date = moment(value, this.props.dateFormat, this.props.locale || moment.locale(), true)
      if (date.isValid() && !isDayDisabled(date, this.props)) {
        this.props.onChangeDate(date)
      } else if (value === '') {
        this.props.onChangeDate(null)
      }
    }
    this.setState({value})
  };

  safeDateFormat = (props) => {
    return props.date && props.date.clone()
      .locale(props.locale || moment.locale())
      .format(Array.isArray(props.dateFormat) ? props.dateFormat[0] : props.dateFormat) || ''
  };

  handleBlur = (event) => {
    this.setState({
      value: this.safeDateFormat(this.props)
    })
    if (this.props.onBlur) {
      this.props.onBlur(event)
    }
  };

  focus = () => {
    if(this.refs.input && this.refs.input.focus) {
      this.refs.input.focus()
    }
  };

  state = {
    value: this.safeDateFormat(this.props)
  };

  render() {
    const { customInput, date, locale, minDate, maxDate, excludeDates, includeDates, filterDate, dateFormat, onChangeDate, ...rest } = this.props // eslint-disable-line no-unused-vars

    if (customInput) {
      return React.cloneElement(customInput, {
        ...rest,
        ref: 'input',
        value: this.state.value,
        onBlur: this.handleBlur,
        onChange: this.handleChange
      })
    }

    return <input
        ref='input'
        type='text'
        {...rest}
        value={this.state.value}
        onBlur={this.handleBlur}
        onChange={this.handleChange} />
  }
}

module.exports = DateInput
