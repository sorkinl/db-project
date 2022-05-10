import * as React from "react";
import { Wrapper } from "@googlemaps/react-wrapper";
import Map from "./Map";
import Marker from "./Marker";
import axios from "axios";
import ReactModal from "react-modal";
import TripForm from "./TripForm";
import SignIn from "./SignIn";
const render = (status) => {
  return <h1>{status}</h1>;
};
/**
 *
 * booking
 * filters
 */
const App = () => {
  // [START maps_react_map_component_app_state]
  const [clicks, setClicks] = React.useState([]);
  const [zoom, setZoom] = React.useState(11); // initial zoom
  const [center, setCenter] = React.useState({
    lat: 40.22400816825143,
    lng: -77.06010466183004,
  });
  const [tripList, setTripList] = React.useState([]);
  const [modal, setModal] = React.useState(false);
  const [tripId, setTripId] = React.useState(null);
  /**
   * 1 - tripform
   * 2 - password form
   * 3
   */
  const [modalForm, setModalForm] = React.useState(0);
  const [user, setUser] = React.useState({
    uid: 14,
    username: "sorkinl1",
  });
  const [inputValues, setInputValues] = React.useState({
    username: "",
    password: "",
    tripName: "",
  });

  const [tripData, setTripData] = React.useState({
    tripName: "",
    origin: {
      lat: "",
      lng: "",
    },
    destination: {
      lat: "",
      lng: "",
    },
  });

  const loadTrips = () => {
    axios
      .get("/api/getAllTrips")
      .then((res) => {
        setTripList(res.data.results);
        console.log(res);
        console.log(tripList);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const loadMyTrips = () => {
    axios
      .get(`/api/getUserTrips/${user.uid}`)
      .then((res) => {
        setTripList(res.data.results);
        console.log(res);
        console.log(tripList);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const loadBookedTrips = () => {
    axios
      .get(`/api/getBookedTrips/${user.uid}`)
      .then((res) => {
        setTripList(res.data.results);
        console.log(res);
        console.log(tripList);
      })
      .catch((err) => {
        console.error(err);
      });
  };
  const filter10000 = async () => {
    console.log(clicks[0]);
    const response = await axios.get("/api/filter/10000", {
      params: {
        originLat: clicks[0].lat(),
        originLng: clicks[0].lng(),
        destinationLat: clicks[1].lat(),
        destinationLng: clicks[1].lng(),
      },
    });
    setTripList(response.data.results[0]);
  };

  const filter50000 = async () => {
    console.log(clicks[0]);
    const response = await axios.get("/api/filter/50000", {
      params: {
        originLat: clicks[0].lat(),
        originLng: clicks[0].lng(),
        destinationLat: clicks[1].lat(),
        destinationLng: clicks[1].lng(),
      },
    });
    setTripList(response.data.results[0]);
  };

  const filter100000 = async () => {
    console.log(clicks[0]);
    const response = await axios.get("/api/filter/100000", {
      params: {
        originLat: clicks[0].lat(),
        originLng: clicks[0].lng(),
        destinationLat: clicks[1].lat(),
        destinationLng: clicks[1].lng(),
      },
    });
    setTripList(response.data.results[0]);
  };
  const deleteTrip = () => {
    axios
      .delete("/api/delete", { data: { tripId: tripList[0].tripId } })
      .then((res) => {
        loadTrips();
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const onClick = (e) => {
    // avoid directly mutating state
    if (e.latLng && clicks.length < 2) {
      console.log(e.latLng);
      setClicks([...clicks, e.latLng]);
    }
  };

  const addTrip = () => {
    if (clicks.length == 2 && user.uid && inputValues.tripName.length != 0) {
      console.log("here");
      axios
        .post("/api/addTrip", {
          name: inputValues.tripName,
          origin: clicks[0],
          destination: clicks[1],
          uid: user.uid,
          capacity: 1,
        })

        .then(function (response) {
          console.log(response);
          setInputValues({});
          setClicks([]);
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
  const updateTrip = () => {
    if (clicks.length == 2 && user.uid && inputValues.tripName.length != 0) {
      console.log("here");
      axios
        .post("/api/updateTrip", {
          tripId: tripId,
          name: inputValues.tripName,
          origin: clicks[0],
          destination: clicks[1],
          uid: user.uid,
        })

        .then(function (response) {
          console.log(response);
          setInputValues({});
          setClicks([]);
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  };
  const handleOnChange = (event) => {
    const { name, value } = event.target;
    setInputValues({ ...inputValues, [name]: value });
  };

  const signIn = () => {
    axios
      .post("api/signin", {
        username: inputValues.username,
        pw_hash: inputValues.password,
      })
      .then((res) => {
        console.log(res);
        setUser(res.data.results[0]);
        setModal(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const signUp = () => {
    axios
      .post("/api/signup", {
        username: inputValues.username,
        pw: inputValues.password,
      })
      .then((res) => {
        console.log(res);
        setUser(res.data);
        setModal(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const tripForm = (
    <div>
      <input placeholder="Trip name"></input>
      <input placeholder="Origin"></input>
      <input placeholder="Origin"></input>
    </div>
  );

  console.log(clicks);
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
        <h3>Current user: {user.uid ? user.username : "None"}</h3>
        {tripId && <h3>Trip id: {tripId}</h3>}
        <input
          placeholder="Trip name"
          onChange={handleOnChange}
          name="tripName"
          value={inputValues.tripName}
        ></input>
        <h3>
          {clicks.length === 0 ? "Click on map to add markers" : "Clicks"}
        </h3>
        {clicks.map((latLng, i) => (
          <pre key={i}>{JSON.stringify(latLng.toJSON(), null, 2)}</pre>
        ))}

        <button
          onClick={() => {
            setClicks([]);
          }}
        >
          Clear
        </button>
        <button onClick={() => addTrip()}>Add Trip</button>
        {tripId && <button onClick={() => updateTrip()}>Update trip</button>}
        <button
          onClick={() => {
            setModal(true);
            setModalForm(1);
          }}
        >
          Load trips
        </button>
        <button
          onClick={() => {
            setModal(true);
            setModalForm(2);
          }}
        >
          Sign in
        </button>

        <ReactModal isOpen={modal} contentLabel="Minimal Modal Example">
          {modalForm == 1 && (
            <TripForm
              tripList={tripList}
              loadTrips={loadTrips}
              setModal={setModal}
              setTripId={setTripId}
              setInputValues={setInputValues}
              setClicks={setClicks}
              loadMyTrips={loadMyTrips}
              user={user}
              loadBookedTrips={loadBookedTrips}
              filter10000={filter10000}
              filter50000={filter50000}
              filter100000={filter100000}
            />
          )}
          {modalForm == 2 && (
            <SignIn
              handleOnChange={handleOnChange}
              inputValues={inputValues}
              signIn={signIn}
              signUp={signUp}
            />
          )}
          <button onClick={() => setModal(false)}>Close Modal</button>
        </ReactModal>
      </div>
    </div>
  );
  // [END maps_react_map_component_app_return]
};

export default App;
