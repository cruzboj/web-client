let isDarkmodeWidgetAdded = false;

function addDarkmodeWidget() {
  console.log('Attempting to add darkmode widget...');

  if (isDarkmodeWidgetAdded) {
    console.log('Darkmode widget already added, skipping.');
    return;
  }

  const existingElements = document.querySelectorAll('.darkmode-toggle, .darkmode-layer--button, .darkmode-layer');
  if (existingElements.length > 0) {
    console.log(`Found ${existingElements.length} existing darkmode elements, removing them.`);
    existingElements.forEach(el => el.remove());
  }

const css = `
    /* כפתור העליון מעל הכול */
    .darkmode-toggle, .darkmode-layer--button {
        z-index: 11 !important;
        position: fixed !important;
        top: 10px !important;   
        right: 20px !important;
        
        .profile_Btn{
          color: white;
        }
    }
        
    /* השכבה שמטמיעה את מצב הלילה תישאר מאחור */
    .darkmode-layer {
        z-index: 0 !important;
    }

    .darkmode-background{
        background-image: url('./src/background.png') !important;
        /* background-image: url('https://w.wallhaven.cc/full/1j/wallhaven-1jqqjw.jpg') !important; */
        background-repeat: no-repeat !important;
        background-size: cover !important;

        margin: 0;
        padding: 0;
    }

    body.darkmode--activated .profile_Btn {
      color: black!important;
    }
`;
  let styleTag = document.getElementById('darkmode-custom-style');
  if (!styleTag) {
    styleTag = document.createElement('style');
    styleTag.id = 'darkmode-custom-style';
    document.head.appendChild(styleTag);
  }
  styleTag.textContent = css;

  // יצירת האופציות והווידג'ט:
  const options = {
    bottom: 'unset',
    right: '20px',
    left: 'unset',
    time: '0.5s',
    mixColor: '#fff',
    backgroundColor: '#ffffffff',
    buttonColorDark: '#292828ff',
    buttonColorLight: '#707070ff',
    saveInCookies: false,
    label: '<i class="fa-solid fa-circle-half-stroke text-light"></i>',
    autoMatchOsTheme: true
  };

  const darkmode = new Darkmode(options);
  darkmode.showWidget();
  console.log('Darkmode widget added successfully.');

  const button = document.querySelector('.darkmode-toggle') || document.querySelector('.darkmode-layer--button');
  if (button) {
    console.log('Button element found:', button.outerHTML);
  } else {
    console.log('No button element found with .darkmode-toggle or .darkmode-layer--button.');
  }

  isDarkmodeWidgetAdded = true;
}

window.removeEventListener('load', addDarkmodeWidget);
window.addEventListener('load', () => {
  console.log('Window load event triggered.');
  addDarkmodeWidget();
});
