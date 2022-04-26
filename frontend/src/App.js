import * as React from "react";
import { Wrapper } from "@googlemaps/react-wrapper";
import Map from "./Map";
import Marker from "./Marker";
import axios from "axios";
const render = (status) => {
  return <h1>{status}</h1>;
};

const App = () => {
  // [START maps_react_map_component_app_state]
  const [clicks, setClicks] = React.useState([]);
  const [zoom, setZoom] = React.useState(3); // initial zoom
  const [center, setCenter] = React.useState({
    lat: 0,
    lng: 0,
  });
  const [tripList, setTripList] = React.useState([]);

  const loadTrips = () => {
    axios
      .get("/api/getAllTrips")
      .then((res) => {
        setTripList(res.data.results);
        console.log(res);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const onClick = (e) => {
    // avoid directly mutating state
    if (e.latLng && clicks.length < 2) {
      setClicks([...clicks, e.latLng]);
    }
  };

  const addTrip = () => {
    console.log("here1", clicks.length);

    if (clicks.length == 2) {
      console.log("here");
      axios
        .post("/api/addTrip", {
          name: "Trip1",
          origin: clicks[0],
          destination: clicks[1],
          uid: 1,
        })
        .then(function (response) {
          console.log(response);
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  };

  const onIdle = (m) => {
    console.log("onIdle");
    if (m.getZoom()) {
      setZoom(m.getZoom());
    }
    if (m.getCenter()) {
      setCenter(m.getCenter().toJSON());
    }
  };
  // [END maps_react_map_component_app_state]

  const form = (
    <div
      style={{
        padding: "1rem",
        flexBasis: "250px",
        height: "100%",
        overflow: "auto",
      }}
    >
      <label htmlFor="zoom">Zoom</label>
      <input
        type="number"
        id="zoom"
        name="zoom"
        value={zoom}
        onChange={(event) => setZoom(Number(event.target.value))}
      />
      <br />
      <label htmlFor="lat">Latitude</label>
      <input
        type="number"
        id="lat"
        name="lat"
        value={center.lat}
        onChange={(event) =>
          setCenter({ ...center, lat: Number(event.target.value) })
        }
      />
      <br />
      <label htmlFor="lng">Longitude</label>
      <input
        type="number"
        id="lng"
        name="lng"
        value={center.lng}
        onChange={(event) =>
          setCenter({ ...center, lng: Number(event.target.value) })
        }
      />
      <h3>{clicks.length === 0 ? "Click on map to add markers" : "Clicks"}</h3>
      {clicks.map((latLng, i) => (
        <pre key={i}>{JSON.stringify(latLng.toJSON(), null, 2)}</pre>
      ))}
      <button onClick={() => setClicks([])}>Clear</button>
      <button onClick={() => addTrip()}>Add Trip</button>
      <button onClick={() => loadTrips()}>Load trips</button>
      <div>
        {tripList.map((trip) => (
          <h1>{trip.name}</h1>
        ))}
      </div>
    </div>
  );

  // [START maps_react_map_component_app_return]
  return (
    <div style={{ display: "flex", height: "100%" }}>
      <Wrapper
        apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
        render={render}
      >
        <Map
          center={center}
          onClick={onClick}
          onIdle={onIdle}
          zoom={zoom}
          style={{ flexGrow: "1", height: "100%" }}
        >
          {clicks.map((latLng, i) => (
            <Marker key={i} position={latLng} />
          ))}
        </Map>
      </Wrapper>
      {/* Basic form for controlling center and zoom of map. */}
      {form}
    </div>
  );
  // [END maps_react_map_component_app_return]
};

export default App;