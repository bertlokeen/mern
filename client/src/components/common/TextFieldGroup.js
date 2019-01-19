import React from 'react';
import classnames from 'classnames';
import { PropTypes } from 'prop-types';

const TextFieldGroup = ({
  name,
  placeholder,
  value,
  label,
  errors,
  info,
  type,
  onChange,
  disabled
}) => {
  return (
    <div className="form-group">
      <input
        type={type}
        className={classnames('form-control form-control.lg', {
          'is-invalid':
            errors.length > 0
              ? errors.filter(err => err.param === name)[0]
              : false
        })}
        placeholder={placeholder}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
      />
      {info && <small className="form-text text-muted">{info}</small>}
      {errors.length > 0 ? (
        <div className="invalid-feedback">
          {errors.filter(err => err.param === name).length > 0
            ? errors.filter(err => err.param === name)[0].msg
            : ''}
        </div>
      ) : (
        false
      )}
    </div>
  );
};

TextFieldGroup.propTypes = {
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  value: PropTypes.string.isRequired,
  info: PropTypes.string,
  error: PropTypes.object,
  type: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.string
};

TextFieldGroup.defaultProps = {
  type: 'text'
};

export default TextFieldGroup;
