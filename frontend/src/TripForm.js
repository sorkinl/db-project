import React from "react";

const TripForm = ({
  tripList,
  loadTrips,
  setTripId,
  setModal,
  setInputValues,
  setClicks,
  loadMyTrips,
}) => {
  console.log(tripList);

  const sendTripData = (trip) => {
    const marker1 = new window.google.maps.LatLng(trip.origin.x, trip.origin.y);
    const marker2 = new window.google.maps.LatLng(
      trip.destination.x,
      trip.destination.y
    );
    setTripId(trip.trip_id);
    setModal(false);
    setInputValues({ tripName: trip.name });
    setClicks([marker1, marker2]);
  };
  return (
    <div>
      <button onClick={() => loadTrips()}>Load Trips</button>
      <button onClick={() => loadMyTrips()}>Load My Trips</button>
      {tripList.map((trip) => (
        <div>
          <h3
            onClick={() => {
              sendTripData(trip);
            }}
          >
            {trip.name}
          </h3>
          <p>User ID: {trip.uid}</p>
          <p>
            Origin: {trip.origin.x}, {trip.origin.y}
          </p>
          <p>
            Destination: {trip.destination.x}, {trip.destination.y}
          </p>
        </div>
      ))}
    </div>
  );
};

export default TripForm;
