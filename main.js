
async function fetchDiceData() {
  const response = await fetch('data.json');
  const rounds = await response.json();
  return rounds;
}

async function analyzeAndPredict() {
  const rounds = await fetchDiceData();
  let tai = 0, xiu = 0, labels = [], dataTaiXiu = [];

  rounds.forEach((dice, index) => {
    const sum = dice.reduce((a, b) => a + b, 0);
    if (sum > 10) tai++;
    else xiu++;
    labels.push("Ván " + (index + 1));
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
      labels: labels,
      datasets: [{
        label: 'Tổng điểm mỗi ván',
        data: dataTaiXiu,
        borderColor: '#00ffcc',
        backgroundColor: '#004d4d',
        tension: 0.3
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          max: 18
        }
      }
    }
  });
}
