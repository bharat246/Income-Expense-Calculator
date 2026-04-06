let data = JSON.parse(localStorage.getItem("records")) || [];
let editId = null;

const descInput = document.getElementById("desc");
const amountInput = document.getElementById("amount");
const typeInput = document.getElementById("type");
const list = document.getElementById("list");

document.getElementById("add-btn").addEventListener("click", addRecord);
document.getElementById("reset-btn").addEventListener("click", resetInputs);

document.querySelectorAll("input[name='filter']").forEach(radio => {
    radio.addEventListener("change", renderList);
});

function addRecord() {
    const desc = descInput.value;
    const amount = Number(amountInput.value);
    const type = typeInput.value;

    if (!desc || !amount) {
        alert("All fields are required");
        return;
    }

    const record = { id: Date.now(), desc, amount, type };

    if (editId) {
        const index = data.findIndex(item => item.id === editId);
        data[index] = { ...record, id: editId };
        editId = null;
        document.getElementById("add-btn").innerText = "Add";
    } else {
        data.push(record);
    }

    saveData();
    renderList();
    resetInputs();
}

function renderList() {
    list.innerHTML = "";
    const filter = document.querySelector("input[name='filter']:checked").value;

    const filteredData = data.filter(item => 
        filter === "all" ? true : item.type === filter
    );

    filteredData.forEach(item => {
        const li = document.createElement("li");
        li.className = `item ${item.type}`;
        li.innerHTML = `
            <span>${item.desc} - ₹${item.amount}</span>
            <div class="actions">
                <button class="edit" onclick="editRecord(${item.id})">Edit</button>
                <button class="delete" onclick="deleteRecord(${item.id})">Delete</button>
            </div>
        `;
        list.appendChild(li);
    });

    updateSummary();
}

function updateSummary() {
    const income = data.filter(i => i.type === "income")
                       .reduce((t, i) => t + i.amount, 0);

    const expense = data.filter(i => i.type === "expense")
                        .reduce((t, i) => t + i.amount, 0);

    document.getElementById("total-income").innerText = "₹" + income;
    document.getElementById("total-expense").innerText = "₹" + expense;
    document.getElementById("balance").innerText = "₹" + (income - expense);
}

function editRecord(id) {
    const item = data.find(i => i.id === id);
    descInput.value = item.desc;
    amountInput.value = item.amount;
    typeInput.value = item.type;

    editId = id;
    document.getElementById("add-btn").innerText = "Update";
}

function deleteRecord(id) {
    data = data.filter(item => item.id !== id);
    saveData();
    renderList();
}

function resetInputs() {
    descInput.value = "";
    amountInput.value = "";
    typeInput.value = "income";
}

function saveData() {
    localStorage.setItem("records", JSON.stringify(data));
}

renderList();
