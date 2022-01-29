import { Button, Paper, Typography } from "@mui/material";
import * as tf from "@tensorflow/tfjs";
import { useEffect, useState } from "react";
import styled from "styled-components";
import RadioArea from "./RadioArea";
const mobilenet = require("@tensorflow-models/mobilenet");

const categories = [
  "butterfly",
  "cat",
  "chicken",
  "cow",
  "dog",
  "elephant",
  "horse",
  "sheep",
  "spider",
  "squirrel",
];

function Model() {
  const [image, setImage] = useState();
  const [model, setModel] = useState();
  const [predictions, setPredictions] = useState([]);
  const [predictionIndex, setPredictionIndex] = useState();
  const [selectedModel, setSelectedModel] = useState("v1");
  const [loadedModels, setLoadedModels] = useState({
    v1: null,
    v2: null,
    tf: null,
  });

  // Handle change of images
  const handleChange = (e) => {
    if (e.target.files.length > 0) {
      setImage(URL.createObjectURL(e.target.files[0]));
    }
    setPredictionIndex(null);
  };

  const loadModel = async (modelName, url) => {
    try {
      const model = await tf.loadLayersModel(url);
      setLoadedModels((loadedModels) => ({
        ...loadedModels,
        [modelName]: model,
      }));
    } catch (error) {
      setModel("not-found");
    }
  };

  const loadTFModel = async () => {
    const model = await mobilenet.load();
    setLoadedModels((loadedModels) => ({
      ...loadedModels,
      tf: model,
    }));
  };

  const handleRadioChange = (event) => {
    setSelectedModel(event.target.value);
  };

  const predict = async () => {
    const imageEl = document.getElementById("image");
    if (selectedModel === "tf") {
      // TODO: show predictions predictions
      const predictions = await model.classify(imageEl);
      console.log(predictions);
    } else {
      let imagePrediction = await tf.browser.fromPixels(imageEl);
      const imageSize = selectedModel === "v1" ? [80, 80] : [180, 180];
      imagePrediction = tf.image.resizeBilinear(imagePrediction, imageSize);
      imagePrediction = imagePrediction.expandDims(0);

      const result = await model.predict(imagePrediction);
      const data = await result.data();
      calculatePrediction(data);
      setPredictions(data);
    }
  };

  const calculatePrediction = (prediction) => {
    let biggestPrediction = 0;
    let categoryIndex = 0;

    for (let index = 0; index < prediction.length; index++) {
      if (prediction[index] > biggestPrediction) {
        biggestPrediction = prediction[index];
        categoryIndex = index;
      }
    }
    setPredictionIndex(categoryIndex);
  };

  // Load models
  useEffect(() => {
    loadModel("v1", "http://127.0.0.1:5500/v1/model.json");
    loadModel("v2", "http://127.0.0.1:5500/v2/model.json");
    loadTFModel();
  }, []);

  useEffect(() => {
    setModel(loadedModels[selectedModel]);
  }, [loadedModels, selectedModel]);

  return (
    <Wrapper>
      <Typography sx={{ py: 1 }}>
        {model === undefined
          ? "Loading model"
          : model === "not-found"
          ? "Failed to load model"
          : "Model loaded"}
      </Typography>
      {typeof predictionIndex === "number" ? (
        <Typography variant="h5" component="p" sx={{ py: 2 }}>
          Prediction:{" "}
          <Typography
            component="span"
            color="primary"
            variant="h4"
            style={{ textTransform: "capitalize" }}
          >
            {categories[predictionIndex]}
          </Typography>
        </Typography>
      ) : (
        <Typography sx={{ py: 4 }}>
          Youu need to upload image at first and then click on predict button
        </Typography>
      )}
      <BtnWrapper>
        <Button variant="contained" component="label">
          Upload image
          <input
            type="file"
            onChange={handleChange}
            accept=".jpg, .jpeg, .png"
            hidden
          />
        </Button>
        <Button variant="contained" onClick={predict} disabled={!image}>
          Predict
        </Button>
        <RadioArea
          selectedModel={selectedModel}
          setSelectedModel={handleRadioChange}
        />
      </BtnWrapper>
      <ResultsWrapper>
        <ImageWrapper>
          <Image
            id="image"
            src={image}
            alt="Prediction file"
            displayImage={!!image}
          />
        </ImageWrapper>
        {typeof predictionIndex === "number" && predictions.length !== 0 && (
          <Paper elevation={3} sx={paperStyles}>
            <Table>
              <thead style={{ fontWeight: "bold" }}>
                <Row>
                  <td>Category</td>
                  <td>Percentage</td>
                </Row>
              </thead>
              <tbody>
                {categories.map((category, idx) => (
                  <Row key={category}>
                    <td>{category}</td>
                    <td>
                      {Number.parseFloat(predictions[idx] * 100).toPrecision(4)}
                    </td>
                  </Row>
                ))}
              </tbody>
            </Table>
          </Paper>
        )}
      </ResultsWrapper>
    </Wrapper>
  );
}

export default Model;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 1200px;
  margin: auto;
`;

const Image = styled.img`
  width: 100%;
  height: "auto";
  display: ${({ displayImage }) => (displayImage ? "block" : "none")};
`;

const BtnWrapper = styled.div`
  display: flex;
  gap: 1em;
`;

const ImageWrapper = styled.div`
  width: 50%;
`;

const ResultsWrapper = styled.div`
  display: flex;
  gap: 3em;
  padding: 2em 0;
`;

const Table = styled.table`
  width: 50%;
`;

const Row = styled.tr`
  display: flex;
  gap: 2.5em;
  justify-content: space-between;
`;

const paperStyles = {
  padding: 6,
};