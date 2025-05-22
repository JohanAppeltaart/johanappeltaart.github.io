   let cinemaData = [];

    // Load bioscopen.txt automatically
    async function loadCinemas() {
      try {
        const response = await fetch('bioscopen.txt');
        const text = await response.text();
        const lines = text.trim().split('\n');
        cinemaData = lines.map(line => {
          const [name, coords] = line.split('=');
          const [lat, lon] = coords.split(',').map(Number);
          return { name: name.trim(), lat, lon };
        });
      } catch (error) {
        document.getElementById('output').textContent = "Failed to load bioscopen.txt.";
      }
    }

    // Haversine distance function
    function getDistance(lat1, lon1, lat2, lon2) {
      const R = 6371;
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLon = (lon2 - lon1) * Math.PI / 180;
      const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon/2) * Math.sin(dLon/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      return R * c;
    }

    async function findClosestCinema() {
      const output = document.getElementById('output');
      output.textContent = "Loading cinema data…";
      
      await loadCinemas();

      if (cinemaData.length === 0) {
        output.textContent = "No cinema data available.";
        return;
      }

      if (!navigator.geolocation) {
        output.textContent = "Geolocation is not supported by your browser.";
        return;
      }

      output.textContent = "Getting your location…";

      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;

        let closest = null;
        let minDistance = Infinity;
        let distanceArray = []

        cinemaData.forEach(cinema => {
          const dist = getDistance(latitude, longitude, cinema.lat, cinema.lon);
          distanceArray.push({dist, cinema})
        });

        distanceArray.sort((a,b)=>a.dist - b.dist)

        output.innerHTML = "";
        listOfCinemas = makeDom(output, "div", null, "cinemaList");
        // number = makeDom(listOfCinemas,"div");
        // cinemaName = makeDom(listOfCinemas,"div");
        // afstand = makeDom(listOfCinemas,"div");

        for (let joran = 0; joran < distanceArray.length; joran++) {
            const element = distanceArray[joran];
            row = makeDom(listOfCinemas, "div", null, "row")
            if(joran%2 == 0){row.classList.add("uneven");}
            makeDom(row, "p",`🎬 ${joran+1}th \n` );
            
            makeDom(row, "p",`${element.cinema.name}\n` );
            
            makeDom(row, "p",`Afstand: ${element.dist.toFixed(2)} km \n `);

            // output.innerHTML +=  `🎬 ${joran+1}th Closest cinema: <strong>${element.cinema.name}</strong>📍 Distance: ${element.dist.toFixed(2)} km <br>`;

        }
      }, () => {
        output.textContent = "Unable to retrieve your location.";
      });
    }


function makeDom(parent, name, text, className) {
  const element = document.createElement(name);
  if (text) {
    element.innerText = text;
  }

  if (className) {
    element.setAttribute("class", className);
  }

  if (parent) {
    parent.appendChild(element);
  }

  return element;
}