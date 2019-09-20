"use strict";
(function(w, h) {
  $(document).ready(function() {
    const source = document.getElementById("user").innerHTML;
    const template = Handlebars.compile(source);

    Handlebars.registerHelper("formatDate", function(date) {
      const options = { year: "numeric", month: "short", day: "numeric" };
      const createdDate = new Date(date);
      return createdDate.toLocaleDateString("en-US", options);
    });

    const renderUI = data => {
      const result = template(data);
      $("#results").html(result);
    };

    const usersObj = {};
    $.get("https://5d7a59779edf7400140aa043.mockapi.io/khojirakhimov", function(
      res
    ) {
      usersObj.users = res;
      renderUI(usersObj);
    });

    $("body").on("click", ".show-details", function() {
      $(this)
        .parents(".user")
        .find(".details")
        .show();
    });

    $("body").on("click", ".delete", function() {
      const index = $(this)
        .parents(".user")
        .index();
      const deletedUser = usersObj.users.splice(index, 1);
      renderUI(usersObj);
    });
  });
})(window, Handlebars);
