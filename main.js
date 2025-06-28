async function fetchDiceData() {
  const res = await fetch(
    'https://api.jsonbin.io/v3/b/64b8f19b9548541c29d8e8e7/latest',
    { headers: { 'X-Master-Key': '$2b$10$RANDOM_KEY_HERE' } }
  );
  const json = await res.json();
  return json.record;
}

async function analyzeAndPredict() {
  const rounds = await fetchDiceData();
  let tai = 0, xiu = 0, labels = [], dataTaiXiu = [];

  rounds.forEach((dice, i) => {
    const sum = dice.reduce((a, b) => a + b, 0);
    if (sum > 10) tai++;
    else xiu++;
    labels.push("Ván " + (i + 1));
    dataTaiXiu.push(sum);
  });

  const prediction = tai > xiu ? "XỈU" : "TÀI";
  const confidence = Math.round(Math.max(tai, xiu) / rounds.length * 100);

  document.getElementById("prediction").innerText =
    `🔮 Dự đoán: ${prediction} (${confidence}% tin cậy)`;

  const ctx = document.getElementById('chart').getContext('2d');
  new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Tổng điểm mỗi ván',
        data: dataTaiXiu,
        borderColor: '#00ffcc',
        backgroundColor: '#004d4d',
        tension: 0.3
      }]
    },
    options: {
      scales: { y: { beginAtZero: true, max: 18 } }
    }
  });
}
