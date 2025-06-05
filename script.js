document.addEventListener("DOMContentLoaded", () => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((response) => response.json())
      .then((users) => {
        populateUserTable(users);
        populateSummary(users);
        renderCharts(users);
        addMapMarkers(users);
        window.cachedUsers = users; // Armazena para acesso posterior
      });
  });
  
  function populateUserTable(users) {
    const tbody = document.getElementById("userTableBody");
    tbody.innerHTML = "";
    users.forEach((user) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${user.name}</td>
        <td>${user.username}</td>
        <td>${user.email}</td>
        <td>${user.address.city}</td>
        <td>${user.company.name}</td>
        <td>
          <button 
            class="btn btn-sm btn-outline-primary" 
            data-bs-toggle="modal" 
            data-bs-target="#userModal" 
            data-user-id="${user.id}">
            Ver detalhes
          </button>
        </td>
      `;
      tbody.appendChild(row);
    });
  
    tbody.querySelectorAll("button[data-user-id]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const userId = parseInt(e.target.getAttribute("data-user-id"));
        const user = window.cachedUsers.find((u) => u.id === userId);
        if (user) showUserDetails(user);
      });
    });
  }
  
  function populateSummary(users) {
    const summary = document.getElementById("summaryCards");
    const totalUsers = users.length;
    const totalCities = new Set(users.map((u) => u.address.city)).size;
    const totalCompanies = new Set(users.map((u) => u.company.name)).size;
  
    summary.innerHTML = `
      <div class="col-md-4">
        <div class="card p-4 shadow-sm">
          <h5>Total de Usuários</h5>
          <p class="display-6 fw-bold">${totalUsers}</p>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card p-4 shadow-sm">
          <h5>Cidades Diferentes</h5>
          <p class="display-6 fw-bold">${totalCities}</p>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card p-4 shadow-sm">
          <h5>Empresas Diferentes</h5>
          <p class="display-6 fw-bold">${totalCompanies}</p>
        </div>
      </div>
    `;
  }
  
  function renderCharts(users) {
    const cidadeCounts = {};
    const empresaCounts = {};
  
    users.forEach((u) => {
      cidadeCounts[u.address.city] = (cidadeCounts[u.address.city] || 0) + 1;
      empresaCounts[u.company.name] = (empresaCounts[u.company.name] || 0) + 1;
    });
  
    new Chart(document.getElementById("cidadeChart"), {
      type: "bar",
      data: {
        labels: Object.keys(cidadeCounts),
        datasets: [{
          label: "Usuários por Cidade",
          data: Object.values(cidadeCounts),
          backgroundColor: "#0d6efd",
        }],
      },
    });
  
    new Chart(document.getElementById("empresaChart"), {
      type: "pie",
      data: {
        labels: Object.keys(empresaCounts),
        datasets: [{
          label: "Usuários por Empresa",
          data: Object.values(empresaCounts),
          backgroundColor: ["#0d6efd", "#6c757d", "#198754", "#ffc107", "#dc3545"],
        }],
      },
    });
  }
  
  function showUserDetails(user) {
    document.getElementById("modalUserName").textContent = user.name;
    document.getElementById("modalUserUsername").textContent = user.username;
    document.getElementById("modalUserEmail").textContent = user.email;
    document.getElementById("modalUserPhone").textContent = user.phone;
    document.getElementById("modalUserWebsite").textContent = user.website;
    document.getElementById("modalUserCompany").textContent = user.company.name;
    document.getElementById("modalUserAddress").textContent = `${user.address.street}, ${user.address.suite}, ${user.address.city} - ${user.address.zipcode}`;
    document.getElementById("modalUserGeo").textContent = `Lat: ${user.address.geo.lat}, Lng: ${user.address.geo.lng}`;
    document.getElementById("modalUserCompanyCatchPhrase").textContent = user.company.catchPhrase;
    document.getElementById("modalUserCompanyBs").textContent = user.company.bs;
  }
  
  function addMapMarkers(users) {
    const map = L.map("map").setView([0, 0], 2);
  
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
    }).addTo(map);
  
    users.forEach((user) => {
      const lat = parseFloat(user.address.geo.lat);
      const lng = parseFloat(user.address.geo.lng);
      if (!isNaN(lat) && !isNaN(lng)) {
        L.marker([lat, lng])
          .addTo(map)
          .bindPopup(`<strong>${user.name}</strong><br>${user.address.city}`);
      }
    });
  }
  