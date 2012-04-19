<?php

$tmpFile = "tmp.mid";

file_put_contents(
    $tmpFile, file_get_contents("php://input",r)
);

echo base64_encode(file_get_contents($tmpFile));

?>
