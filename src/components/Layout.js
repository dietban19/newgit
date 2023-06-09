import { useEffect, useRef, useState } from "react";
import { Outlet, useNavigate, Link } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import Obituary from "./Obituary";
import { RiAddCircleLine } from "react-icons/ri";
import axios from "axios";

//zvdudnw2
function Layout() {
  const navigate = useNavigate();
  const mainContainerRef = useRef(null);
  const audioRef = useRef(null);

  // selectedFile is the image that was choosen by the user
  const [selectedFile, setSelectedFile] = useState("");
  const [selectedFileName, setSelectedFileName] = useState("");

  const [birthDate, setBirthDate] = useState("");
  const [deathDate, setDeathDate] = useState("");
  const [name, setName] = useState("");

  // want the details of the obituaries to be independent and unique, store in array
  const [obituaries, setObituaries] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const [imageUrl, setImageUrl] = useState("");
  const [audioUrl, setAudioUrl] = useState("");

  const [gptDescription, setGptDescription] = useState("");
  const [fetchedObituaries, setFetchedObituaries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mainLoad, setMainLoad] = useState(false);
  const getDeviceId = () => {
    let deviceId = localStorage.getItem("deviceId");
    if (!deviceId) {
      deviceId = uuidv4();
      localStorage.setItem("deviceId", deviceId);
    }
    return deviceId;
  };

  const deviceId = getDeviceId();

  /**
   * Asynchronously fetches the obituaries associated with the current device ID.
   * @async
   * @function
   * @returns {Promise<void>}
   */
  useEffect(() => {
    console.log("LOADING");
    setMainLoad(true);
    const fetchObituaries = async () => {
      try {
        const response = await fetch(
          `https://oluenjzsd7mpt6f2mp2qoam7xe0rjhkh.lambda-url.ca-central-1.on.aws/${deviceId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              // "authorization": user.access_token, // Uncomment this if you need to pass an access token
            },
          }
        );

        if (response.status === 200) {
          console.log("SUCCESS!!");
          const obituary_arr = await response.json();
          setFetchedObituaries(obituary_arr);
        } else {
          console.error(`Error fetching obituaries: ${response.status}`);
        } setMainLoad(false)
      } catch (error) {
        console.error("Error fetching obituaries:", error);
      }
    };

    fetchObituaries();
  }, []);
  console.log(fetchedObituaries)

  /**
   * useEffect that checks if the values for imageUrl, gptDescription, and audioUrl exists
   * used this to have a small delay to add the new information into obituary
   *
   * stores the values of the items from the fetches to api to the array
   */
  useEffect(() => {
    if (imageUrl && gptDescription && audioUrl) {
      const newObituary = {
        deviceID: deviceId,
        id: uuidv4(),
        name: name,
        birthDate: birthDate,
        deathDate: deathDate,
        image: imageUrl,
        description: gptDescription,
        audio: audioUrl,
      };

      setObituaries([...obituaries, newObituary]);
      setSelectedFile("");
      setSelectedFileName("");
      setBirthDate("");
      setDeathDate("");
      setName("");
      closePopup();
    }
  }, [imageUrl, obituaries, name, birthDate, deathDate]);

  useEffect(() => {
    if ((obituaries.length === 0 && fetchedObituaries.length > 0)) {
      console.log("WORKING")
      setObituaries([...fetchedObituaries]);
    }
  }, [obituaries, fetchedObituaries]);

  useEffect(() => {
    if (obituaries.length <= 0) {
      navigate("/");
      return;
    }
    navigate("/obituaries");
  }, [obituaries, navigate]);

  const openPopup = () => {
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    // Reset the form data
    setSelectedFile(null);
    setBirthDate(null);
    setDeathDate(null);
    setImageUrl("");
    setGptDescription("");
    setAudioUrl("");

    setIsPopupOpen(false);
  };

  useEffect(() => {
    const body = document.querySelector("body");
    if (isPopupOpen) {
      body.classList.add("popup-open");
    } else {
      body.classList.remove("popup-open");
    }
  }, [isPopupOpen]);
  // const generateTransformedImageUrl = (publicId, effect) => {
  //   const baseUrl = "https://res.cloudinary.com/dx0n3s9h4/image/upload";
  //   return `${baseUrl}/${effect}/${publicId}`;
  // };

  const handleNameChange = (event) => {
    setName(event.target.value);
  };
  const handleBirthDateChange = (event) => {
    setBirthDate(event.target.value);
  };

  const handleDeathDateChange = (event) => {
    setDeathDate(event.target.value);
  };

  const handleFileChange = (event) => {
    if (event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
      setSelectedFileName(event.target.files[0].name);
    } else {
      setSelectedFile(null);
      setSelectedFileName(null);
    }
    console.log(
      "SELECTED FILE IS",
      selectedFile,
      "OTHER IS \n",
      selectedFileName
    );
  };

  // const handleInputChange = (setStateFunction, event) => {
  //   setStateFunction(event.target.value);
  // };

  // const playAudio = () => {
  //   if (audioRef.current) {
  //     audioRef.current.play();
  //   }a
  // };
  const handleWriteObituary = async () => {
    setLoading(true);
    if (birthDate && deathDate) {
      const formData = new FormData();
      formData.append("deviceID", deviceId); // partition key
      formData.append("id", uuidv4()); // sort key
      formData.append("name", name);
      formData.append("image", selectedFile);
      formData.append("birthDate", birthDate);
      formData.append("deathDate", deathDate);

      //the code creates a set of key/value pairs that can be sent as part of an HTTP request.
      console.log("LOADING", loading);
      try {
        // sends an HTTP POST request to the URL
        //passing in the formData object as the request body.
        const response = await axios.post(
          "https://tzduudnsqngo3jwtcb47kzsuva0xuuml.lambda-url.ca-central-1.on.aws/",
          formData, //By passing in the formData object as the request body, the code is
          //
          //sending a set of key/value pairs representing form data to the specified URL.
          {
            //object containing headers for the request.
            headers: {
              "content-type": "multipart/form-data",
            },
          }
        );

        // console.log("THE RESPONSE: ",response);
        setImageUrl(response.data.image_url);
        setGptDescription(response.data.gpt_response);
        setAudioUrl(response.data.audio_file);

        if (response.status === 200) {
          // console.log("ayy")
        } else {
          alert("Error occurred while creating obituary.");
        }
      } catch (error) {
        console.error(
          "Error calling the create-obituary Lambda function:",
          error
        );
        alert("Error occurred while creating obituary.");
      }
      setLoading(false);
    } else {
      alert("Please enter both birth and death date/time");
    }
    console.log(loading);
  };

  return (
    <div id="container">
      <header>
        <aside>
          {/* <button id="menu-button" onClick={() => setCollapse(!collapse)}>
            &#9776;
          </button> */}
          &nbsp;
        </aside>

        <div id="top-header">
          <Link to="/notes">The Last Show</Link>
        </div>

        <aside>
          <button id="add-button" onClick={openPopup}>
            + Add Obituary
          </button>
        </aside>
      </header>

      <div id="main-container" ref={mainContainerRef}>
        <body>
          {mainLoad&&<div className = "main-loading"></div>}
          <div>
            {isPopupOpen && (
              <>
              {loading && <div className = "popup-loading"></div>}
                <div className="popup">
                  {/* <div className="loading">Loading...</div> */}
                  {/* {loading && <div className="loading">Loading...</div>} */}

                  <div id="popup-top">
                    <button id="popup-top-button" onClick={closePopup}>
                      <span className="icon">&lt;</span> Back
                    </button>
                  </div>
                  <div className="popup-container">
                    <div className="popup-header">
                      <h1>Create a New Obituary</h1>
                      <br></br>
                    </div>
                    <div className="popup-info">
                      <div className="image-input">
                        <input
                          type="file"
                          id="file"
                          accept="image/*"
                          onChange={(event) => {
                            handleFileChange(event);
                          }}
                          disabled={loading}
                        ></input>
                        <label htmlFor="file" id="choose-image">
                          <div id="select-image">
                            <i className="select-image-icon">
                              <RiAddCircleLine />
                            </i>
                            Select an Image for the Deceased
                          </div>
                        </label>

                        <span>
                          {selectedFile && `Selected file: ${selectedFileName}`}
                        </span>
                      </div>
                      <div className="popup-contents-main">
                        <input
                          id="input-name"
                          type="text"
                          value={name}
                          onChange={(event) => handleNameChange(event)}
                          disabled={loading}
                        />
                        <div id="date-container">
                          <h3>
                            Born:{" "}
                            <input
                              type="datetime-local"
                              value={birthDate}
                              onChange={(event) => handleBirthDateChange(event)}
                              disabled={loading}
                            ></input>
                          </h3>
                          <h3>
                            Died:{" "}
                            <input
                              type="datetime-local"
                              value={deathDate}
                              onChange={(event) => handleDeathDateChange(event)}
                              disabled={loading}
                            ></input>
                          </h3>
                        </div>
                      </div>
                    </div>
                    <div className="popup-bottom">
                      <div id="popup-button">
                        <button
                          onClick={handleWriteObituary}
                          disabled={
                            !birthDate ||
                            !deathDate ||
                            !selectedFile ||
                            !name ||
                            loading
                          }
                          className={
                            !birthDate ||
                            !deathDate ||
                            !name ||
                            !selectedFile ||
                            loading
                              ? "button-disabled"
                              : "button-enabled"
                          }
                        >
                          {loading ? "Loading..." : "Write Obituary"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="blur-background"></div>;
              </>
            )}
            <div className="main-container">
              <Obituary obituaries={obituaries} />
            </div>
          </div>
          <Outlet />
        </body>
      </div>

    </div>
  );
}

export default Layout;
