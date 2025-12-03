const orders = [
  {
    id: 1,
    name: "pedri",
    age: 23,
    gender: "Laki-laki",
    address: "jalan barcelona 8",
    phone: "081111111111",
    package: "Paket 10 (10x sesi)",
    sessions: 10,
  },
  {
    id: 2,
    name: "marc guiu",
    age: 55,
    gender: "Laki-laki",
    address: "chelsea london streets",
    phone: "082222222222",
    package: "Paket 3 (3x sesi)",
    sessions: 3,
  },
  {
    id: 4,
    name: "adelia",
    age: 51,
    gender: "Perempuan",
    address: "jalan rambutan 05",
    phone: "089191919191",
    package: "Paket 1 (1x sesi)",
    sessions: 1,
  },
  {
  id: 6,
  name: "jokomo",
  age: 53,
  gender: "Laki-laki",
  address: "jalan alpukat",
  phone: "082222222222",
  package: "Paket 6 (6x sesi)",
  sessions: 6,
  },
];

// Elemen DOM
const priceInput = document.getElementById("price-per-session");
const searchInput = document.getElementById("search-input");
const packageFilter = document.getElementById("package-filter");

const totalOrdersEl = document.getElementById("total-orders");
const totalSessionsEl = document.getElementById("total-sessions");
const totalRevenueEl = document.getElementById("total-revenue");

const ordersBody = document.getElementById("orders-body");
const packagesBody = document.getElementById("packages-body");

// Helper formatting Rupiah
function formatRupiah(amount) {
  return amount.toLocaleString("id-ID", {
    style: "currency",
    currency: "IDR",
  });
}

// Filter data sesuai input
function getFilteredOrders() {
  const search = searchInput.value.toLowerCase().trim();
  const pkg = packageFilter.value;

  return orders.filter((o) => {
    const matchSearch =
      !search ||
      o.name.toLowerCase().includes(search) ||
      o.address.toLowerCase().includes(search) ||
      o.phone.toLowerCase().includes(search);

    const matchPackage = pkg === "all" || o.package === pkg;

    return matchSearch && matchPackage;
  });
}

// Render tabel order
function renderOrders(data, pricePerSession) {
  ordersBody.innerHTML = "";

  if (data.length === 0) {
    const row = document.createElement("tr");
    const cell = document.createElement("td");
    cell.colSpan = 9;
    cell.textContent = "Tidak ada data.";
    row.appendChild(cell);
    ordersBody.appendChild(row);
    return;
  }

  data.forEach((o) => {
    const tr = document.createElement("tr");

    const revenue = o.sessions * pricePerSession;

    tr.innerHTML = `
      <td>${o.id}</td>
      <td>${o.name}</td>
      <td>${o.age}</td>
      <td>${o.gender}</td>
      <td>${o.address}</td>
      <td>${o.phone}</td>
      <td>${o.package}</td>
      <td>${o.sessions}</td>
      <td>${formatRupiah(revenue)}</td>
    `;

    ordersBody.appendChild(tr);
  });
}

// Render ringkasan per paket
function renderPackagesSummary(data, pricePerSession) {
  packagesBody.innerHTML = "";

  const map = new Map();

  data.forEach((o) => {
    if (!map.has(o.package)) {
      map.set(o.package, { orders: 0, sessions: 0 });
    }
    const entry = map.get(o.package);
    entry.orders += 1;
    entry.sessions += o.sessions;
  });

  if (map.size === 0) {
    const row = document.createElement("tr");
    const cell = document.createElement("td");
    cell.colSpan = 4;
    cell.textContent = "Tidak ada data.";
    row.appendChild(cell);
    packagesBody.appendChild(row);
    return;
  }

  map.forEach((value, pkg) => {
    const revenue = value.sessions * pricePerSession;
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${pkg}</td>
      <td>${value.orders}</td>
      <td>${value.sessions}</td>
      <td>${formatRupiah(revenue)}</td>
    `;
    packagesBody.appendChild(tr);
  });
}

// Update card ringkasan atas
function renderSummaryCards(data, pricePerSession) {
  const totalOrders = data.length;
  const totalSessions = data.reduce((sum, o) => sum + o.sessions, 0);
  const totalRevenue = totalSessions * pricePerSession;

  totalOrdersEl.textContent = totalOrders;
  totalSessionsEl.textContent = totalSessions;
  totalRevenueEl.textContent = formatRupiah(totalRevenue);
}

// Fungsi utama untuk refresh UI
function refreshDashboard() {
  const pricePerSession = Number(priceInput.value) || 0;
  const filtered = getFilteredOrders();

  renderOrders(filtered, pricePerSession);
  renderPackagesSummary(filtered, pricePerSession);
  renderSummaryCards(filtered, pricePerSession);
}

// Event listeners
priceInput.addEventListener("input", refreshDashboard);
searchInput.addEventListener("input", refreshDashboard);
packageFilter.addEventListener("change", refreshDashboard);

// Init pertama kali
refreshDashboard();
