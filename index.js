const cohortID = "2406-FTB-MT-WEB-PT";
const webURL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/${cohortID}`;

const state = {
  parties: [],
};

const partyList = document.querySelector("#parties");

const addPartyForm = document.querySelector("#addParty");

addPartyForm.addEventListener("submit", addNewParty);

//GET party data from the API.
async function getPartyData() {
  try {
    const response = await fetch(`${webURL}/events`);
    const json = await response.json();
    state.parties = json.data;
    renderPartyData();
  } catch (error) {
    console.error(error);
  }
}

// Render list of the names, dates, times, locations, and descriptions of all parties
function renderPartyData() {
  if (!state.parties.length) {
    partyList.innerHTML = "<li>There are no parties.</li>";
    return;
  }

  const partyCards = state.parties.map((party) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <h2>${party.name}</h2>
      <p>${party.date}</p>
      <p>${party.location}</p>
      <p>${party.description}</p>
      <button onClick="deleteParty(${party.id})">Delete</button>
    `;
    return li;
  });

  partyList.replaceChildren(...partyCards);
}

// POST a new party to the API.
async function addNewParty(event) {
  event.preventDefault();
  try {
    const response = await fetch(`${webURL}/events`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: addPartyForm.name.value,
        date: addPartyForm.date.value,
        location: addPartyForm.location.value,
        description: addPartyForm.description.value,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to add party!");
    }

    getPartyData();
  } catch (error) {
    console.error(error);
  }
}

//DELETE a party from the API.
async function deleteParty(id) {
  try {
    const response = await fetch(`${webURL}/events/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete party!");
    }

    console.log("Party was successfully deleted.");
    getPartyData();
  } catch (error) {
    console.error(error);
  }
}

getPartyData();
