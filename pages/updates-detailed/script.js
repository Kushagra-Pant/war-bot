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
      const accordionItem = `
        <div class="row g-4 mb-4">
          <div class="col-12">
            <div class="card h-100">
              <div class="card-body">
                <h5 class="card-title">${name}</h5>
                <h6 class="card-subtitle mb-2">${date}</h6>
                <p class="card-text">${content}</p>
              </div>
            </div>
          </div>
        </div>
      `;
      container.insertAdjacentHTML('beforeend', accordionItem)
    }
    console.log(updates)
  });
