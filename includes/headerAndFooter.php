<?php
function head() {
  $html = '
  <!doctype html>
  <html lang = "en">
  <head>
      <meta charset="utf-8">
      <title>ACNH542 - The Twitter Lifespan of Hackathons</title>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/d3/4.13.0/d3.min.js"></script>
      <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js"></script>
      <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js"></script>
      <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css">
      <link rel="stylesheet" type="text/css" href="css/main.css">
  </head>
  <body>';
  return $html;
}

function foot() {
  $html = '
  <br>
  <hr/>
  <div id="footer">
    <p> Created by Joshua Nappin [ACNH542] 2018 </p>
    <p> City University London </p>
  </div>
  <br>
  </body>
  </html>';
  return $html;
}
?>
