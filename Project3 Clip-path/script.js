const active = document.querySelector(".section");
const main = document.querySelector(".main");

gsap.registerPlugin(ScrollTrigger);

gsap.to(main, {
  clipPath: "polygon(25% 25%, 75% 25%, 75% 75%, 50% 75%, 25% 75%)   ",

  scrollTrigger: {
    trigger: active,
    start: "top 100%",
    end: "top 30%",
    scrub: true,
  },
});
