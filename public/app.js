const toCurrency = (price) =>
  new Intl.NumberFormat("de-DE", {
    currency: "UAH",
    style: "currency",
  }).format(price);

document.querySelectorAll(".price").forEach((node) => {
  node.textContent = toCurrency(node.textContent);
});

const $card = document.querySelector("#card");

if ($card) {
  $card.addEventListener("click", (e) => {
    if (e.target.classList.contains("js-remove")) {
      const id = e.target.dataset.id;

      fetch("/card/remove/" + id, {
        method: "delete",
      })
        .then((res) => res.json())
        .then((card) => {
          console.log(card);

          if (card.courses.length) {
            const html = card.courses
              .map(({ title, count, id }) => {
                return `
                <tr>
                  <td>${title}</td>
                  <td>${count}</td>
                  <td>
                    <button class="btn btn-small js-remove" data-id="${id}">
                      Remove
                    </button>
                  </td>
                </tr>
              `;
              })
              .join("");

            $card.querySelector("tbody").innerHTML = html;
            $card.querySelector(".price").textContent = toCurrency(card.price);
          } else {
            $card.innerHTML = "<p>Card is empty !!!</p>";
          }
        });
    }
  });
}
