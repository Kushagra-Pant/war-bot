class Medals {
  constructor(gold = 0, silver = 0, bronze = 0) {
    this.gold = gold;
    this.silver = silver;
    this.bronze = bronze;
  }
}

class Game {
  constructor(date, name, rankings){
    this.date = date
    this.name = name
    this.rankings = rankings // In the format of [(name, nation), (name, nation), (name, nation)]
  }

  renderHTML(){
    return `        
      <div class="col-4 card-group">
        <div class="card">
          <div class="card-header">
            <b>${this.date}</b>
          </div>
          <div class="card-body">
            <h1 class="title">${this.name}</h1>
            <h1 class="first-place"> ${this.rankings[0].name} 
              <div class="nation">${this.rankings[0].nation} </div>
            </h1>
            <h1 class="second-place">${this.rankings[1].name} 
              <div class="nation">${this.rankings[1].nation} </div>
            </h1>
            <h1 class="third-place">${this.rankings[2].name} 
              <div class="nation">${this.rankings[2].nation} </div>
            </h1>
            <img src="../../images/${this.name.replace("Game ", "")}.png">
          </div>
        </div>
      </div> `
  }
}

class TeamGame {
  constructor(date, name, gold, silver, bronze){
    this.date = date
    if(name.includes(" - ")){
      this.imageName = name.split(" - ")[0]
    } else {
      this.imageName = name
    }
    this.name = name
    this.gold = gold // List of players and their countries who got gold
    this.silver = silver // In the format [teamname, (name, nation), (name, nation)]
    this.bronze = bronze
  }

  renderHTML() {
    return `        
      <div class="col-4 card-group">
        <div class="card">
          <div class="card-header">
            <b>${this.date}</b>
          </div>
          <div class="card-body">
            <h1 class="title">${this.name}</h1>
            ${this.renderMedals(this.gold, "🏆", "first-place")}
            ${this.renderMedals(this.silver, "🥈", "second-place")}
            ${this.renderMedals(this.bronze, "🥉", "third-place")}
            <img src="../../images/${this.imageName.replace("Game ", "")}.png">
          </div>
        </div>
      </div> `
  }

  renderMedals(input, emoji, className){
    if (input.length == 0){
      return ""
    }
    return `<h1 class="${className}">${emoji} ${input[0]} 
              ${this.getTeamMembersHtml(input)}
            </h1>`
  }

  getTeamMembersHtml(input){
    let formatted = ""
    for(let i of input.slice(1)){
      formatted += `<div class="nation"><b>${i.name}:</b> ${i.nation} </div>`
    }
    return formatted
  }
}

const tableBody = document.getElementById("winners-table-body");
let winnersTable;

fetch('winners.txt')
  .then(response => response.text())
  .then(text => {
    const container = document.getElementById('winners-container')
    const table = document.getElementById('winners-table-body')
    const lines = text.trim().split('\n\n')
    const games = []
    var players = {} //In the format of {player: {individual: Medals, team: Medals}, player: {individual: Medals, team: Medals}, etc} - player is a string
    for (block of lines){
      l = block.split('\n')
      if (l[0] == "Team Game"){
        l.shift()
        const date = l.shift()
        const name = l.shift()
        let placements = {gold: [], silver: [], bronze: []}
        let current = ""
        for(let i of l){
          i = i.split(" ")
          switch(i.shift()){
            case "🏆":
              current = "gold"
              placements.gold.push(i.join(" "))
              continue
            case "🥈":
              current = "silver"
              placements.silver.push(i.join(" "))
              continue
            case "🥉":
              current = "bronze"
              placements.bronze.push(i.join(" "))
              continue
            default:
              break
          }
          i = i.join(" ").split(" | ")
          const data = {name: i[0], nation: i[1]}
          if(!(data.name in players)){
            players[data.name] = {individual: new Medals(), team: new Medals()}
          }
          switch(current){
            case("gold"):
              placements.gold.push(data)
              players[data.name].team.gold += 1
              break
            case("silver"):
              placements.silver.push(data)
              players[data.name].team.silver += 1
              break
            case("bronze"):
              placements.bronze.push(data)
              players[data.name].team.bronze += 1
              break
            default:
              break
          }
        }
        games.unshift(new TeamGame(date, name, placements.gold, placements.silver, placements.bronze))
      } else {
        const date = l.shift()
        const name = l.shift()
        let rankings = []
        for(i = 0; i < 6; i+=2){
          rankings.push({
            name: l[i],
            nation: l[i+1]
          })
          player = l[i].replace(/[🏆🥈🥉]/g, '').trim()
          if(!(player in players)){
            players[player] = {individual: new Medals(), team: new Medals()}
          }
          switch(Math.floor(i / 2)){
            case 0:
              players[player].individual.gold += 1
              break
            case 1:
              players[player].individual.silver += 1
              break
            case 2:
              players[player].individual.bronze += 1
              break
          }
        }
        games.unshift(new Game(date, name, rankings))
      }
    }
    console.log(players)
    var msg = ""
    for(i = 0; i < games.length; i++){
      if(i%3 == 0){
        msg += `<div class="row g-4 mb-4">` 
      }
      msg += games[i].renderHTML()
      if(i%3 == 2){
        msg += "</div>"
      }
    }
    if(games.length % 3 != 0){
      msg += "</div>"
    }
    container.insertAdjacentHTML('beforeend', msg)
    tablemsg = ""
    for(i in players){
      const total = new Medals(
        players[i].individual.gold + players[i].team.gold,
        players[i].individual.silver + players[i].team.silver,
        players[i].individual.bronze + players[i].team.bronze
      );

      tablemsg += `
      <tr>
        <th class="player">${i}</th>

        <td>${total.gold}</td>
        <td>${total.silver}</td>
        <td>${total.bronze}</td>

        <td>${players[i].individual.gold}</td>
        <td>${players[i].individual.silver}</td>
        <td>${players[i].individual.bronze}</td>

        <td>${players[i].team.gold}</td>
        <td>${players[i].team.silver}</td>
        <td>${players[i].team.bronze}</td>
      </tr>`;
    }
    table.insertAdjacentHTML('beforeend', tablemsg)
    winnersTable = $('#winners-table').DataTable({
      dom: 't',
      pageLength: 25,
      autoWidth: false,
      order: [
        [1, 'desc'], // 1 = gold column
        [2, 'desc'], // 2 = silver column
        [3, 'desc']  // 3 = bronze column
      ]
    });
    showMedals("total");
  });

function showMedals(mode) {
    winnersTable.columns([1,2,3,4,5,6,7,8,9]).visible(false);

    if (mode === "total") {
        winnersTable.columns([1,2,3]).visible(true);
        winnersTable.order([[1, "desc"], [2, "desc"], [3, "desc"]]);
    }

    if (mode === "individual") {
        winnersTable.columns([4,5,6]).visible(true);
        winnersTable.order([[4, "desc"], [5, "desc"], [6, "desc"]]);
    }

    if (mode === "team") {
        winnersTable.columns([7,8,9]).visible(true);
        winnersTable.order([[7, "desc"], [8, "desc"], [9, "desc"]]);
    }

    winnersTable.columns.adjust().draw(false);
    setActiveButton(mode + '-btn')
}

function setActiveButton(id) {
    ["total-btn", "individual-btn", "team-btn"].forEach(btn => {
        document.getElementById(btn).classList.remove("btn-secondary");
        document.getElementById(btn).classList.add("btn-outline-secondary");
    });

    document.getElementById(id).classList.remove("btn-outline-secondary");
    document.getElementById(id).classList.add("btn-secondary");
}