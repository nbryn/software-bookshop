import React, { Component } from "react";
import "./resources/app.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Provider } from "react-redux";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Store from "./Store";
import Home from "./components/home/index";
import Shop from "./components/shop/index";
import Layout from "./components/layout/index";
import SignIn from "./components/user/SignIn";
import SignUp from "./components/user/SignUp";
import Dashboard from "./components/user/Dashboard";
import IsAuth from "./components/user/IsAuth";
import BookDetails from "./components/book/index";
import Cart from "./components/user/Cart";

class App extends Component {
  render() {
    return (
      // Provider makes the store available to any nested components trough the connect() function
      <Provider store={Store}>
        <Router>
          <Layout>
            <Switch>
              <Route
                exact
                path="/book_details/:id"
                component={IsAuth(BookDetails, false)}
              />
              <Route exact path="/signin" component={IsAuth(SignIn, false)} />
              <Route exact path="/signup" component={IsAuth(SignUp, false)} />
              <Route exact path="/" component={IsAuth(Home, false)} />
              <Route exact path="/shop" component={IsAuth(Shop, false)} />

              <Route
                exact
                path="/user/dashboard"
                component={IsAuth(Dashboard, true)}
              />
              <Route exact path="/user/cart" component={IsAuth(Cart, true)} />
            </Switch>
          </Layout>
        </Router>
      </Provider>
    );
  }
}

export default App;
