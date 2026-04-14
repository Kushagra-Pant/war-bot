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

fetch('winners.txt')
  .then(response => response.text())
  .then(text => {
    const container = document.getElementById('winners-container')
    const table = document.getElementById('winners-table-body')
    const lines = text.trim().split('\n\n')
    const games = []
    var players = {} //In the format of {player: (gold, silver, bronze), player: (gold, silver, bronze), etc} - player is a string
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
            players[data.name] = [0, 0, 0]
          }
          switch(current){
            case("gold"):
              placements.gold.push(data)
              players[data.name][0] += 1
              break
            case("silver"):
              placements.silver.push(data)
              players[data.name][1] += 1
              break
            case("bronze"):
              placements.bronze.push(data)
              players[data.name][2] += 1
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
            players[player] = [0, 0, 0]
          }
          players[player][Math.floor(i / 2)] += 1
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
    if(games.length%4 != 0){
      msg += "</div>"
    }
    container.insertAdjacentHTML('beforeend', msg)
    tablemsg = ""
    for(i in players){
      tablemsg += `
        <tr>
          <th class="player">${i}</th>
          <td class="gold">${players[i][0]}</td>
          <td class="silver">${players[i][1]}</td>
          <td class="bronze">${players[i][2]}</td>
        </tr>
      `
    }
    table.insertAdjacentHTML('beforeend', tablemsg)
    $('#winners-table').DataTable({
      dom: 't',
      pageLength: 25,
      order: [
        [1, 'desc'], // 1 = gold column
        [2, 'desc'], // 2 = silver column
        [3, 'desc']  // 3 = bronze column
      ]
    });
  });