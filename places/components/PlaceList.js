import React from "react";

import Card from "../../shared/components/UIElements/Card";
import PlaceItem from "./PlaceItem";
import Button from "../../shared/components/FormElements/Button";
import "./PlaceList.css";

const PlaceList = (props) => {
  if (props.items.length === 0) {
    return (
      <div className="place-list center">
        <Card>
          <h2>No lifts found. Hit the gym.</h2>
          <Button to="/lifts/new">Share Lift</Button>
        </Card>
      </div>
    );
  }

  return (
    <ul className="place-list">
      {props.items.map((lift) => (
        <PlaceItem
          key={lift.id}
          id={lift.id}
          //image={place.image}
          //name={place.name}
          date={lift.date}
          title={lift.title}
          location={lift.location}
          description={lift.description}
          creatorId={lift.creator}
          onDelete={props.onDeleteLift}
        />
      ))}
    </ul>
  );
};

export default PlaceList;
