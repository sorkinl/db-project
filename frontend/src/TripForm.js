import React from "react";

const TripForm = ({ tripList, loadTrips }) => {
  console.log(tripList);
  return (
    <div>
      <button onClick={() => loadTrips()}>Load Trips</button>
      {tripList.map((trip) => (
        <div>
          <h3>{trip.name}</h3>
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
