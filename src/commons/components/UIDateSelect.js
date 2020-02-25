//Libs
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

//Components
import {
  Select,
  DatePicker
} from 'antd';

//Styles

//Const
const dateOptions = [
  { value: 'LAST_WEEK', label: 'Semana anterior (Lunes-Domingo)' },
  { value: 'THIS_WEEK', label: 'Semana actual(Lunes-Hoy)' },
  { value: 'LAST_MONTH', label: 'Mes anterior' },
  { value: 'THIS_MONTH', label: 'Mes actual' },
  { value: 'LAST_YEAR', label: 'Año anterior' },
  { value: 'THIS_YEAR', label: 'Año actual' },
  { value: 'TODAY', label: 'Hoy' },
  { value: 'YESTERDAY', label: 'Ayer' },
  { value: 'ALL_TIME', label: 'All Time' },
  { value: 'CUSTOM', label: 'Personalizado' }
];

class UIDateSelect extends Component {

  constructor(props){
    super(props);
    this.state = {
      loading: true,
      type: null,
      startDate: null,
      endDate: null,
      dateOptions: dateOptions
    }

    this.handleTypeChange = this.handleTypeChange.bind(this)
    this.handleDateChange = this.handleDateChange.bind(this)
  }

  // Functions to load and filter select options
  componentDidMount() {

    let options = this.state.dateOptions;

    if (!this.props.showYearOptions) {
      options = options.filter(o => o.value.indexOf('YEAR') === -1)
    }

    if (!this.props.showAllTimeOption) {
      options = options.filter(o => o.value.indexOf('ALL_TIME') === -1)
    }

    this.setState({ dateOptions: options })

  }

  componentDidUpdate(){

    let options = dateOptions;

    if (!this.props.showYearOptions) {
      options = options.filter(o => o.value.indexOf('YEAR') === -1);
    }

    if (!this.props.showAllTimeOption) {
      options = options.filter(o => o.value.indexOf('ALL_TIME') === -1);
    }

    if (JSON.stringify(options) !== JSON.stringify(this.state.dateOptions)) {

      this.setState({ dateOptions: options }, _ => {

        if (this.props.value && !this.state.dateOptions.find(o => o.value === this.props.value.type)) {
          this.props.onChange()
        }

      })
    }
  }


  handleTypeChange(type) {

    let value = {
      type: type,
      startDate: null,
      endDate: null
    }

    this.setState({ type })

    switch (type) {
      case 'THIS_MONTH':
        value.startDate = moment().startOf('month');
        value.endDate = moment().endOf('day');
        break

      case 'LAST_MONTH':
        value.startDate = moment().subtract(1, 'month').startOf('month');
        value.endDate = moment().subtract(1, 'month').endOf('month');
        break

      case 'THIS_YEAR':
        value.startDate = moment().startOf('year');
        value.endDate = moment().endOf('day');
        break

      case 'LAST_YEAR':
        value.startDate = moment().subtract(1, 'year').startOf('year');
        value.endDate = moment().subtract(1, 'year').endOf('year');
        break

      case 'TODAY':
        value.startDate = moment().startOf('day');
        value.endDate = moment().endOf('day');
        break

      case 'YESTERDAY':
        value.startDate = moment().subtract(1, 'day').startOf('day');
        value.endDate = moment().subtract(1, 'day').endOf('day');
        break

      case 'THIS_WEEK':
        value.startDate = moment().subtract(1, 'day').startOf('week').add(1, 'day');
        value.endDate = moment().endOf('day');
        break

      case 'LAST_WEEK':
        value.startDate = moment().subtract(1, 'week').startOf('week').add(1, 'day');
        value.endDate = moment().subtract(1, 'week').endOf('week').add(1, 'day');
        break

      case 'ALL_TIME':
        value.startDate = moment(new Date('2012-01-01')).startOf('day');
        value.endDate = moment().endOf('day');
        break

      default:
        value.startDate = null;
        value.endDate = null;
        break
    }

    this.props.onChange(value)

  }

  handleDateChange(date){
    this.props.onChange({
      type: 'CUSTOM',
      startDate : date[0] ? date[0].startOf('day') : null,
      endDate : date[1] ? date[1].endOf('day') : null,
    })
  }

  render() {
    let options = this.state.dateOptions;

    return (
      <div>
        <Select
          showSearch
          allowClear
          optionFilterProp='children'
          disabled={this.props.disabled}
          placeholder={this.props.placeholder || 'Date'}
          value={this.props.value ? this.props.value.type : undefined}
          onChange={value => this.handleTypeChange(value)}
        >
          {options.map(d => <Select.Option key={d.value} children={d.label} value={d.value} />)}

        </Select>
        {this.state.type === 'CUSTOM' &&
        <DatePicker.RangePicker style={{ width: '100%' }} format='MM/DD/YYYY' onChange={d => this.handleDateChange(d)} />}
      </div>
    );
  }
}

UIDateSelect.propTypes = {
  disabled: PropTypes.bool,
  value: PropTypes.object,
  placeholder: PropTypes.string,
  showYearOptions: PropTypes.bool,
  showAllTimeOption: PropTypes.bool
}

export default UIDateSelect