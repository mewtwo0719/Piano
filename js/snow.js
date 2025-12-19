const snow = document.createElement("div");
snow.className = "snow";
document.body.appendChild(snow);

for (let i = 0; i < 60; i++) {
  const flake = document.createElement("div");
  flake.className = "snowflake";
  flake.textContent = "❄";
  flake.style.left = Math.random() * 100 + "vw";
  flake.style.fontSize = 8 + Math.random() * 16 + "px";
  flake.style.animationDuration = 5 + Math.random() * 10 + "s";
  snow.appendChild(flake);
}
