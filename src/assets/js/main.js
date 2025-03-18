document.addEventListener("DOMContentLoaded", function () {
  $(function () {
    const scrolls = $(".scroll-event");

    scrolls.each(function () {
      $(this).data("hasScrolled", false);
    });

    function handleScroll() {
      scrolls.each(function () {
        const $this = $(this);
        const hasScrolled = $this.data("hasScrolled");
        if (hasScrolled) return;

        const s_top = $this.offset().top;
        const st = $(window).scrollTop();
        const wh = $(window).height();
        
        if (s_top <= st + wh - 40) {
          $this.addClass("is-active");
          $this.data("hasScrolled", true);
        }
      });
    }

    handleScroll();

    $(window).on("scroll", handleScroll);
  });
});
