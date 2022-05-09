import React from "react";
import axios from "axios";

const TripForm = ({
  tripList,
  loadTrips,
  setTripId,
  setModal,
  setInputValues,
  setClicks,
  loadMyTrips,
  user,
  loadBookedTrips,
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

  const bookTrip = (trip) => {
    axios
      .post("/api/bookTrip", {
        tripId: trip.trip_id,
        uid: user.uid,
      })
      .then(() => {
        setModal(false);
      })
      .catch((err) => console.log(err));
  };

  const deleteTrip = (trip) => {
    axios
      .delete(`/api/deleteTrip/${trip.trip_id}`, {
      })
      .then(() => {
        setModal(false);
      })
      .catch((err) => console.log(err));
  }

  return (
    <div>
      <button onClick={() => loadTrips()}>Load Trips</button>
      <button onClick={() => loadMyTrips()}>Load My Trips</button>
      <button onClick={() => loadBookedTrips()}>Load booked Trips</button>
      {tripList.map((trip) => (
        <div key={trip.trip_id}>
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
          <p>Capacity: {trip.capacity}</p>
          {trip.uid != user.uid && trip.capacity != 0 && (
            <button onClick={() => bookTrip(trip)}>Book</button>
          )}
          {trip.uid != user.uid && trip.capacity != 0 && (
            <button onClick={() => deleteTrip(trip)}>Delete</button>
          )}
        </div>
      ))}
    </div>
  );
};

export default TripForm;
