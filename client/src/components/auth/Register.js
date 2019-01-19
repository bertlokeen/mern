import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { withRouter } from 'react-router-dom';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { registerUser } from '../../actions/authActions';

export class Register extends Component {
  state = {
    name: '',
    email: '',
    password: '',
    password_confirm: '',
    errors: {}
  };

  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.history.push('/dashboard');
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({
        errors: nextProps.errors
      });
    }
  }

  onChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  onSubmit = e => {
    e.preventDefault();

    const newUser = {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
      password_confirm: this.state.password_confirm
    };

    this.props.registerUser(newUser, this.props.history);
  };

  render() {
    const { errors } = this.state;

    return (
      <div className="register">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <h1 className="display-4 text-center">Sign Up</h1>
              <p className="lead text-center">
                Create your DevConnector account
              </p>
              <form onSubmit={this.onSubmit}>
                <div className="form-group">
                  <input
                    type="text"
                    className={classnames('form-control form-control.lg', {
                      'is-invalid':
                        errors.length > 0
                          ? errors.filter(err => err.param === 'name')[0]
                          : false
                    })}
                    placeholder="Name"
                    name="name"
                    onChange={this.onChange}
                  />
                  {errors.length > 0 ? (
                    <div className="invalid-feedback">
                      {errors.filter(err => err.param === 'name').length > 0
                        ? errors.filter(err => err.param === 'name')[0].msg
                        : ''}
                    </div>
                  ) : (
                    false
                  )}
                </div>
                <div className="form-group">
                  <input
                    type="email"
                    className={classnames('form-control form-control.lg', {
                      'is-invalid':
                        errors.length > 0
                          ? errors.filter(err => err.param === 'email')[0]
                          : false
                    })}
                    placeholder="Email Address"
                    name="email"
                    onChange={this.onChange}
                  />
                  {errors.length > 0 ? (
                    <div className="invalid-feedback">
                      {errors.filter(err => err.param === 'email').length > 0
                        ? errors.filter(err => err.param === 'email')[0].msg
                        : ''}
                    </div>
                  ) : (
                    false
                  )}
                  <small className="form-text text-muted">
                    This site uses Gravatar so if you want a profile image, use
                    a Gravatar email
                  </small>
                </div>
                <div className="form-group">
                  <input
                    type="password"
                    className={classnames('form-control form-control.lg', {
                      'is-invalid':
                        errors.length > 0
                          ? errors.filter(err => err.param === 'password')[0]
                          : false
                    })}
                    placeholder="Password"
                    name="password"
                    onChange={this.onChange}
                  />
                  {errors.length > 0 ? (
                    <div className="invalid-feedback">
                      {errors.filter(err => err.param === 'password').length > 0
                        ? errors.filter(err => err.param === 'password')[0].msg
                        : ''}
                    </div>
                  ) : (
                    false
                  )}
                </div>
                <div className="form-group">
                  <input
                    type="password"
                    className={classnames('form-control form-control.lg', {
                      'is-invalid':
                        errors.length > 0
                          ? errors.filter(
                              err => err.param === 'password_confirm'
                            )[0]
                          : false
                    })}
                    placeholder="Confirm Password"
                    name="password_confirm"
                    onChange={this.onChange}
                  />
                  {errors.length > 0 ? (
                    <div className="invalid-feedback">
                      {errors.filter(err => err.param === 'password_confirm')
                        .length > 0
                        ? errors.filter(
                            err => err.param === 'password_confirm'
                          )[0].msg
                        : ''}
                    </div>
                  ) : (
                    false
                  )}
                </div>
                <input type="submit" className="btn btn-info btn-block mt-4" />
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Register.propTypes = {
  registerUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { registerUser }
)(withRouter(Register));
