<?php 

function basePath($path = "") {
    return __DIR__ . '/' . $path;
};


/**
 * inspect a value
 * @param mixed $value
 * @return void
 */

 function inspect($value) {
    echo "<pre>";
    var_dump($value);
    echo "</pre>";
 }


/**
 * inspect a value and kill script after
 * @param mixed $value
 * @return void
 */

 function inspectAndDie($value) {
    echo "<pre>";
   die(var_dump($value)); 
    echo "</pre>";
 }


?>
