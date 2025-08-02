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
    console.log(updates)
  });
