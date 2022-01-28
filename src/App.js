import * as tf from "@tensorflow/tfjs";
import { useEffect, useState } from "react";
import styled from "styled-components";

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

function App() {
  const [image, setImage] = useState();
  const [model, setModel] = useState();
  const [predictions, setPredictions] = useState([]);
  const [predictionIndex, setPredictionIndex] = useState();
  console.log(predictions);

  // Handle change of images
  const handleChange = (e) => {
    if (e.target.files.length > 0) {
      setImage(URL.createObjectURL(e.target.files[0]));
    }
    setPredictionIndex(null);
  };

  const predict = async () => {
    const imageEl = document.getElementById("image");
    let imagePrediction = await tf.browser.fromPixels(imageEl);
    imagePrediction = tf.image.resizeBilinear(imagePrediction, [80, 80]);
    imagePrediction = imagePrediction.expandDims(0);

    const result = await model.predict(imagePrediction);
    const data = await result.data();
    calculatePrediction(data);
    setPredictions(data);
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

  // Load model
  useEffect(() => {
    const loadModel = async () => {
      try {
        const model = await tf.loadLayersModel(
          "http://127.0.0.1:5500/model.json"
        );
        setModel(model);
      } catch (error) {
        setModel("not-found");
      }
    };

    loadModel();
  }, []);

  return (
    <Wrapper>
      <h1>Animal image classifier</h1>
      {typeof predictionIndex === "number" ? (
        <p>Prediction: {categories[predictionIndex]}</p>
      ) : (
        <p>
          Youu need to upload image at first and then click on predict button
        </p>
      )}
      <p>
        {model === undefined
          ? "Loading model"
          : model === "not-found"
          ? "Failed to load model"
          : "Model loaded"}
      </p>
      <BtnWrapper>
        <input type="file" onChange={handleChange} accept=".jpg, .jpeg, .png" />
        <button onClick={predict} disabled={!image}>
          Predict
        </button>
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
        <Table>
          {typeof predictionIndex === "number" && predictions.length !== 0 && (
            <>
              <thead>
                <tr>
                  <td>Category</td>
                  <td>Percentage</td>
                </tr>
              </thead>
              <tbody>
                {categories.map((category, idx) => (
                  <tr key={category}>
                    <td>{category}</td>
                    <td>
                      {Number.parseFloat(predictions[idx] * 100).toPrecision(4)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </>
          )}
        </Table>
      </ResultsWrapper>
    </Wrapper>
  );
}

export default App;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 1200px;
  margin: auto;
  padding-top: 8em;
`;

const Image = styled.img`
  width: 100%;
  height: "auto";
  display: ${({ displayImage }) => (displayImage ? "block" : "none")};
`;

const BtnWrapper = styled.div`
  display: flex;
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
