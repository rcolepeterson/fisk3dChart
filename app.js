// Data for the stacked bar chart
const data = [
  { category: "A", values: [3, 2, 1] },
  { category: "B", values: [6, 5, 4] },
  { category: "C", values: [5, 7, 6] },
];

// Function to create the 3D stacked bar chart
function createStackedBarChart(data) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.getElementById("chartContainer").appendChild(renderer.domElement);

  const width = 0.2;
  const depth = 0.2;
  let y = 0;

  data.forEach((d) => {
    let x = 0;
    d.values.forEach((value) => {
      const height = value / 10; // Adjust height scale as needed
      const geometry = new THREE.BoxGeometry(width, height, depth);
      const material = new THREE.MeshPhongMaterial({ color: getRandomColor() });
      const cube = new THREE.Mesh(geometry, material);
      cube.position.set(x, y + height / 2, 0);
      scene.add(cube);
      x += width;
    });
    y += d3.max(d.values) / 10 + 0.1; // Adjust spacing between categories
  });

  camera.position.z = 5;

  const animate = function () {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  };

  animate();
}

// Function to generate a random color
function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

createStackedBarChart(data);
