document.addEventListener('DOMContentLoaded', () => {
    // TODO Load all post when entering room

    window.scrollTo(0, document.body.scrollHeight);

    // Connect to websocket
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);


    // When you add new message with submit, server should append it to the room's messages

    socket.on('connect', () => {
        document.querySelector("#new_message").onsubmit = function () {
            var new_message_body = document.querySelector("#new_message_body").value;
            if (!(new_message_body === '')) {
                socket.emit("new_message_submit", new_message_body);
                document.querySelector("#new_message_body").value = '';
            }
            return false
        }
    });


    // When a new message is announced, reload all messages on page
    socket.on('update_messages', updated_list => loadmessages(updated_list));

});

function loadmessages(updated_list) {
    const last_room = window.location.href.split("/").pop();
    if (updated_list[last_room]) {
        var messages_last_100 = document.getElementById("messages_last_100");
        messages_last_100.innerHTML = "";
        var posts;
        // console.log(updated_list); // debugging
        for (posts in updated_list[last_room]) {
            var timestamp = new Date(updated_list[last_room][posts][0] * 1000).toLocaleString();
            var post = document.createElement('div');
            var inHTML = '<div class="post"><span style=\'color: #946e09; font-weight:bold\'>';
            inHTML += updated_list[last_room][posts][1];
            inHTML += '</span> (timestamp:  ';
            inHTML += timestamp;
            inHTML += ") </br>";
            inHTML += updated_list[last_room][posts][2];
            inHTML += "</div>";
            post.innerHTML = inHTML;
            messages_last_100.appendChild(post);
        }
        window.scrollTo(0, document.body.scrollHeight);
        return false
    }}
