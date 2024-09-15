// Define the model
const model = tf.sequential();

// Add a hidden layer
model.add(tf.layers.dense({ units: 8, inputShape: [4], activation: 'relu' }));

// Add an output layer
model.add(tf.layers.dense({ units: 1, activation: 'sigmoid' }));

// Compile the model
model.compile({ optimizer: 'adam', loss: 'binaryCrossentropy', metrics: ['accuracy'] });

// Sample training data (normalized between 0 and 1)
const trainingData = tf.tensor2d([
  [0.3, 0.5, 0.6, 0],    // Low moisture, moderate temp, high humidity, sunny
  [0.7, 0.6, 0.4, 0],    // High moisture, high temp, low humidity, sunny
  [0.5, 0.4, 0.5, 1],    // Moderate moisture, low temp, moderate humidity, rain expected
  [0.2, 0.7, 0.3, 0.5],  // Very low moisture, very high temp, low humidity, cloudy
  [0.6, 0.3, 0.7, 1],    // High moisture, low temp, high humidity, rain expected
]);

const outputData = tf.tensor2d([
  [1],  // Irrigation needed
  [0],  // Irrigation not needed
  [0],  // Irrigation not needed
  [1],  // Irrigation needed
  [0],  // Irrigation not needed
]);

// Train the model
async function trainModel() {
  await model.fit(trainingData, outputData, { epochs: 200 });
}

trainModel();

function predictIrrigation() {
  const soilMoisture = parseFloat(document.getElementById('soilMoisture').value) / 100;
  const temperature = (parseFloat(document.getElementById('temperature').value) + 20) / 70;
  const humidity = parseFloat(document.getElementById('humidity').value) / 100;
  const weatherForecast = parseFloat(document.getElementById('weatherForecast').value);

  // Create input tensor
  const inputData = tf.tensor2d([[soilMoisture, temperature, humidity, weatherForecast]]);

  // Make prediction
  const prediction = model.predict(inputData);
  prediction.array().then(result => {
    const score = result[0][0];
    const resultBox = document.getElementById('resultBox');
    const resultText = document.getElementById('resultText');
    if (score > 0.5) {
      resultBox.className = 'notification is-success';
      resultText.innerHTML = '<strong>Irrigation Recommended:</strong> Conditions indicate that irrigation is necessary to optimize crop yield.';
    } else {
      resultBox.className = 'notification is-danger';
      resultText.innerHTML = '<strong>No Irrigation Needed:</strong> Current conditions are sufficient; irrigation is not required at this time.';
    }
    resultBox.classList.remove('is-hidden');
    // Smooth scroll to the result
    resultBox.scrollIntoView({ behavior: 'smooth' });
  });
}
