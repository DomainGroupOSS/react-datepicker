import DateInput from './date_input'
import Calendar from './calendar'
import PropTypes from 'prop-types';
import React from 'react'
import defer from 'lodash/defer'
import TetherComponent from './tether_component'
import classnames from 'classnames'
import { isSameDay } from './date_utils'
import moment from 'moment'

var outsideClickIgnoreClass = 'react-datepicker-ignore-onclickoutside'

/**
 * General datepicker component.
 */

class DatePicker extends React.Component {
  static displayName = 'DatePicker';

  static propTypes = {
    autoComplete: PropTypes.string,
    autoFocus: PropTypes.bool,
    className: PropTypes.string,
    customInput: PropTypes.element,
    dateFormat: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.array
    ]),
    dateFormatCalendar: PropTypes.string,
    disabled: PropTypes.bool,
    dropdownMode: PropTypes.oneOf(['scroll', 'select']).isRequired,
    endDate: PropTypes.object,
    excludeDates: PropTypes.array,
    filterDate: PropTypes.func,
    fixedHeight: PropTypes.bool,
    highlightDates: PropTypes.array,
    id: PropTypes.string,
    includeDates: PropTypes.array,
    inline: PropTypes.bool,
    isClearable: PropTypes.bool,
    locale: PropTypes.string,
    maxDate: PropTypes.object,
    minDate: PropTypes.object,
    name: PropTypes.string,
    onBlur: PropTypes.func,
    onChange: PropTypes.func.isRequired,
    onFocus: PropTypes.func,
    openToDate: PropTypes.object,
    peekNextMonth: PropTypes.bool,
    placeholderText: PropTypes.string,
    popoverAttachment: PropTypes.string,
    popoverTargetAttachment: PropTypes.string,
    popoverTargetOffset: PropTypes.string,
    readOnly: PropTypes.bool,
    renderCalendarTo: PropTypes.any,
    required: PropTypes.bool,
    selected: PropTypes.object,
    selectsEnd: PropTypes.bool,
    selectsStart: PropTypes.bool,
    showMonthDropdown: PropTypes.bool,
    showYearDropdown: PropTypes.bool,
    startDate: PropTypes.object,
    tabIndex: PropTypes.number,
    tetherConstraints: PropTypes.array,
    title: PropTypes.string,
    todayButton: PropTypes.string,
    utcOffset: PropTypes.number
  };

  static defaultProps = {
    dateFormatCalendar: 'MMMM YYYY',
    onChange () {},
    disabled: false,
    dropdownMode: 'scroll',
    onFocus () {},
    onBlur () {},
    popoverAttachment: 'top left',
    popoverTargetAttachment: 'bottom left',
    popoverTargetOffset: '10px 0',
    tetherConstraints: [
      {
        to: 'window',
        attachment: 'together'
      }
    ],
    utcOffset: moment.utc().utcOffset()
  };

  state = {
    open: false
  };

  componentWillUnmount() {
    clearTimeout(this.inputFocusTimeout)
  }

  setOpen = (open) => {
    this.setState({ open })
  };

  handleFocus = (event) => {
    this.props.onFocus(event)
    this.setOpen(true)
  };

  cancelFocusInput = () => {
    clearTimeout(this.inputFocusTimeout)
    this.inputFocusTimeout = null
  };

  deferFocusInput = () => {
    this.cancelFocusInput()
    this.inputFocusTimeout = defer(() => this.refs.input && this.refs.input.focus && this.refs.input.focus())
  };
  
  handleDropdownFocus = () => {
    this.cancelFocusInput()
  };

  handleBlur = (event) => {
    if (this.state.open) {
      this.deferFocusInput()
    } else {
      this.props.onBlur(event)
    }
  };

  handleCalendarClickOutside = (event) => {
    this.setOpen(false)
  };

  handleSelect = (date, event) => {
    this.setSelected(date, event)
    this.setOpen(false)
  };

  setSelected = (date, event) => {
    if (!isSameDay(this.props.selected, date)) {
      this.props.onChange(date, event)
    }
  };

  onInputClick = () => {
    if (!this.props.disabled) {
      this.setOpen(true)
    }
  };

  onInputKeyDown = (event) => {
    const copy = moment(this.props.selected)
    if (event.key === 'Enter' || event.key === 'Escape') {
      event.preventDefault()
      this.setOpen(false)
    } else if (event.key === 'Tab') {
      this.setOpen(false)
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault()
      this.setSelected(copy.subtract(1, 'days'))
    } else if (event.key === 'ArrowRight') {
      event.preventDefault()
      this.setSelected(copy.add(1, 'days'))
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      this.setSelected(copy.subtract(1, 'weeks'))
    } else if (event.key === 'ArrowDown') {
      event.preventDefault()
      this.setSelected(copy.add(1, 'weeks'))
    } else if (event.key === 'PageUp') {
      event.preventDefault()
      this.setSelected(copy.subtract(1, 'months'))
    } else if (event.key === 'PageDown') {
      event.preventDefault()
      this.setSelected(copy.add(1, 'months'))
    } else if (event.key === 'Home') {
      event.preventDefault()
      this.setSelected(copy.subtract(1, 'years'))
    } else if (event.key === 'End') {
      event.preventDefault()
      this.setSelected(copy.add(1, 'years'))
    }
  };

  onClearClick = (event) => {
    event.preventDefault()
    this.props.onChange(null, event)
  };

  renderCalendar = () => {
    if (!this.props.inline && (!this.state.open || this.props.disabled)) {
      return null
    }
    return <Calendar
        ref="calendar"
        locale={this.props.locale}
        dateFormat={this.props.dateFormatCalendar}
        dropdownMode={this.props.dropdownMode}
        selected={this.props.selected}
        onSelect={this.handleSelect}
        openToDate={this.props.openToDate}
        minDate={this.props.minDate}
        maxDate={this.props.maxDate}
        selectsStart={this.props.selectsStart}
        selectsEnd={this.props.selectsEnd}
        startDate={this.props.startDate}
        endDate={this.props.endDate}
        excludeDates={this.props.excludeDates}
        filterDate={this.props.filterDate}
        onClickOutside={this.handleCalendarClickOutside}
        highlightDates={this.props.highlightDates}
        includeDates={this.props.includeDates}
        peekNextMonth={this.props.peekNextMonth}
        showMonthDropdown={this.props.showMonthDropdown}
        showYearDropdown={this.props.showYearDropdown}
        todayButton={this.props.todayButton}
        utcOffset={this.props.utcOffset}
        outsideClickIgnoreClass={outsideClickIgnoreClass}
        fixedHeight={this.props.fixedHeight}
        onDropdownFocus={this.handleDropdownFocus}/>
  };

  renderDateInput = () => {
    var className = classnames(this.props.className, {
      [outsideClickIgnoreClass]: this.state.open
    })
    return <DateInput
        ref='input'
        id={this.props.id}
        name={this.props.name}
        autoFocus={this.props.autoFocus}
        date={this.props.selected}
        locale={this.props.locale}
        minDate={this.props.minDate}
        maxDate={this.props.maxDate}
        excludeDates={this.props.excludeDates}
        includeDates={this.props.includeDates}
        filterDate={this.props.filterDate}
        dateFormat={this.props.dateFormat}
        onFocus={this.handleFocus}
        onBlur={this.handleBlur}
        onClick={this.onInputClick}
        onKeyDown={this.onInputKeyDown}
        onChangeDate={this.setSelected}
        placeholder={this.props.placeholderText}
        disabled={this.props.disabled}
        autoComplete={this.props.autoComplete}
        className={className}
        title={this.props.title}
        readOnly={this.props.readOnly}
        required={this.props.required}
        tabIndex={this.props.tabIndex}
        customInput={this.props.customInput} />
  };

  renderClearButton = () => {
    if (this.props.isClearable && this.props.selected != null) {
      return <a className="react-datepicker__close-icon" href="#" onClick={this.onClearClick}></a>
    } else {
      return null
    }
  };

  render() {
    const calendar = this.renderCalendar()

    if (this.props.inline) {
      return calendar
    } else {
      return (
        <TetherComponent
            classPrefix={"react-datepicker__tether"}
            attachment={this.props.popoverAttachment}
            targetAttachment={this.props.popoverTargetAttachment}
            targetOffset={this.props.popoverTargetOffset}
            renderElementTo={this.props.renderCalendarTo}
            constraints={this.props.tetherConstraints}>
          <div className="react-datepicker__input-container">
            {this.renderDateInput()}
            {this.renderClearButton()}
          </div>
          {calendar}
        </TetherComponent>
      )
    }
  }
}

module.exports = DatePicker
