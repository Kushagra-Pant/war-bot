class Game {
  constructor(date, name, rankings){
    this.date = date
    this.name = name
    this.rankings = rankings // In the format of [(name, nation), (name, nation), (name, nation)]
  }
}

fetch('winners.txt')
  .then(response => response.text())
  .then(text => {
    const container = document.getElementById('winners-container')
    const lines = text.split('\n\n')
    const games = [];
    for (block of lines){
      l = block.split('\n')
      const name = l.shift()
      const date = l.shift()
      var rankings = []
      for(i = 0; i < 6; i+=2){
        rankings.push({
          name: l[i],
          nation: l[i+1]
        })
      }
      games.unshift(Game(name, date, rankings))
    }
    var msg = ""
    for(i = 0; i < games.length; i++){
      if(i%4 == 0){
        msg += `<div class="row g-4 mb-4">` 
      }
      msg += `
        <div class="col-3">
          <div class="card">
            <div class="card-header">
              <b>${games[i].date}</b>
            </div>
            <div class="card-body">
              <h1 class="title">${games[i].name}</h1>
              <h1 class="first-place"> ${games[i].rankings[0].name} 
                <div class="nation">${games[i].rankings[0].nation} </div>
              </h1>
              <h1 class="second-place">${games[i].rankings[1].name} 
                <div class="nation">${games[i].rankings[1].nation} </div>
              </h1>
              <h1 class="third-place">${games[i].rankings[2].name} 
                <div class="nation">${games[i].rankings[2].nation} </div>
              </h1>
              <img src="../../images/${games[i].name.replace("Game ", "")}.png">
            </div>
          </div>
        </div>
      `
      if(i%4 == 3){
        msg += "</div>"
      }
    }
    if(games.length%4 != 0){
      msg += "</div>"
    }
    container.insertAdjacentHTML('beforeend', msg)
  });