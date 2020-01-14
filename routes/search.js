var input = document.getElementById("textSearch");
input.addEventListener("keyup", function(event) {
    event.preventDefault();
    if (event.keyCode === 13) {
        alert("yes it works,I'm happy ");
    }
});