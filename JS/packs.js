document.addEventListener("DOMContentLoaded", () => {
  // css styles for the packs section
  const style = document.createElement("style");
  style.innerHTML = `
    html, body {
      margin: 0;
      padding: 0;
      overflow: hidden;
      height: 100%;
    }

    #wrapper {
      position: absolute;
      width: 1920px;
      height: 1080px;
      transform-origin: top left;
    }

    .packs-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
      gap: 30px;
    }

    .pack {
      width: 300px;
      height: 600px;
      perspective: 1000px;
    }

    .pack-inner {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      transition: transform 0.3s ease;
      transform-style: preserve-3d;
    }

    .pack-header {
      height: 100px;
      background-image: url('image/Pack-Header.png');
      background-repeat: no-repeat;
      background-size: contain;
      background-position: bottom center;
    }

    @keyframes tearTop {
      0% { transform: translate(0, 0) rotate(0deg); opacity: 1; }
      30% { transform: translate(-10px, -10px) rotate(-5deg); opacity: 0.9; }
      60% { transform: translate(-30px, -30px) rotate(-15deg); opacity: 0.6; }
      100% { transform: translate(-100px, -100px) rotate(-25deg); opacity: 0; }
    }

    .tear-top {
      animation: tearTop 0.8s ease-in forwards;
    }

    .pack-body {
      flex: 1;
      background-image: url('image/Pack-Body.png');
      background-repeat: no-repeat;
      background-size: contain;
      background-position: top center;
    }

    @keyframes fadeout {
      0% { opacity: 1; transform: translateY(0); }
      100% { transform: translateY(200px); opacity: 0; }
    }

    .fadeout {
      animation: fadeout 1s forwards ease-in;
    }

    @keyframes fadeOutShrink {
      0% { opacity: 1; transform: scale(1); }
      100% { opacity: 0; transform: scale(0.8); }
    }

    .hide-with-animation {
      animation: fadeOutShrink 0.5s forwards;
    }
  `;
  document.head.appendChild(style);

  // <section  class="packs"> is expected to be present in the HTML
  const packsContainer = document.querySelector(".packs");
  if (!packsContainer) return;

  packsContainer.innerHTML = `
    <section id="wrapper">
      <section class="packs-container">
        <section class="pack">
          <section class="pack-inner">
            <section class="pack-header"></section>
            <section class="pack-body"></section>
          </section>
        </section>
        <section class="pack">
          <section class="pack-inner">
            <section class="pack-header"></section>
            <section class="pack-body"></section>
          </section>
        </section>
        <section class="pack">
          <section class="pack-inner">
            <section class="pack-header"></section>
            <section class="pack-body"></section>
          </section>
        </section>
      </section>
    </section>
  `;

  // size the warper to fit the screen size
  function scaleToFit() {
    const wrapper = document.getElementById("wrapper");
    if (!wrapper) return;
    const scaleX = window.innerWidth / 1920;
    const scaleY = window.innerHeight / 1080;
    const scale = Math.min(scaleX, scaleY);
    wrapper.style.transform = `scale(${scale})`;
  }

  window.addEventListener("resize", scaleToFit);
  scaleToFit();

  // open packs with animation
  let packChoose = null;
  const packs = document.querySelectorAll(".pack");

  packs.forEach((pack) => {
    let wasChosen = false;
    let wasOpened = false;

    pack.addEventListener("click", () => {
      if (!packChoose) {
        packChoose = pack;
        wasChosen = true;

        packs.forEach((otherPack) => {
          if (otherPack !== packChoose) {
            otherPack.classList.add("hide-with-animation");
            otherPack.addEventListener(
              "animationend",
              () => {
                otherPack.style.display = "none";
              },
              { once: true }
            );
          }
        });

        return;
      }

      if (pack === packChoose && wasChosen && !wasOpened) {
        wasOpened = true;

        const header = pack.querySelector(".pack-header");

        header.classList.remove("tear-top");
        void header.offsetWidth;
        header.classList.add("tear-top");

        header.addEventListener(
          "animationend",
          () => {
            const body = pack.querySelector(".pack-body");

            setTimeout(() => {
              body.classList.add("fadeout");
            }, 1000);
          },
          { once: true }
        );
      }
    });
  });

  // 3d effect on hover
  document.querySelectorAll(".pack").forEach((pack) => {
    const inner = pack.querySelector(".pack-inner");

    pack.addEventListener("mousemove", (e) => {
      const rect = pack.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -15;
      const rotateY = ((x - centerX) / centerX) * 15;

      inner.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    pack.addEventListener("mouseleave", () => {
      inner.style.transform = "rotateX(0deg) rotateY(0deg)";
    });
  });
});
