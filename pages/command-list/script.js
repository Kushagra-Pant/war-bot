fetch('info.txt')
  .then(response => response.text())
  .then(text => {
    const lines = text.trim().split('\n');

    lines.forEach((line, index) => {
      const container = document.getElementById(`accordion${index%3+1}`);
      const [commandName, alternateName, category, syntax, description] = line.split('\t');

      title = `<span class="command">${commandName}</span>`
      if (alternateName != ''){
        title += `&nbsp;/&nbsp;<span class="command">${alternateName}</span>`
      }
      if(category != ''){
        title += `<span class="badge ${category.replace(" ", "")}">${category}</span>`
      }

      descarray = description.split("`")
      desc = ""
      for(i = 0; i < descarray.length - 1; i++){
        desc += descarray[i]
        if(i%2 == 0){
          desc += `<span class="command">`
        } else {
          desc += `</span>`
        }
      }
      try{
        desc += descarray[descarray.length - 1]
      } catch {
      }        

      if(syntax != ""){
        desc = `<b>Syntax: </b> <span class="command">${syntax}</span> <br>${desc}`
      }

      const safeId = `collapse${index}`;
      const accordionItem = `
        <div class="accordion-item">
          <h2 class="accordion-header" id="heading${index}">
            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#${safeId}" aria-expanded="false" aria-controls="${safeId}">
              ${title}
            </button>
          </h2>
          <div id="${safeId}" class="accordion-collapse collapse" aria-labelledby="heading${index}" data-bs-parent="#accordionExample">
            <div class="accordion-body">
              ${desc}
            </div>
          </div>
        </div>
      `;
      container.insertAdjacentHTML('beforeend', accordionItem);
    });
  })