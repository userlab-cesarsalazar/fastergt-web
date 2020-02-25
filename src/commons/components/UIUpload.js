//Libs
import React, { Component } from 'react';
import PropTypes from 'prop-types';

//Components
import {
  Button,
  Icon,
  Upload
} from 'antd';

//Styles

//Const

class UIUpload extends Component {

  constructor(props){
    super(props);
    this.state = {
      loading: props.loading
    }

    this.handleAdd = this.handleAdd.bind(this)
    this.handleRemove = this.handleRemove.bind(this)
  }

  handleAdd(file) {

    let files = this.props.value || [];

    if (this.props.multiple) {

      this.props.onChange(files.concat([file]))

    } else {
      this.props.onChange([file])
    }

    return false;

  }

  handleRemove(file) {

    let files = this.props.value;

    if (this.props.multiple) {

      files = files.filter(f => f !== file)
      this.props.onChange(files.length > 0 ? files : null)

    } else {
      this.props.onChange(null)
    }
  }

  render() {

    return (
      <Upload
        onRemove={file => this.handleRemove(file)}
        beforeUpload={file => this.handleAdd(file)}
        fileList={this.props.value}
        accept={this.props.accept}
      >
        <Button>
          <Icon type='upload' /> {this.props.label}
        </Button>
      </Upload>
    );
  }
}

UIUpload.propTypes = {
  disabled: PropTypes.bool,
  value: PropTypes.array,
  placeholder: PropTypes.string,
  multiple: PropTypes.bool,
  accept: PropTypes.string,
  onChange: PropTypes.func,
  label: PropTypes.string
}

UIUpload.defaultProps = {
  disabled: false,
  onChange: () => {},
  label: 'Select file',
  accept: ''
}

export default UIUpload