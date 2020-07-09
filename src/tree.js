const config = {
  container: "#OrganiseChart1",
  rootOrientation: "NORTH", // NORTH || EAST || WEST || SOUTH
  hideRootNode: true,
  // levelSeparation: 30,
  siblingSeparation: 40,
  subTeeSeparation: 30,

  connectors: {
    type: "curve",
  },
  node: {
    HTMLclass: "nodeExample1",
  },
};

var tree;

export var buildTree = function (filteredCards) {
  const root = {};
  console.log("buildTree");
  var tmpNodes = filteredCards.map((card) => {
    var node = {
      text: {
        name: `#${card.idShort} - ${card.name}`,
      },
      stackChildren: true,
      HTMLid: card.id,
    };
    if (card.dependencies.length == 0) {
      node.parent = root;
      return node;
    }
    var cardDependencies = filteredCards.filter(
      (filteredCard) =>
        filteredCard.id != card.id && card.dependencies.includes(filteredCard.shortUrl)
    );
    node.parentId = !!cardDependencies[0] ? cardDependencies[0].id : null;
    return node;
  });
  console.log(tmpNodes)
  var treeNodes = tmpNodes.map((node) => {
    if (!node.parentId) return node;
    var parents = tmpNodes.filter(
      (otherNodes) => otherNodes.HTMLid == node.parentId
    );
    node.parent = parents[0] || root;
    return node;
  });

  const ALTERNATIVE = [
    config,
    root,
    ...treeNodes,
  ];

  
  new Treant(ALTERNATIVE);
};
