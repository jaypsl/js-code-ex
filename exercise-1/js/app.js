'use strict';
(function(w, h) {
  $(document).ready(function() {
    const source = `
    {{#each users}}
    <div class='user'>
      <img src="{{ avatar }}" alt="" />
      <div>
        <h2>{{ name }}</h2>
        <div class='details'>
            <p>ID: {{ id }}</p>
            <p>Created At: {{formatDate createdAt }}</p>
        </div>
        <div class='action-buttons'>
            <button class="show-details">Show Details</button>
            <button class="delete danger">Delete</button>
        </div>
      </div>
    </div>
    {{/each}}`;
    const template = Handlebars.compile(source);

    Handlebars.registerHelper('formatDate', function(date) {
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      const createdDate = new Date(date);
      return createdDate.toLocaleDateString('en-US', options);
    });

    const renderUI = data => {
      const result = template(data);
      $('#results').html(result);
    };

    const usersObj = {};
    $.get('https://5d7a59779edf7400140aa043.mockapi.io/khojirakhimov', function(res) {
      usersObj.users = res;
      renderUI(usersObj);
    });

    $('body').on('click', '.show-details', function() {
      $(this)
        .parents('.user')
        .find('.details')
        .show();
    });

    $('body').on('click', '.delete', function() {
      const index = $(this)
        .parents('.user')
        .index();
      const deletedUser = usersObj.users.splice(index, 1);
      // const { id, name } = deletedUser[0];
      // const lastName = name.split(' ')[1];
      renderUI(usersObj);

      // $.ajax({
      //   url: `https://5d3607a986300e0014b63fd0.mockapi.io/${lastName}/:${id}`,
      //   method: 'DELETE',
      //   contentType: 'application/json',
      //   success: function(result) {
      //     console.log(result);
      //     renderUI(usersObj);
      //   },
      //   error: function(request, msg, error) {
      //     console.log(error);
      //   }
      // });
    });
  });
})(window, Handlebars);
