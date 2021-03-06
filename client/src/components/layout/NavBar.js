import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { signOut } from "../../actions/UserActions";
import PropTypes from "prop-types";

class NavBar extends Component {
  signOut() {
    this.props.signOut();
    window.location.href = "/";
  }

  render() {
    const isAuthenticated = (
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary mb-4">
        <Link className="navbar-brand" to="/">
          <img className="menu_icon" src="/images/home.png" alt="" />
          Home
        </Link>
        <Link className="navbar-brand" to="/user/dashboard">
          <img className="menu_icon" src="/images/user.png" alt="" />
          Account
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mr-auto" />
          <Link className="navbar-brand" to="/user/cart">
            <img className="menu_icon" src="/images/cart.svg" alt="" />
            Cart
          </Link>
          <Link
            className="navbar-brand"
            to="/"
            onClick={this.signOut.bind(this)}
          >
            Sign Out
          </Link>
        </div>
      </nav>
    );

    const notAuthenticated = (
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary mb-4">
        <Link className="navbar-brand" to="/">
          <img className="menu_icon" src="/images/home.png" alt="" />
          Home
        </Link>
        <Link className="navbar-brand" to="/shop">
          <img className="menu_icon" src="/images/shop.svg" alt="" />
          Shop
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item active" />
          </ul>

          <Link className="navbar-brand" to="/signin">
            Sign In
          </Link>
          <Link className="navbar-brand" to="/signup">
            Sign Up
          </Link>
        </div>
      </nav>
    );

    let topNavBarLinks;

    // Show different links depending on auth
    if (localStorage.getItem("jwtToken")) {
      topNavBarLinks = isAuthenticated;
    } else {
      topNavBarLinks = notAuthenticated;
    }

    return <nav> {topNavBarLinks} </nav>;
  }
}

NavBar.propTypes = {
  signOut: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired
};

const mapStateToProps = state => {
  return {
    user: state.user
  };
};

export default connect(
  mapStateToProps,
  { signOut }
)(NavBar);
