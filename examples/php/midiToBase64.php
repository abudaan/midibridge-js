<?php

//$data = $_POST['data'];
//$input = fopen("php://input", "r");

$tmpFile = "P:/tmp.mid";

file_put_contents(
    $tmpFile, file_get_contents("php://input",r)
);

echo base64_encode(file_get_contents($tmpFile));

//file_put_contents("P:\workspace_2011\midibridge-js7\examples\php\tmp.mid", stream_get_contents($input));
//echo "aap";
?>
