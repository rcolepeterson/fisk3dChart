// Declare global variables
let scene, camera, font;
let isMetric = false;
const gridSizeX = 16; // Number of columns
const gridSizeY = 7; // Number of rows
const cubeSize = 0.4;
// Assuming cubeSize is defined somewhere above
const baseCubeHeight = cubeSize;

// Store the initial window size
let initialWindowWidth = window.innerWidth;
let initialWindowHeight = window.innerHeight;

// Load the font using FontLoader at the beginning
const loader = new THREE.FontLoader();
loader.load(
  // "https://threejs.org/examples/fonts/helvetiker_regular.typeface.json",
  "../fonts/Gotham Rounded Medium_Regular_3.json",
  function (loadedFont) {
    font = loadedFont;
    // Continue with loading JSON data
    loadJSONData();
  }
);

function updateDropdownValues(dropdownId) {
  const dropdown = document.getElementById(dropdownId);
  dropdown.innerHTML = ""; // Remove all existing options

  //console.log(`Updating ${dropdownId} dropdown. isMetric: ${isMetric}`);

  if (dropdownId === "minTensileStrength") {
    // For tensile strength, use the multiplier approach
    const options = isMetric
      ? Array.from({ length: 21 }, (_, i) => i * 50)
      : Array.from({ length: 16 }, (_, i) => i * 10);
    for (let i = 0; i < options.length; i++) {
      const option = document.createElement("option");
      option.value = options[i];
      option.text = options[i];
      dropdown.appendChild(option);
    }
  } else if (dropdownId === "minConductivity") {
    // For conductivity, replace the options with values from 0 to 0.60 in increments of 0.05 when the Metric system is selected
    // and with values from 0 to 100 in increments of 10 when the English system is selected
    const options = isMetric
      ? Array.from({ length: 13 }, (_, i) => (i * 0.05).toFixed(2))
      : Array.from({ length: 11 }, (_, i) => i * 10);
    // console.log(`Generated options for ${dropdownId}: ${options}`);
    for (let i = 0; i < options.length; i++) {
      const option = document.createElement("option");
      option.value = options[i];
      option.text = options[i];
      dropdown.appendChild(option);
    }
  }
}
let labelsVisible = true; // Set to true by default

function handleButtonClick(
  activeButtonId,
  inactiveButtonId,
  labelsShouldBeVisible
) {
  document
    .getElementById(activeButtonId)
    .addEventListener("click", function () {
      this.classList.add("active");
      document.getElementById(inactiveButtonId).classList.remove("active");
      labelsVisible = labelsShouldBeVisible;
      toggleLabels();
    });
}

function toggleLabels() {
  cubes.forEach((cube) => {
    if (cube.userData.labelElement) {
      cube.userData.labelElement.style.display =
        labelsVisible && cube.visible ? "block" : "none";
    }
  });
}

handleButtonClick("labelsOn", "labelsOff", true);
handleButtonClick("labelsOff", "labelsOn", false);

document.getElementById("reset").addEventListener("click", function () {
  // document.getElementById("toggleAll").click();
  var radioButton = document.getElementById("toggleAll");
  if (!radioButton.checked) {
    radioButton.click();
  }
  camera.position.set(0, 6, 0);
});

document.getElementById("english").addEventListener("click", function () {
  isMetric = false;
  updateUnits();
});

document.getElementById("metric").addEventListener("click", function () {
  isMetric = true;
  updateUnits();
});

function updateUnits() {
  document.getElementById("english").classList.remove("active");
  document.getElementById("metric").classList.remove("active");

  if (isMetric) {
    document.getElementById("metric").classList.add("active");
  } else {
    document.getElementById("english").classList.add("active");
  }

  // Call toggleUnits to execute any additional logic needed when the unit type is changed
  toggleUnits();
}

// Call this function when the button is clicked
function toggleUnits() {
  const multiplier = isMetric ? 5 : 1 / 5;
  updateDropdownValues("minConductivity", multiplier);
  updateDropdownValues("minTensileStrength", multiplier);
  clearChart();
  removeAllLabels();
  hideAll();
  toggleDiv("softResistanceDiv", true);
  toggleDiv("flexLifeDiv", true);
  toggleDiv("stressRelaxationDiv", true);
  toggleDiv("springPropertiesDiv", true);
  toggleDiv("formabilityDiv", true);
  document.getElementById("toggleAll").checked = true;
  loadJSONData();
}

function toggleDiv(id, disable) {
  var div = document.getElementById(id);

  if (disable) {
    div.classList.add("disabled");
  } else {
    div.classList.remove("disabled");
  }
}

// Function to show only Alloy Conductors
function showAlloyConductors() {
  displayNonDefaultPosition();
  hideAll();
  toggleDiv("softResistanceDiv", false);
  toggleDiv("flexLifeDiv", false);
  toggleDiv("stressRelaxationDiv", true);
  toggleDiv("springPropertiesDiv", true);
  toggleDiv("formabilityDiv", true);
  cubes.forEach((cube) => {
    // Hide all cubes
    cube.visible = false;
    if (cube.userData.labelElement) {
      cube.userData.labelElement.style.display = "none";
    }
    // Show only Alloy Conductors cubes
    if (cube.userData.type.includes("Alloy Conductors")) {
      cube.visible = true;
      if (cube.userData.labelElement) {
        cube.userData.labelElement.style.display = labelsVisible
          ? "block"
          : "none";
      }
    }
  });
}

// Function to show only Alloy Wire
function showAlloyWire() {
  displayNonDefaultPosition();
  hideAll();
  toggleDiv("softResistanceDiv", true);
  toggleDiv("flexLifeDiv", true);
  toggleDiv("stressRelaxationDiv", false);
  toggleDiv("springPropertiesDiv", false);
  toggleDiv("formabilityDiv", false);
  cubes.forEach((cube) => {
    // Hide all cubes
    cube.visible = false;
    if (cube.userData.labelElement) {
      cube.userData.labelElement.style.display = "none";
    }
    // Show only Alloy Wire cubes
    if (cube.userData.type.includes("Alloy Wire")) {
      cube.visible = true;
      if (cube.userData.labelElement) {
        cube.userData.labelElement.style.display = labelsVisible
          ? "block"
          : "none";
      }
    }
  });
}

let hasRun = false;

function displayNonDefaultPosition() {
  if (!hasRun && camera.position.x === 0) {
    camera.position.set(1.4, 4.3, 4.0);
    hasRun = true;
  }
}
// Function to show only Fine Wire

function showFineWire() {
  displayNonDefaultPosition();
  hideAll();
  toggleDiv("softResistanceDiv", true);
  toggleDiv("flexLifeDiv", true);
  toggleDiv("stressRelaxationDiv", false);
  toggleDiv("springPropertiesDiv", false);
  toggleDiv("formabilityDiv", false);
  cubes.forEach((cube) => {
    // Hide all cubes
    cube.visible = false;
    if (cube.userData.labelElement) {
      cube.userData.labelElement.style.display = "none";
    }
    // Show only Fine Wire cubes
    if (cube.userData.type.includes("Fine Wire")) {
      cube.visible = true;
      if (cube.userData.labelElement) {
        cube.userData.labelElement.style.display = labelsVisible
          ? "block"
          : "none";
      }
    }
  });
}

function hideAll() {
  //
  document.getElementById("minConductivity").value =
    document.getElementById("minConductivity").options[0].value;
  document.getElementById("minTensileStrength").value =
    document.getElementById("minTensileStrength").options[0].value;
  //

  cubes.forEach((cube) => {
    cube.visible = false;
    if (cube.userData.labelElement) {
      cube.userData.labelElement.style.display = "none";
    }
  });
  // Update visibility of associated stacked cubes
  allCubes.forEach((c) => {
    c.visible =
      cubes.find((cube) => cube.userData.id === c.userData.baseCubeId)
        ?.visible || false;
  });
  //turn off filters
  // Get all checkboxes with the class 'performance-checkbox'
  var checkboxes = document.querySelectorAll(".performance-checkbox");

  // Loop through each checkbox and uncheck it
  for (var i = 0; i < checkboxes.length; i++) {
    checkboxes[i].checked = false;
  }
}

// Function to show all cubes
function showAll() {
  hideAll();
  toggleDiv("softResistanceDiv", true);
  toggleDiv("flexLifeDiv", true);
  toggleDiv("stressRelaxationDiv", true);
  toggleDiv("springPropertiesDiv", true);
  toggleDiv("formabilityDiv", true);
  cubes.forEach((cube) => {
    if (
      cube.userData.type.includes("Alloy Conductors") ||
      cube.userData.type.includes("Alloy Wire")
    ) {
      cube.visible = true;
      if (cube.userData.labelElement) {
        cube.userData.labelElement.style.display = labelsVisible
          ? "block"
          : "none";
      }
    } else if (cube.userData.type.includes("Fine Wire")) {
      cube.visible = false;
      if (cube.userData.labelElement) {
        cube.userData.labelElement.style.display = "none";
      }
    }
  });
}

// Function to display camera position
function updateCameraPositionDisplay(camera) {
  const cameraPositionElement = document.getElementById("cameraPosition");
  const position = camera.position;
  const rotation = camera.rotation;

  // Round the values for display
  const posX = position.x.toFixed(2);
  const posY = position.y.toFixed(2);
  const posZ = position.z.toFixed(2);
  const rotX = THREE.MathUtils.radToDeg(rotation.x).toFixed(2);
  const rotY = THREE.MathUtils.radToDeg(rotation.y).toFixed(2);
  const rotZ = THREE.MathUtils.radToDeg(rotation.z).toFixed(2);

  // Update the HTML element
  cameraPositionElement.innerHTML = `
           Camera Position:<br>
           X: ${posX}, Y: ${posY}, Z: ${posZ}<br>
           Rotation X: ${rotX}, Y: ${rotY}, Z: ${rotZ}
         `;
}

// Function to filter data based on the selected checkboxes
function filterData(dataTypes) {
  //console.log("filter the dta", dataTypes);
  var selectedProduct = document.querySelector(
    'input[name="productType"]:checked'
  );
  //console.log("the  product", selectedProduct.value);

  const minConductivity = Number(minConductivityDropdown.value);
  const minTensileStrength = Number(minTensileStrengthDropdown.value);

  scene.children.forEach((child) => {
    if (child.userData && child.userData.type) {
      if (
        selectedProduct.value === "Alloy Conductors" &&
        (child.userData.type === "Alloy Wire" ||
          child.userData.type === "Fine Wire")
      ) {
        return;
      }
      if (
        selectedProduct.value === "Fine Wire" &&
        (child.userData.type === "Alloy Conductors" ||
          child.userData.type === "Alloy Wire")
      ) {
        return;
      }
      if (
        selectedProduct.value === "Alloy Wire" &&
        (child.userData.type === "Alloy Conductors" ||
          child.userData.type === "Fine Wire")
      ) {
        return;
      }

      if (selectedProduct.value === "Fine Wire") {
        if (child.userData.baseCubeNAme !== "Fine Wire") {
          return;
        }
      }

      // If the child is a base cube, check if it meets the minimum requirements
      if (child.userData.id !== undefined) {
        if (
          (isMetric
            ? child.userData.y_conduct_m
            : child.userData.y_conduct_e) >= minConductivity &&
          (isMetric
            ? child.userData.x_tensile_m
            : child.userData.x_tensile_e) >= minTensileStrength
        ) {
          child.visible = true;
        } else {
          child.visible = false;
        }
      } else {
        // If the child is not a base cube, apply the filter
        if (
          dataTypes[child.userData.type] &&
          (isMetric
            ? child.userData.y_conduct_m
            : child.userData.y_conduct_e) >= minConductivity &&
          (isMetric
            ? child.userData.x_tensile_m
            : child.userData.x_tensile_e) >= minTensileStrength
        ) {
          child.visible = true;
        } else {
          child.visible = false;
        }
      }
    }
  });

  // Then, if only "soft_resistance" is selected, adjust the y-position of the cubes
  if (dataTypes.soft_resistance && !dataTypes.flex_life) {
    // Get all the base cubes
    const baseCubes = scene.children.filter(
      (child) => child.userData.id !== undefined
    );

    baseCubes.forEach((baseCube) => {
      // Get all the "soft_resistance" cubes for this base cube
      const softResistanceCubes = scene.children.filter(
        (child) =>
          child.visible &&
          child.userData.type === "soft_resistance" &&
          child.userData.baseCubeId === baseCube.userData.id
      );

      // Sort the cubes by their original y-position
      softResistanceCubes.sort(
        (a, b) => a.userData.originalY - b.userData.originalY
      );

      // Adjust the y-position of each cube
      softResistanceCubes.forEach((cube, index) => {
        cube.position.y =
          baseCube.position.y +
          baseCubeHeight +
          cubeSize +
          index * cubeSize -
          0.5;
      });
    });
  } else {
    // If the other filter is added back in, reset the y-position of each cube
    scene.children.forEach((child) => {
      if (child.userData && child.userData.originalY) {
        child.position.y = child.userData.originalY;
      }
    });
  }
  /////////////

  if (
    selectedProduct.value === "Alloy Wire" ||
    selectedProduct.value === "Fine Wire"
  ) {
    // If "formability" and "stress_relaxation" are selected, but "spring_properties" is not, adjust the y-position of the cubes
    if (
      dataTypes.formability &&
      !dataTypes.stress_relaxation &&
      !dataTypes.spring_properties
    ) {
      // Get all the base cubes
      const baseCubes = scene.children.filter(
        (child) => child.userData.id !== undefined
      );

      baseCubes.forEach((baseCube) => {
        // Get all the "formability" cubes for this base cube
        const formabilityCubes = scene.children.filter(
          (child) =>
            child.visible &&
            child.userData.type === "formability" &&
            child.userData.baseCubeId === baseCube.userData.id
        );

        // Sort the cubes by their original y-position
        formabilityCubes.sort(
          (a, b) => a.userData.originalY - b.userData.originalY
        );

        // Adjust the y-position of each "formability" cube to be just above the base cube
        formabilityCubes.forEach((cube, index) => {
          cube.position.y =
            baseCube.position.y +
            baseCubeHeight +
            cubeSize +
            index * cubeSize -
            0.5;
        });
      });
    } else if (
      dataTypes.formability &&
      dataTypes.stress_relaxation &&
      !dataTypes.spring_properties
    ) {
      // Get all the base cubes
      // Get all the base cubes
      const baseCubes = scene.children.filter(
        (child) => child.userData.id !== undefined
      );

      baseCubes.forEach((baseCube) => {
        // Get all the "formability" cubes for this base cube
        const formabilityCubes = scene.children.filter(
          (child) =>
            child.visible &&
            child.userData.type === "formability" &&
            child.userData.baseCubeId === baseCube.userData.id
        );

        // Get all the "stress_relaxation" cubes for this base cube
        const stressRelaxationCubes = scene.children.filter(
          (child) =>
            child.visible &&
            child.userData.type === "stress_relaxation" &&
            child.userData.baseCubeId === baseCube.userData.id
        );

        // If there are any "stress_relaxation" cubes, get the highest y position
        if (stressRelaxationCubes.length > 0) {
          const highestStressRelaxationY = Math.max(
            ...stressRelaxationCubes.map((cube) => cube.position.y)
          );

          // Adjust the y-position of each "formability" cube to be right after the "stress_relaxation" cubes
          formabilityCubes.forEach((cube, index) => {
            cube.position.y =
              highestStressRelaxationY + cubeSize + index * cubeSize;
          });
        }
      });
    } else if (
      dataTypes.formability &&
      !dataTypes.stress_relaxation &&
      dataTypes.spring_properties
    ) {
      // Get all the base cubes
      const baseCubes = scene.children.filter(
        (child) => child.userData.id !== undefined
      );

      baseCubes.forEach((baseCube) => {
        // Get all the "spring_properties" cubes for this base cube
        const springPropertiesCubes = scene.children.filter(
          (child) =>
            child.visible &&
            child.userData.type === "spring_properties" &&
            child.userData.baseCubeId === baseCube.userData.id
        );

        // Adjust the y-position of each "spring_properties" cube to be right after the base cube
        springPropertiesCubes.forEach((cube, index) => {
          cube.position.y =
            baseCube.position.y +
            baseCubeHeight +
            cubeSize +
            index * cubeSize -
            0.5;
        });

        // Get all the "formability" cubes for this base cube
        const formabilityCubes = scene.children.filter(
          (child) =>
            child.visible &&
            child.userData.type === "formability" &&
            child.userData.baseCubeId === baseCube.userData.id
        );

        // If there are any "spring_properties" cubes, get the highest y position
        if (springPropertiesCubes.length > 0) {
          const highestSpringPropertiesY = Math.max(
            ...springPropertiesCubes.map((cube) => cube.position.y)
          );

          // Adjust the y-position of each "formability" cube to be right after the "spring_properties" cubes
          formabilityCubes.forEach((cube, index) => {
            cube.position.y =
              highestSpringPropertiesY + cubeSize + index * cubeSize;
          });
        }
      });
    } else if (dataTypes.spring_properties && !dataTypes.stress_relaxation) {
      // Get all the base cubes
      const baseCubes = scene.children.filter(
        (child) => child.userData.id !== undefined
      );

      baseCubes.forEach((baseCube) => {
        // Get all the "soft_resistance" cubes for this base cube
        const softResistanceCubes = scene.children.filter(
          (child) =>
            child.visible &&
            child.userData.type === "spring_properties" &&
            child.userData.baseCubeId === baseCube.userData.id
        );

        // Sort the cubes by their original y-position
        softResistanceCubes.sort(
          (a, b) => a.userData.originalY - b.userData.originalY
        );

        // Adjust the y-position of each cube
        softResistanceCubes.forEach((cube, index) => {
          cube.position.y =
            baseCube.position.y +
            baseCubeHeight +
            cubeSize +
            index * cubeSize -
            0.5;
        });
      });
    } else {
      // If the other filter is added back in, reset the y-position of each cube
      scene.children.forEach((child) => {
        if (child.userData && child.userData.originalY) {
          child.position.y = child.userData.originalY;
        }
      });
    }
  }
}

// Function to create a single cube
function createCube(x, y, z, size, color, type) {
  const geometry = new THREE.BoxGeometry(size, size, size);
  const material = new THREE.MeshPhongMaterial({ color });
  const cube = new THREE.Mesh(geometry, material);

  cube.position.set(x, y + size / 2, z);
  // Add metadata indicating the type of data (e.g., "conductor", "alloy", "fire wire")
  cube.userData.type = type;
  return cube;
}
function createCubeHalf(x, y, z, size, color, type) {
  const geometry = new THREE.BoxGeometry(size, size / 2, size);
  const material = new THREE.MeshPhongMaterial({ color });
  const cube = new THREE.Mesh(geometry, material);
  cube.position.set(x, y + size / 2, z);
  // Add metadata indicating the type of data (e.g., "conductor", "alloy", "fire wire")
  cube.userData.type = type;
  return cube;
}

// Function to create the grid
function createGrid() {
  const gridTexture = new THREE.TextureLoader().load(
    "https://threejs.org/examples/textures/grid.png"
  );
  gridTexture.wrapS = THREE.RepeatWrapping;
  gridTexture.wrapT = THREE.RepeatWrapping;

  // Adjust the repeat values for rows and columns
  gridTexture.repeat.set(gridSizeX - 1, gridSizeY - 1);

  const floorGeometry = new THREE.PlaneGeometry(
    gridSizeX,
    gridSizeY,
    gridSizeX - 1,
    gridSizeY - 1
  );
  const floorMaterial = new THREE.MeshPhongMaterial({
    map: gridTexture,
    wireframe: true, // Display as wireframe
    color: 0xffffff, // Set the floor color to grey
  });
  const yPosition = 0;
  const floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.rotation.x = -Math.PI / 2;
  floor.position.set(0, yPosition, 0);

  scene.add(floor);
}

// Function to display camera position
function updateCameraPositionDisplay(camera) {
  const cameraPositionElement = document.getElementById("cameraPosition");
  const position = camera.position;
  const rotation = camera.rotation;

  // Round the values for display
  const posX = position.x.toFixed(2);
  const posY = position.y.toFixed(2);
  const posZ = position.z.toFixed(2);
  const rotX = THREE.MathUtils.radToDeg(rotation.x).toFixed(2);
  const rotY = THREE.MathUtils.radToDeg(rotation.y).toFixed(2);
  const rotZ = THREE.MathUtils.radToDeg(rotation.z).toFixed(2);

  // Update the HTML element
  cameraPositionElement.innerHTML = `
                       Camera Position:<br>
                       X: ${posX}, Y: ${posY}, Z: ${posZ}<br>
                       Rotation X: ${rotX}, Y: ${rotY}, Z: ${rotZ}
                     `;
}

// Create and align Y axis labels!
function createYAxisLabels(yAxisValues) {
  // Remove existing y-axis labels from the scene
  const yAxisLabelsToRemove = scene.children.filter(
    (child) => child.userData.isYAxisLabel
  );
  yAxisLabelsToRemove.forEach((label) => {
    scene.remove(label);
  });

  // Add new y-axis labels
  for (let i = 0; i < yAxisValues.length; i++) {
    let yPoint = yAxisValues[i];
    var xValueToMap = yPoint.x; // This value is in the range [0, 140]
    var mappedXValue = mapXValue(xValueToMap, 0, 150, 0, 1);

    var yValueToMap = Math.max(0, Math.min(yPoint.y - 1.5, 120)); // Ensure value stays within [0, 120]
    var mappedYValue;
    if (isMetric) {
      mappedYValue = mapYValue(yValueToMap, 0, 120, 0, 1);
    } else {
      mappedYValue = mapYValue(yValueToMap, 0, 120, 0, 1);
    }

    const x = (mappedXValue - 0.5) * gridSizeX;
    const y = 0; // You can adjust the vertical position if needed
    const z = (mappedYValue - 0.5) * gridSizeY;

    const labelGeometry = new THREE.TextGeometry(yPoint.label, {
      font: font,
      size: 0.2, // Adjust the size as needed
      height: 0.01, // Adjust the height as needed
    });

    // Calculate the width of the label geometry
    labelGeometry.computeBoundingBox();
    const labelWidth =
      labelGeometry.boundingBox.max.x - labelGeometry.boundingBox.min.x;

    const labelMaterial = new THREE.MeshBasicMaterial({
      color: 0x999999,
    });

    const labelMesh = new THREE.Mesh(labelGeometry, labelMaterial);

    // Rotate the label to be vertical
    labelMesh.rotation.x = -Math.PI / 2;

    // Adjust the X position to right-align the text
    let labelX = -8.2 - labelWidth; // Default position, right-align
    if (yPoint.label === "0") {
      // Special adjustment for the "0" label
      labelX += labelWidth - 0.18;
    }
    labelMesh.position.set(labelX, 0, z);

    if (yPoint.label === "0") {
      // Special adjustment for the "0" label
      labelMesh.position.z -= -0.08; // Move the "0" label down by 2 pixels
    }

    // Assign userData property to identify y-axis labels
    labelMesh.userData.isYAxisLabel = true;

    scene.add(labelMesh);
  }
}

let xAxisValues = [];
function createXAxisLabels(xAxisValues) {
  // Remove existing x-axis labels from the scene
  const xAxisLabelsToRemove = scene.children.filter(
    (child) => child.userData.isXAxisLabel
  );
  xAxisLabelsToRemove.forEach((label) => {
    scene.remove(label);
  });

  for (let i = 0; i < xAxisValues.length; i++) {
    let xPoint = xAxisValues[i];
    var mappedXValue;
    if (isMetric) {
      mappedXValue = mapXValueForMetrics(xPoint.x, 0, 1000, 0, 1); // Adjust the range as needed for metric values
    } else {
      mappedXValue = mapXValue(xPoint.x, 0, 150, 0, 1); // Use the original mapping function for unit values
    }
    var mappedYValue = mapYValue(xPoint.y, 0, 120, 0, 1);

    const x = (mappedXValue - 0.51) * gridSizeX;
    const y = 0; // You can adjust the vertical position if needed
    const z = (mappedYValue - 0.5) * gridSizeY;

    const labelGeometry = new THREE.TextGeometry(xPoint.label, {
      font: font,
      size: 0.2, // Adjust the size as needed
      height: 0.01, // Adjust the height as needed
    });

    const labelMaterial = new THREE.MeshBasicMaterial({
      color: 0x999999,
    });

    const labelMesh = new THREE.Mesh(labelGeometry, labelMaterial);

    // Rotate the label to be vertical
    labelMesh.rotation.x = -Math.PI / 2;

    const labelX = x;
    const labelY = 0;
    const labelZ = gridSizeY / 2 - cubeSize / 2 + 0.65; // Adjust the Z position to align with the bottom

    labelMesh.position.set(labelX, labelY, labelZ);

    if (xPoint.label === "0") {
      // Special adjustment for the "0" label
      labelMesh.position.y -= 0.1; // Move the "0" label down by 2 pixels
    }

    // Assign userData property to identify x-axis labels
    labelMesh.userData.isXAxisLabel = true;

    scene.add(labelMesh);
  }
}

function createAxisLabels() {
  const xAxisLabelGeometry = new THREE.TextGeometry(
    isMetric ? "TENSILE STRENGTH (Mpa)" : "TENSILE STRENGTH (ksi)",
    {
      font: font,
      size: 0.25, // Adjust the size as needed
      height: 0.01, // Adjust the height as needed
    }
  );

  const yAxisLabelGeometry = new THREE.TextGeometry(
    isMetric ? "CONDUCTIVITY (MS/m @ 20°C)" : "CONDUCTIVITY (% IACS @ 68°F)",
    {
      font: font,
      size: 0.24, // Adjust the size as needed
      height: 0.01, // Adjust the height as needed
    }
  );

  const labelMaterial = new THREE.MeshBasicMaterial({
    color: 0x999999,
  });

  const xAxisLabelMesh = new THREE.Mesh(xAxisLabelGeometry, labelMaterial);
  const yAxisLabelMesh = new THREE.Mesh(yAxisLabelGeometry, labelMaterial);

  // Rotate the labels to be vertical
  xAxisLabelMesh.rotation.x = -Math.PI / 2;
  //yAxisLabelMesh.rotation.x = -Math.PI / 2;

  // Rotate the Y-axis label to align with the Y-axis
  yAxisLabelMesh.rotation.x = -Math.PI / 2;
  yAxisLabelMesh.rotation.z = Math.PI / 2; // Rotate around the Z-axis

  // Position the labels at the midpoint of the respective axes
  // xAxisLabelMesh.position.set(0, gridSizeY / 2, gridSizeY / 2 - cubeSize / 2 + 0.5);
  // Position the labels at the midpoint of the respective axes
  const labelX = -2; // Midpoint of the X-axis
  const labelY = -0.5;
  const labelZ = 4.7; // Same Z position as the grid labels

  xAxisLabelMesh.position.set(labelX, labelY, labelZ);
  let ml = 0.85;
  if (isMetric) {
    ml = 1;
  }
  const yAxisLabelX = -gridSizeX / 2 - ml; // Left side of the X-axis

  const yAxisLabelY = 0;
  const yAxisLabelZ = 2.9; // Same Z position as the grid labels
  //console.log(gridSizeY / 2 - cubeSize / 2 + 0.5 );
  yAxisLabelMesh.position.set(yAxisLabelX, yAxisLabelY, yAxisLabelZ);

  scene.add(xAxisLabelMesh);
  scene.add(yAxisLabelMesh);
}

// Add the raycasting and click event handling code here
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Inside your animation loop, check for raycasting and mouse events
const onDocumentMouseClick = (event) => {
  //console.log("we have clicked");
  event.preventDefault();

  // Calculate the mouse position in normalized device coordinates
  // (-1 to 1) for both components
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  // Check for intersections with clickable objects (e.g., cubes)
  const intersects = raycaster.intersectObjects(scene.children, true);
  // console.log(intersects.length, "intersects");

  if (intersects.length > 0) {
    // Handle the click event for the clicked cube
    const clickedObject = intersects[0].object;
    //  console.log(clickedObject);

    if (clickedObject.userData.url) {
      window.open(clickedObject.userData.url, "_blank");
    }
  }
};

function createLabel(cube, i, labelContent) {
  console.log("createLabel");
  // Create a label for the cube
  let labelElement = document.createElement("div");
  labelElement.id = `label-${i}`;
  labelElement.style.position = "absolute";
  labelElement.style.backgroundColor = "#d5d5d5";
  labelElement.className = "cube-label";
  cube.userData.labelElement = labelElement;

  // Select the #fisk-component div
  let fiskComponent = document.getElementById("fisk-component");
  let chartContainer = document.getElementById("chart-container");

  // Create a wrapper element if it doesn't exist
  let labelWrapper = document.getElementById("label-wrapper");
  if (!labelWrapper) {
    labelWrapper = document.createElement("div");
    labelWrapper.id = "label-wrapper";
    // Append the wrapper to the body
    fiskComponent.appendChild(labelWrapper);
  }

  // Append the label to the wrapper
  labelWrapper.appendChild(labelElement);

  // Create a wrapper for the normal state
  let normalContent = document.createElement("div");
  normalContent.className = "initial-content";
  normalContent.innerHTML = labelContent.product_shortname;
  let tensileValue = isMetric
    ? labelContent.x_tensile_m
    : labelContent.x_tensile_e;
  let conductivityValue = isMetric
    ? labelContent.y_conduct_m
    : labelContent.y_conduct_e;

  //console.log("labelContent.x_tensile_m", labelContent.x_tensile_m);

  let tensileUnit = isMetric ? "MPa" : "ksi";
  let conductivityUnit = isMetric ? "MS/m" : "% IACS @ 68°F";

  let content = `<div class='content'>${labelContent.product_name}</div>
          <div class='content'><span class='font-base'>Tensile: </span> ${tensileValue} ${tensileUnit}</div>
          <div class='content'><span class='font-base'>Conductivity: </span>${conductivityValue} ${conductivityUnit}</div>
          <div class='content click'>CLICK FOR MORE</div>`;
  // Create a wrapper for the hover state
  let hoverContent = document.createElement("div");
  hoverContent.innerHTML = content;
  hoverContent.style.display = "none"; // Hide it initially
  labelElement.appendChild(hoverContent);
  labelElement.appendChild(normalContent);

  // Position the label at the base of the cube
  // This will depend on how your cubes are positioned and might require adjusting
  const vector = new THREE.Vector3();
  vector.setFromMatrixPosition(cube.matrixWorld);
  vector.project(camera);
  // const labelX = (vector.x * 0.5 + 0.5) * window.innerWidth;
  // const labelY = (vector.y * -0.5 + 0.5) * window.innerHeight;
  let adjustmentFactor = isMetric ? 5 : 0.5; // adjust this value as needed
  const labelX =
    (vector.x * adjustmentFactor + adjustmentFactor) * window.innerWidth;
  const labelY =
    (vector.y * -adjustmentFactor + adjustmentFactor) * window.innerHeight;
  labelElement.style.left = `${labelX}px`;
  labelElement.style.top = `${labelY}px`;

  labelElement.addEventListener("mouseover", function () {
    // Show hover state and hide normal state
    normalContent.style.display = "none";
    hoverContent.style.display = "block";
  });

  labelElement.addEventListener("mouseout", function () {
    // Show normal state and hide hover state
    normalContent.style.display = "block";
    hoverContent.style.display = "none";
  });

  labelElement.addEventListener("click", function () {
    // Navigate to product page
    window.location.href = "https://fiskalloy.com/";
  });
  labelElement.style.display = labelsVisible ? "block" : "none";
}

// Define an array to store your cubes
let cubes = [];
let allCubes = [];
function createScatterPlot(data) {
  scene = new THREE.Scene();
  scene.scale.set(0.55, 0.55, 0.55); // Adjust the scale as needed
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0xffffff);
  document.getElementById("chartContainer").appendChild(renderer.domElement);

  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  // Disable zoom
  controls.enableZoom = false;

  data.forEach((dataPoint, i) => {
    let xValueToMap, yValueToMap;

    if (isMetric) {
      xValueToMap = dataPoint.x_tensile_m;
      yValueToMap = dataPoint.y_conduct_m;
    } else {
      xValueToMap = dataPoint.x_tensile_e;
      yValueToMap = dataPoint.y_conduct_e;
    }

    const mappedXValue = isMetric
      ? mapXValue(xValueToMap, 0, 1000, 0, 1)
      : mapXValue(xValueToMap, 0, 150, 0, 1);
    const mappedYValue = isMetric
      ? mapYValue(yValueToMap, 0, 0.6, 0, 1)
      : mapYValue(yValueToMap, 0, 120, 0, 1);

    const x = (mappedXValue - 0.5) * gridSizeX;
    const y = 0;
    const z = (mappedYValue - 0.5) * gridSizeY;
    const properties = [
      "flex_life",
      "soft_resistance",
      "stress_relaxation",
      "spring_properties",
      "formability",
    ];
    const colors = ["#bece71", "#697ba6", "#bece71", "#6cb2c4", "#cfc250"];

    // Create base cube
    const baseCube = createCubeHalf(
      x,
      y,
      z,
      cubeSize,
      dataPoint.color[0],
      dataPoint.type[0]
    );
    baseCube.userData.url = dataPoint.product_url;
    baseCube.userData.y_conduct_e = dataPoint.y_conduct_e;
    baseCube.userData.x_tensile_e = dataPoint.x_tensile_e;
    baseCube.userData.y_conduct_m = dataPoint.y_conduct_m;
    baseCube.userData.x_tensile_m = dataPoint.x_tensile_m;
    baseCube.userData.id = i;
    scene.add(baseCube);
    cubes.push(baseCube);
    createLabel(baseCube, i, dataPoint);

    // Create stacks based on properties
    let cubeY = y;
    properties.forEach((property, index) => {
      const numCubes = dataPoint[property];
      for (let j = 1; j <= numCubes; j++) {
        const cube = createCube(
          x,
          cubeY + j * cubeSize - 0.1,
          z,
          cubeSize,
          colors[index],
          property
        );
        cube.userData.url = dataPoint.product_url;
        cube.userData.y_conduct_e = dataPoint.y_conduct_e;
        cube.userData.x_tensile_e = dataPoint.x_tensile_e;
        cube.userData.y_conduct_m = dataPoint.y_conduct_m;
        cube.userData.x_tensile_m = dataPoint.x_tensile_m;
        cube.userData.baseCubeId = i;
        cube.userData.originalY = cubeY + j * cubeSize + 0.1; // Store the original y-position for all cubes
        cube.visible = false;
        cube.userData.baseCubeNAme = dataPoint.type[0];
        allCubes.push(cube);
        scene.add(cube);
      }
      cubeY += numCubes * cubeSize;
    });
  });

  // Define your yAxisValues using a loop
  yAxisValues = [];
  if (isMetric) {
    // Metrics: Run from 0 to 120 by 10 increments, but start from 120
    for (let y = 120; y >= 0; y -= 10) {
      const labelValue = (y / 120) * 0.6; // Calculate the label value based on the current y value
      const label = labelValue.toFixed(2); // Format the label value as string
      yAxisValues.push({
        x: 0,
        y,
        z: -3.3333333333333335,
        label: label,
      });
    }
  } else {
    for (let y = 100; y >= 0; y -= 20) {
      yAxisValues.push({
        x: 0,
        y,
        z: -3.3333333333333335,
        label: y.toString(),
      });
    }
  }

  // Call the createYAxisLabels method
  createYAxisLabels(yAxisValues);

  // Define an array to store X-axis values. xAxisValues
  xAxisValues = [];

  if (isMetric) {
    for (let x = 0; x <= 1000; x += 50) {
      // You can convert the values to the appropriate metric units here
      xAxisValues.push({ x, y: 0, label: x.toString() });
    }
  } else {
    for (let x = 0; x <= 140; x += 10) {
      xAxisValues.push({ x, y: 0, label: x.toString() });
    }
  }

  // Call the function to create X-axis labels
  createXAxisLabels(xAxisValues);

  // Lights
  const light1 = new THREE.DirectionalLight(0xffffff, 1);
  light1.position.set(1, 1, 1);
  scene.add(light1);

  const light2 = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(light2);

  // Set the camera position
  //camera.position.set(1.4, 4.3, 5.86);
  camera.position.set(0, 6, 0);

  // Set the camera rotation
  camera.rotation.x = THREE.MathUtils.degToRad(-90);
  camera.rotation.y = THREE.MathUtils.degToRad(0);
  camera.rotation.z = THREE.MathUtils.degToRad(0);

  const animate = function () {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    controls.update();
    updateCameraPositionDisplay(camera);

    // Get the chartContainer size and position
    const chartContainer = document.getElementById("chartContainer");
    const { width, height, left, top } = chartContainer.getBoundingClientRect();

    // Get the position of the fisk-component
    const fiskComponent = document.getElementById("fisk-component");
    const fiskComponentRect = fiskComponent.getBoundingClientRect();

    // Update the position of the labels
    cubes.forEach((cube, i) => {
      const labelElement = document.getElementById(`label-${i}`);
      if (labelElement) {
        const vector = new THREE.Vector3();
        vector.setFromMatrixPosition(cube.matrixWorld);
        vector.project(camera);
        // Use the chartContainer size and position to calculate the label positions
        let labelX, labelY;
        let offsetX, offsetY;

        let factor = 5;
        if (isMetric) {
          // Calculate the offset based on the cube's height in the world space
          offsetX = camera.position.x * 15;
          offsetY = camera.position.y * -3 - fiskComponentRect.top;
          labelY = (vector.y * -0.5 + 0.5) * height + top + offsetY;
          //labelY = (vector.y * -0.5 + 0.5) * height;
        } else {
          offsetX = 0;
          offsetY = -fiskComponentRect.top;
          labelY = (vector.y * -0.5 + 0.5) * height + top + offsetY;
        }
        labelX = (vector.x * 0.5 + 0.5) * width + left + offsetX;
        labelElement.style.left = `${labelX}px`;
        labelElement.style.top = `${labelY}px`;
      }
    });
  };

  createGrid();
  createAxisLabels();
  animate();
}

////////

function mapXValue(value, min1, max1, min2, max2) {
  // Ensure the value is within the range [min1, max1]
  value = Math.min(Math.max(value, min1), max1);

  // Calculate the mapped value in the range [min2, max2]
  var mappedValue = ((value - min1) * (max2 - min2)) / (max1 - min1) + min2;

  return mappedValue;
}

function mapXValueForMetrics(value, min1, max1, min2, max2) {
  // Ensure the value is within the range [min1, max1]
  value = Math.min(Math.max(value, min1), max1);

  // Calculate the mapped value in the range [min2, max2]
  var mappedValue = ((value - min1) * (max2 - min2)) / (max1 - min1) + min2;

  return mappedValue;
}

function mapYValue(value, min1, max1, min2, max2) {
  // Ensure the value is within the range [min1, max1]
  value = Math.min(Math.max(value, min1), max1);

  // Calculate the mapped value in the inverted range [min2, max2]
  var mappedValue = (max1 - value) / (max1 - min1);

  return mappedValue;
}

function clearChart() {
  const chartContainer = document.getElementById("chartContainer");
  chartContainer.innerHTML = ""; // Clear the chart container
}
// Function to remove all labels
function removeAllLabels() {
  let labels = document.querySelectorAll(".cube-label");
  labels.forEach((label) => label.remove());
}

function showLoader() {
  document.getElementById("loader-container").style.display = "flex";
  document.getElementById("english").classList.add("disable-click");
  document.getElementById("metric").classList.add("disable-click");
}

function hideLoader() {
  document.getElementById("loader-container").style.display = "none";
  document.getElementById("english").classList.remove("disable-click");
  document.getElementById("metric").classList.remove("disable-click");
}

// Function to load JSON data
function loadJSONData() {
  showLoader();
  // You can adjust the URL to your JSON file
  fetch(
    "https://fiskalloy.com/wp-admin/admin-ajax.php?action=fskdm_alloy_graph_data"
  )
    .then((response) => response.json())
    .then((data) => {
      jsonData = data; // Store the loaded JSON data

      const alloyData = jsonData.filter(
        (item) =>
          item.type.includes("Alloy Wire") ||
          item.type.includes("Alloy Conductors")
      );

      const fineWireData = jsonData
        .filter((item) => item.type.includes("Fine Wire"))
        .map((item) => {
          // Create a new object to avoid mutating the original item
          let newItem = { ...item };
          // Flatten the type array
          newItem.type = [item.type.find((type) => type === "Fine Wire")];
          // Use the second color if it exists, otherwise use the first color
          newItem.color = item.color[1] ? [item.color[1]] : [item.color[0]];
          return newItem;
        });

      createScatterPlot(alloyData.concat(fineWireData));
      hideLoader();
    })
    .catch((error) => {
      console.error("Error loading JSON data:", error);
      hideLoader();
    });
}

const chartContainer = document.getElementById("chartContainer");

// Add click event listener to chartContainer
chartContainer.addEventListener("click", onDocumentMouseClick, false);

// Get the checkboxes
const checkboxes = document.querySelectorAll(
  'input[name="dataType"].performance-checkbox'
);

// Listen for changes to the checkboxes
checkboxes.forEach((checkbox) => {
  checkbox.addEventListener("change", () => {
    // Create an object with the visibility for each data type
    const dataTypes = {};
    checkboxes.forEach((checkbox) => {
      dataTypes[checkbox.value] = checkbox.checked;
    });

    // Filter the data
    filterData(dataTypes);
  });
});

// Get the dropdown elements
const minConductivityDropdown = document.getElementById("minConductivity");
const minTensileStrengthDropdown =
  document.getElementById("minTensileStrength");

// Add event listeners
minConductivityDropdown.addEventListener("change", filterMyData);
minTensileStrengthDropdown.addEventListener("change", filterMyData);

function filterMyData() {
  var selectedProduct = document.querySelector(
    'input[name="productType"]:checked'
  );

  const minConductivity = Number(minConductivityDropdown.value);
  const minTensileStrength = Number(minTensileStrengthDropdown.value);

  // Get the checkboxes
  const checkboxes = document.querySelectorAll('input[name="dataType"]');

  // Create an object with the visibility for each data type
  const dataTypes = {};
  checkboxes.forEach((checkbox) => {
    dataTypes[checkbox.value] = checkbox.checked;
  });

  // Loop through the base cubes
  cubes.forEach((cube) => {
    if (
      selectedProduct.value === "All" ||
      cube.userData.type.includes(selectedProduct.value)
    ) {
      const conductivity = isMetric
        ? cube.userData.y_conduct_m
        : cube.userData.y_conduct_e;
      const tensileStrength = isMetric
        ? cube.userData.x_tensile_m
        : cube.userData.x_tensile_e;

      if (
        conductivity >= minConductivity &&
        tensileStrength >= minTensileStrength
      ) {
        cube.visible = true;
        cube.userData.labelElement.style.display = labelsVisible
          ? "block"
          : "none";
      } else {
        cube.visible = false;
        cube.userData.labelElement.style.display = "none";
      }
    }
  });

  // Loop through the other cubes
  allCubes.forEach((cube) => {
    // Find the base cube that corresponds to this cube
    const baseCubeId = cube.userData.baseCubeId;
    const baseCube = cubes.find((c) => c.userData.id === baseCubeId);

    if (baseCube && baseCube.visible === false) {
      cube.visible = false;
    } else if (dataTypes[cube.userData.type]) {
      cube.visible = true;
    } else {
      cube.visible = false;
    }
  });
}
