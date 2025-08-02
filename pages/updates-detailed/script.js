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
      const content = rawContent.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>').trim()

      updates.push(new Update(name, date, content))
      console.log(content.length)
    }
    let row = [];

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

        let widths = {};
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

        console.log("Sum before:", sumWidths());

        let num = 0;
        while (sumWidths() < 12) {
          let name = rankedrow[num % rankedrow.length].name;
          widths[name] += 1;
          num += 1;
        }

        console.log("Adjusted widths:", widths);
        console.log("Sum after:", sumWidths());

        accordionItem = '<div class="row g-4 mb-4">'
        for(r in row){
          accordionItem += `
            <div class="row g-4 mb-4">
              <div class="col-${widths[r.name]}">
                <div class="card h-100">
                  <div class="card-body">
                    <h5 class="card-title">${r.name}</h5>
                    <h6 class="card-subtitle mb-2">${r.date}</h6>
                    <p class="card-text">${r.content}</p>
                  </div>
                </div>
              </div>
            </div>
          `
        }
        accordionItem += '</div>'
        container.insertAdjacentHTML('beforeend', accordionItem)
        row = [item];
        console.log('');
        }
      }
  });

function getWidth(update){
  length = update.length
  if (length > 750) return 12
  if (length > 400) return 6
  if (length > 200) return 4
  return 3
}