
  fetch('info.txt')
    .then(response => response.text())
    .then(text => {
      const lines = text.trim().split('\n');
      const container = document.getElementById('accordionExample');

      lines.forEach((line, index) => {
        const [commandName, alternateName, category, syntax, description] = line.split('\t');

        const safeId = `collapse${index}`;
        const accordionItem = `
          <div class="accordion-item">
            <h2 class="accordion-header" id="heading${index}">
              <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#${safeId}" aria-expanded="false" aria-controls="${safeId}">
                <span class="command">${commandName}</span>
              </button>
            </h2>
            <div id="${safeId}" class="accordion-collapse collapse" aria-labelledby="heading${index}" data-bs-parent="#accordionExample">
              <div class="accordion-body">
                ${description}
              </div>
            </div>
          </div>
        `;
        container.insertAdjacentHTML('beforeend', accordionItem);
      });
    })