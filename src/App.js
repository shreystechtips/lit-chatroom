import React from "react";
import {
  Typography,
  Grid,
  AppBar,
  Button,
  TextField,
  makeStyles,
} from "@material-ui/core";
import Center from "react-center";
import YouTube from "react-youtube";
import * as firebase from "firebase";
import "firebase/database";
const useStyles = makeStyles((theme) => ({
  root: {
    height: "100vh",
    width: "100vw",
    backgroundColor: "black",
  },
  chatMessage: {},
  text: {
    color: "white",
  },
}));

var firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_DOMAIN,
  databaseURL: process.env.REACT_APP_DB,
  projectId: process.env.REACT_APP_ID,
  appId: process.env.REACT_APP_APP_ID,
};

firebase.initializeApp(firebaseConfig);

let db = firebase.database().ref();

let scrolled = false;
function App() {
  const classes = useStyles();
  const videos = ["dQw4w9WgXcQ", "iLBBRuVDOo4", "K_IjoAdYIco"];
  const [currElement, setCurrElement] = React.useState(
    videos[Math.floor(Math.random() * videos.length)]
  );
  const [height, setHeight] = React.useState(window.innerHeight);
  const [data, setData] = React.useState([]);
  const [msg, setMsg] = React.useState("");

  async function getElement(currElement, e) {
    let temp = videos[Math.floor(Math.random() * videos.length)];
    while (temp == currElement) {
      temp = videos[Math.floor(Math.random() * videos.length)];
    }
    setCurrElement(temp);
  }
  function setWindowHeight() {
    setHeight(window.innerHeight);
    console.log(window.outerHeight);
  }

  window.addEventListener("resize", setWindowHeight);
  setInterval(scroll, 1000);
  var values = db.child("messages").orderByChild("timestamp").limitToLast(100);

  React.useEffect(async () => {
    values.on("value", gotData, errData);
  }, []);

  function errData(err) {
    console.log("Error!");
    console.log(err);
  }

  function gotData(dataIn) {
    let total = [];
    try {
      setData(Object.values(dataIn.val()));
    } catch (e) {
      setData([]);
    }
  }

  function scroll() {
    var element = window.document.getElementById("comments");
    if (!scrolled) {
      element.scrollTop = element.scrollHeight;
    }
  }

  async function keyPress(e) {
    if (e.keyCode == 13) {
      const input = msg.trim();
      if (input !== "") {
        console.log(input);
        let msgRef = firebase.database().ref().child("messages");
        var msgLoc = msgRef.push();
        (await msgLoc).set({ msg: input });
        setMsg("");
      }
    }
  }
  return (
    <div className={classes.root}>
      <Center>
        <Grid
          container
          spacing={3}
          direction="row"
          style={{ height: "100vh", width: "100vw" }}
        >
          <Grid
            item
            xs={9}
            style={{
              height: "100vh",
            }}
          >
            <YouTube
              opts={{
                width: "100%",
                height: window.innerHeight,
                playerVars: { autoplay: 1, controls: 0 },
              }}
              videoId={currElement}
              onEnd={async (e) => {
                await getElement(currElement, e);
                e.target.playVideo();
              }}
            />
          </Grid>
          <Grid
            item
            xs={3}
            style={{
              padding: 20,
              borderLeftWidth: 5,
              borderLeftColor: "white",
            }}
          >
            <Grid container direction="column">
              <Grid item>
                <Typography className={classes.text}>Video Chat</Typography>
              </Grid>
              <Grid item>
                <div
                  style={{
                    overflowY: "scroll",
                    maxHeight: "90vh",
                    bottom: 100,
                  }}
                  id="comments"
                  onScroll={(e) => {
                    var element = window.document.getElementById("comments");
                    if (element.scrollTop == element.scrollHeight) {
                      scroll = false;
                    } else {
                      scrolled = true;
                    }
                  }}
                >
                  <div
                    style={{
                      minHeight: "90vh",
                      width: "100%",
                    }}
                  >
                    <hr style={{ color: "white" }} />
                    {data.map((msg) => (
                      <div key={msg.timestamp}>
                        <Typography className={classes.text}>
                          {msg.msg}
                        </Typography>
                        <hr style={{ color: "white" }} />
                      </div>
                    ))}
                  </div>
                </div>
                <Grid item style={{ backgroundColor: "white", padding: 5 }}>
                  <TextField
                    label="Enter message"
                    filled
                    value={msg}
                    onChange={(val) => setMsg(val.target.value)}
                    style={{ color: "white" }}
                    onKeyDown={async (e) => keyPress(e)}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Center>
    </div>
  );
}

export default App;
