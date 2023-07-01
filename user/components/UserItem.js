import React from "react";
import { Link } from "react-router-dom";

import Avatar from "../../shared/components/UIElements/Avatar";
import Card from "../../shared/components/UIElements/Card";
import "./UserItem.css";

const UserItem = (props) => {
  let link = props.image;
  let first = link.charAt(0);
  if (first == "h") {
  } else {
    link = `${process.env.REACT_APP_ASSET_URL}/${props.image}`;
  }
  return (
    <li className="user-item">
      <Card className="user-item__content">
        <Link to={`/${props.id}/lifts`}>
          <div className="user-item__image">
            <Avatar image={link} alt={props.name} />
          </div>
          <div className="user-item__info">
            <h2>{props.name}</h2>
            <h3>
              {props.placeCount} {props.placeCount === 1 ? "Lift" : "Lifts"}
            </h3>
          </div>
        </Link>
      </Card>
    </li>
  );
};

export default UserItem;
