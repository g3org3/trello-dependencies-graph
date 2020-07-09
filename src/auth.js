import { flatten, uniqBy } from "lodash";
import { buildTree } from './tree'

var filteredCardsWithDependenciesChecklist = [];

var getCardChecklistsSuccess = function (checklists, card, cardsSize) {
  console.log(
    "CardChecklists success"
  );
  var dependencies = checklists
    .filter(checklist => checklist.name.toLowerCase() == "dependencies")
  card.dependencies = [];
  if (dependencies.length > 0 && dependencies[0].checkItems.length > 0) {
    card.dependencies = dependencies[0].checkItems.map((item) =>
      item.name.substr(0, item.name.lastIndexOf("/"))
    );
  }
  
  filteredCardsWithDependenciesChecklist.push(
    card
  );
  console.log(cardsSize)
  console.log(filteredCardsWithDependenciesChecklist.length);
  if (cardsSize == filteredCardsWithDependenciesChecklist.length) {
    buildTree(
      filteredCardsWithDependenciesChecklist
    );
  }
};

var getCardChecklistsError = function () {
  console.log("CardChecklists error");
};

var getLabelCards = function (cards) {
  var labelId = document.getElementById("label-select").value;
  var filteredCards = cards.filter(
    (card) => card.labels.map((label) => label.id).includes(labelId)
  );
  filteredCardsWithDependenciesChecklist = [];
  filteredCards.forEach((card) => {
    window.Trello.get(
      `cards/${card.id}/checklists`,
      (checklists) =>
        getCardChecklistsSuccess(checklists, card, filteredCards.length),
      getCardChecklistsError
    );
  });
};

var getListCardsSuccess = function (cards) {
  console.log("ListCards success");
  var select = document.getElementById("label-select");
  if (!select) {
    select = document.createElement("select");
    document.getElementById("root").appendChild(select);
    select.id = "label-select";
  } else {
    while (select.firstChild) {
      select.removeChild(select.lastChild);
    }
  }
  var uniqueLabels = uniqBy(flatten(cards.map((elt) => elt.labels)), 'id');
  uniqueLabels.map((elt) => {
    var option = document.createElement("option");
    option.text = elt.name;
    option.value = elt.id;
    select.appendChild(option);
  });
  getLabelCards(cards);
  select.onchange = () => getLabelCards(cards);
};

var getListCardsError = function () {
  console.log("ListCards error");
};

var getListCards = function () {
  var listId = document.getElementById("list-select").value;
  window.Trello.get(
    `lists/${listId}/cards`,
    getListCardsSuccess,
    getListCardsError
  );
};

var getBoardListsSuccess = function (data) {
  console.log("BoardLists success");
  var select = document.getElementById("list-select");
  if (!select) {
    select = document.createElement("select");
    document.getElementById("root").appendChild(select);
    select.id = "list-select";
  } else {
    while (select.firstChild) {
      select.removeChild(select.lastChild);
    }
  }
  data.map((elt) => {
    var option = document.createElement("option");
    option.text = elt.name;
    option.value = elt.id;
    select.appendChild(option);
  });
  getListCards();
  select.onchange = getListCards;
};

var getBoardListsError = function () {
  console.log("BoardLists error");
};

var getBoardLists = function () {
  var boardId  = document.getElementById('board-select').value
  window.Trello.get(
    `boards/${boardId}/lists`,
    getBoardListsSuccess,
    getBoardListsError
  );
};

var getBoardsSuccess = function (data) {
  console.log("Boards success");
  var select = document.getElementById("board-select")
  if (!select) {
    select = document.createElement("select");
    document.getElementById("root").appendChild(select);
    select.id = "board-select";
  } else {
    while (select.firstChild) {
      select.removeChild(select.lastChild);
    }
  }
  data.map((elt) => {
    var option = document.createElement("option");
    option.text = elt.name;
    option.value = elt.id;
    select.appendChild(option);
  })
  getBoardLists();
  select.onchange = getBoardLists;
};

var getBoardsError = function () {
  console.log("Me error");
};

var authenticationSuccess = function () {
  console.log("Successful authentication");
  window.Trello.get("members/me/boards", getBoardsSuccess, getBoardsError);
};

var authenticationFailure = function () {
  console.log("Failed authentication");
};

window.Trello.authorize({
  type: "popup",
  name: "Getting Started Application",
  scope: {
    read: "true",
    write: "true",
  },
  expiration: "never",
  success: authenticationSuccess,
  error: authenticationFailure,
});