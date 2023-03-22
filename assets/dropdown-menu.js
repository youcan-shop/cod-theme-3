const dropdownBtn = $('.dropbtn');
const dropdownContent = $('.dropdown-content');
const dropdownOptions = dropdownContent?.querySelectorAll('li');

function showDropDownMenu(customContent) {
  if(customContent) {
      customContent.classList.toggle('show');
      dropdownBtn.classList.toggle('black-border');
  } else if (dropdownContent) {
      dropdownContent.classList.toggle('show');
      dropdownBtn.classList.toggle('black-border');
  }
}

const hideDropDownMenu = (event) => {
  if (!event.target.matches('.dropbtn, .dropbtn *')) {
    dropdownContent?.classList.remove('show');
    dropdownBtn?.classList.remove('black-border');
  }
};

window.addEventListener('click', (event) => hideDropDownMenu(event));

function selectOption(e) {
  const selectedOption = e.target;

  dropdownOptions.forEach((option) => {
    option.classList.remove('selected');
  });

  selectedOption.classList.add('selected');
  dropdownBtn.firstElementChild.textContent = selectedOption.textContent;
}

if(dropdownOptions) {
  dropdownOptions.forEach((option) => {
    option.addEventListener('click', selectOption);

    window.addEventListener('DOMContentLoaded', (event) => {
      if (option.classList.contains('selected')) {
        dropdownBtn.firstElementChild.textContent = option.textContent;
      }
    });
  });
}
