import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classnames from 'classnames';
import { loginUser } from '../../actions/authActions';

export class Login extends Component {
  state = {
    email: '',
    password: '',
    errors: {}
  };

  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.history.push('/dashboard');
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.auth.isAuthenticated) {
      this.props.history.push('/dashboard');
    }
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

    const user = {
      email: this.state.email,
      password: this.state.password
    };

    this.props.loginUser(user);
  };

  render() {
    const { errors } = this.state;

    return (
      <div className="login">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <h1 className="display-4 text-center">Log In</h1>

              <p className="lead text-center">
                Sign in to your DevConnector account
              </p>
              <form onSubmit={this.onSubmit}>
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
                <input type="submit" className="btn btn-info btn-block mt-4" />
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Login.propTypes = {
  loginUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  {
    loginUser
  }
)(Login);
