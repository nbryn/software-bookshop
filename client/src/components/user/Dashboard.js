import React, { Component } from "react";
import UserLayout from "./UserLayout";

class Dashboard extends Component {
  render() {
    let user = this.props.user.userData;
    return (
      <UserLayout>
        <div>
          <div className="card">
            <h4 className="user-info">Account Information</h4>
            <div className="user-info">
              <span>
                {" "}
                <strong> Name: </strong>
                {user.data.fullName}{" "}
              </span>
              <br />
              <span>
                <strong> Email: </strong> {user.data.email}
              </span>
            </div>
          </div>
        </div>
      </UserLayout>
    );
  }
}

export default Dashboard;
