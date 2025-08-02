class Update {
  constructor(name, date, content){
    this.name = name
    this.date = date
    this.content = content
  }
}

fetch('history.txt')
  .then(response => response.text())
  .then(text => {
    const container = document.getElementById('updates-container')
    const lines = text.split('\n\n')
    const updates = [];
    for (block of lines){
      l = block.split('\n')
      rawName = l.shift()
      rawDate = l.shift()
      rawContent = l.join("\n")

      const name = rawName.replace(/[*#]/g, '').trim()
      const date = rawDate.replace(/\*/g, '').trim()
      rawContent = rawContent.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/ -/g, '◦').replace(/\n/g, '<br>').trim()
      
      bulletSplit = rawContent.split("-")
      boldSplit = rawContent.split("**")
      rawContent = enclose(boldSplit, "<b>", "</b>")
      commandSplit = rawContent.split("`")
      const content = enclose(commandSplit, '<span class="command">', "</span>")

      updates.push(new Update(name, date, content))
      console.log(content.length)
    }
    let row = [];
    let widths = {};

    for (let i = 0; i < updates.length; i++) {
      let item = updates[i];

      let widthSum = 0;
      for (let j = 0; j < row.length; j++) {
        widthSum += getWidth(row[j]);
      }

      if (widthSum + getWidth(item) <= 12) {
        row.push(item);
      } else {
        let rankedrow = row.slice().sort((a, b) => b.length - a.length);
        console.log(rankedrow);

        row.forEach(r => {
          widths[r.name] = getWidth(r);
        });

        const sumWidths = () => {
          let sum = 0;
          for (let key in widths) {
            sum += widths[key];
          }
          return sum;
        };

        console.log("Widths before:", widths);
        console.log("Sum before:", sumWidths());

        let num = 0;
        while (sumWidths() < 12) {
          let name = rankedrow[num % rankedrow.length].name;
          widths[name] += 1;
          num += 1;
        }

        console.log("Adjusted widths:", widths);
        console.log("Sum after:", sumWidths());

        let accordionItem = '<div class="row g-4 mb-4">'
        for(let r = 0; r < row.length; r++){
          accordionItem += `
              <div class="col-${widths[row[r].name]}">
                <div class="card h-100">
                  <div class="card-body">
                    <h5 class="card-title text-center">${row[r].name}</h5>
                    <h6 class="card-subtitle mb-2 text-center">${row[r].date}</h6>
                    <p class="card-text text-center">${row[r].content}</p>
                  </div>
                </div>
              </div>
          `
        }
        accordionItem += '</div>'
        container.insertAdjacentHTML('beforeend', accordionItem)
        row = [item]
        widths = {}
        console.log('')
        }
      }
  });

function getWidth(update){
  length = update.content.length
  if (length > 750) return 12
  if (length > 400) return 6
  if (length > 200) return 4
  return 3
}

function enclose(array, prefix, suffix){
  str = ""
  for (let i = 0; i < array.length - 1; i++) {
    str += array[i];
    if (i % 2 == 0) {
      str += prefix;
    } else {
      str += suffix;
    }
  }
  if (array.length > 0) {
    str += array[array.length - 1];
  }
  return str
}