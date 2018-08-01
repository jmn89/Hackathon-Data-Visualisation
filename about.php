<?php
include 'includes/headerAndFooter.php';
echo head();
include 'includes/navigation.php';

function para1() {
  $string = "The visualization was created using the JavaScript visualization
  library D3.js (see https://d3js.org/).<br>
  The visualization contains two different views named ‘Lifespan of Hackathons’
  and ‘Followers vs Engagement’. These views contain scatter plots for each of
  the 5 Hackathons researched, and can be switched between using the Navigation
  Bar at the top of the page.";
  return $string;
}

function para2() {
  $string = "The first view plots Time against ‘Engagement’; which is how many
  ‘Likes’ and ‘Retweets’ a tweet receives. The X Axis (for Time) runs from 3 days
  prior to the Hackathon to 3 days after the Hackathon. The visualization can be
  scrolled downwards to reveal plots of other Hackathons.<br><br>

  Each node, or plot point, is a tweet that mentions the Hackathon within the
  specified time-period. Each node is a black circle that can be hovered over to
  reveal the tweet author’s image and other tweets the author has made. Clicking
  a node will enlarge the image; which is reset once the user moves the mouse away
  from the node. Hovering over a node will reveal the tweet’s text in the blue
  oblong above the graph.<br><br>

  Each node’s x-axis position is determined by the tweet’s timestamp, and its
  y-axis position determined by the sum of the tweet’s Likes and Retweets. To
  convey and encode further information, each node’s radius is determined by
  the number of followers the tweet’s author has. For example, a tweet made by
  an author with 1000 followers will be represented by a circle proportionally
  larger than a circle representing a tweet made by an author with only 10
  followers.<br><br>

  Each graph is overlaid with 3 trendlines, each of which convey a 12-hour moving
  average of Engagement (the sum of Likes and Retweets), the number of Followers
  tweets are being broadcast to (i.e. the total number of Followers of accounts
  who have tweeted in that 12-hour window), and the number of tweets being made.
  The legend on each graph indicates which line colour represents which average.";

  return $string;
}

function para3() {
  $string = "The second view plots Followers along the x-axis against Engagement
  (the sum of Retweets and Likes) along the y-axis. This view can be selected using
  the navigation bar. Each graph represents a different dataset, i.e. a different
  Hackathon.<br><br>

  Each node is a coloured circle that represents a Twitter user who mentioned the
  Hackathon between 3 days before and 3 days after the event. Each node’s x-axis
  position is determined by the number of Followers the user has, while the y-axis
  position is determined by the sum of Likes and Retweets the user’s tweet has.
  If a User has made multiple tweets about the event, a single node represents
  that user and its y-axis position is determined by the average Engagement of
  the multiple tweets.<br><br>

  Each graph is overlaid with a Line of Best Fit, which conveys the degree of
  correlation between Followers and Engagement for the Hackathon. A grey box
  displays the Line of Best Fit’s slope value. A dataset with a stronger correlation
  than another will have a sharper slope.";
  return $string;
}
?>

<br>
<div class="card text-white bg-primary mb-3" id="aboutCard" style="max-width: 60rem;">
  <div class="card-header">About</div>
  <div class="card-body">
    <p class="card-text"> <?php echo para1() ?> </p>
    <h5 class="card-title">View 1 - Lifespan of Hackathons</h5>
    <p class="card-text"> <?php echo para2() ?> </p>
    <h5 class="card-title">View 2 – Followers vs Engagement</h5>
    <p class="card-text"> <?php echo para3() ?> </p>
  </div>
</div>

<?php
echo foot();
?>
