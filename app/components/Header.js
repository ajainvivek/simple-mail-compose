import React from "react";
import { IndexLink, Link } from "react-router";

class Header extends React.Component {
  render() {
    return (
      <div className="container">
        <ul className="list-inline">
          <li>
            <Link to="/compose">Compose Mail</Link>
          </li>
        </ul>
      </div>
    );
  }
}

export default Header;
