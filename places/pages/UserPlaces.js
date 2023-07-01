import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import PlaceList from "../components/PlaceList";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";

const UserPlaces = () => {
  const [loadedLifts, setLoadedLifts] = useState();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const userId = useParams().userId;
  console.log({ userId });
  useEffect(() => {
    console.log(userId);
    const fetchLifts = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/lifts/user/${userId}`
        );
        setLoadedLifts(responseData.lifts);
      } catch (err) {}
    };
    fetchLifts();
  }, [sendRequest, userId]);

  const liftDeleteHandler = (deletedLiftId) => {
    setLoadedLifts((prevLifts) =>
      prevLifts.filter((lift) => lift.id !== deletedLiftId)
    );
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedLifts && (
        <PlaceList items={loadedLifts} onDeleteLift={liftDeleteHandler} />
      )}
    </React.Fragment>
  );
};

export default UserPlaces;
